import {test,expect} from '@playwright/test';
const route='/tools/harmonic-intersections';
const maj=[null,3,5,4,5,null],am=[null,0,2,0,1,null],dm=[null,5,7,5,6,null];
const card=(page,id)=>page.getByRole('region',{name:'Sistema '+id,exact:true});
async function manual(page,id,frets){
 await card(page,id).getByRole('button',{name:'Posizione manuale',exact:true}).click();
 for(let i=0;i<6;i++)await page.getByRole('combobox',{name:id+', tasto corda '+(6-i),exact:true}).selectOption(frets[i]===null?'mute':String(frets[i]));
}
async function chips(page){return page.locator('.hi-result-grid .note-chip-group').evaluateAll(groups=>groups.map(g=>[...g.querySelectorAll('.note-chip')].map(n=>n.textContent)));}
for(const width of [1440,390,320]){
 test('Manual comparison, editing, focus and layout at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(route);
  await manual(page,'A',maj);await manual(page,'B',am);
  expect(await chips(page)).toEqual([['C','E','G'],['B'],['A']]);
  expect(await page.locator('.hi-result').evaluate(el=>el.getBoundingClientRect().bottom < document.querySelector('.hi-editors').getBoundingClientRect().top)).toBe(true);
  await expect(page.getByRole('button',{name:'Stai modificando B',exact:true})).toBeVisible();
  if(width>700){await expect(page.getByRole('region',{name:'Editor A',exact:true})).toBeVisible();await page.getByRole('button',{name:'Posizione A · attiva editor',exact:true}).click();}
  else{await expect(page.getByRole('region',{name:'Editor A',exact:true})).toBeHidden();await card(page,'A').getByRole('button',{name:'Apri tastiera A',exact:true}).click();}
  await expect(page.getByRole('button',{name:'Stai modificando A',exact:true})).toBeVisible();
  const a=page.getByRole('region',{name:'Editor A',exact:true});
  await a.getByRole('button',{name:'Corda 1, tasto 24, E6',exact:true}).press('Enter');
  await expect(card(page,'A').locator('.hi-note-summary')).toContainText('E6');
  await expect(card(page,'B').locator('.hi-frets')).toHaveText('× · 0 · 2 · 0 · 1 · ×');
  await expect(a.getByRole('button',{name:'Corda 1, tasto 24, E6, A∩B, classe comune',exact:true})).toBeFocused();
  expect(await a.locator('.guitar-board').evaluate(el=>el.scrollLeft>0)).toBe(true);
  await a.getByRole('button',{name:'Corda 1, tasto 24, E6, A∩B, classe comune',exact:true}).press('Space');
  await expect(card(page,'A').locator('.hi-frets')).toHaveText('× · 3 · 5 · 4 · 5 · ×');
  await page.getByText('Registro, caselle, raddoppi e conteggi',{exact:true}).click();
  await expect(page.locator('.hi-result')).toContainText('Altezze coincidenti: G3');
  await expect(page.locator('.hi-result')).toContainText('Caselle coincidenti: nessuna');
  await page.getByText('Mappa delle classi · occorrenze 0–12',{exact:true}).click();
  await page.getByRole('button',{name:'5-8',exact:true}).click();
  await page.getByRole('button',{name:'1 · E',exact:true}).click();
  expect(await chips(page)).toEqual([['C','E','G'],['B'],['A']]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(card(page,'A')).toBeVisible();await expect(card(page,'B')).toBeVisible();
 });
 test('Mixed C Lydian / Dm7 and reverse comparison at '+width,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(route);
  await card(page,'A').getByRole('combobox',{name:'Mode',exact:true}).selectOption('lydian');await manual(page,'B',dm);
  expect(await chips(page)).toEqual([['C','D','A'],['E','F♯','G','B'],['F']]);
  await expect(page.locator('.hi-result')).toContainText('F della posizione B è fuori dalla scala A');
  await page.getByText('Registro, caselle, raddoppi e conteggi',{exact:true}).click();
  await expect(page.locator('.hi-result')).toContainText('Coincidenze di registro e caselle non valutabili');
  await card(page,'B').getByRole('button',{name:'Dal catalogo',exact:true}).click();
  await card(page,'B').getByRole('combobox',{name:'Mode',exact:true}).selectOption('lydian');
  await manual(page,'A',dm);
  expect(await chips(page)).toEqual([['C','D','A'],['F'],['E','F♯','G','B']]);
  await card(page,'B').getByRole('button',{name:'Posizione manuale',exact:true}).click();
  expect(await chips(page)).toEqual([['C','D','F','A'],[],[]]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
test('Exact, explicit catalog transfer preserves physical state and other system',async({page})=>{
 await page.goto(route);await manual(page,'A',maj.map(f=>f===null?null:f+12));await manual(page,'B',am);
 await card(page,'A').getByRole('button',{name:'Apri tastiera A',exact:true}).click();
 await page.getByRole('button',{name:'Cerca nel catalogo A',exact:true}).click();
 const apply=page.getByRole('button',{name:'Apri materiale nel catalogo A',exact:true});await expect(apply).toBeDisabled();
 const select=page.getByRole('combobox',{name:'Materiale corrispondente A',exact:true});
 const value=await select.locator('option').evaluateAll(options=>options.find(o=>o.textContent==='C Ionian · Diatonic seventh · I Cmaj7')?.value);
 expect(value).toBeDefined();await select.selectOption(value);
 await expect(card(page,'A').locator('.hi-frets')).toHaveText('× · 15 · 17 · 16 · 17 · ×');
 await apply.click();await expect(card(page,'A').getByRole('button',{name:'Dal catalogo',exact:true})).toHaveAttribute('aria-pressed','true');
 await card(page,'A').getByRole('button',{name:'Posizione manuale',exact:true}).click();
 await expect(card(page,'A').locator('.hi-frets')).toHaveText('× · 15 · 17 · 16 · 17 · ×');
 await expect(card(page,'B').locator('.hi-frets')).toHaveText('× · 0 · 2 · 0 · 1 · ×');
});
test('Persistence, catalog reservoirs, view state and independent persistent clearing',async({page})=>{
 await page.goto(route);await card(page,'A').getByRole('combobox',{name:'Mode',exact:true}).selectOption('lydian');
 await manual(page,'A',maj);await manual(page,'B',am);await page.reload();
 await expect(card(page,'A').locator('.hi-frets')).toHaveText('× · 3 · 5 · 4 · 5 · ×');
 await expect(card(page,'B').locator('.hi-frets')).toHaveText('× · 0 · 2 · 0 · 1 · ×');
 await expect(page.getByRole('button',{name:'Stai modificando B',exact:true})).toBeVisible();
 await card(page,'A').getByRole('button',{name:'Dal catalogo',exact:true}).click();
 await expect(card(page,'A').getByRole('combobox',{name:'Mode',exact:true})).toHaveValue('lydian');
 await card(page,'A').getByRole('button',{name:'Posizione manuale',exact:true}).click();
 await page.getByRole('button',{name:'Svuota posizione A',exact:true}).click();await page.reload();
 await expect(card(page,'A').locator('.hi-frets')).toHaveText('× · × · × · × · × · ×');
 await expect(card(page,'B').locator('.hi-frets')).toHaveText('× · 0 · 2 · 0 · 1 · ×');
 await card(page,'A').getByRole('button',{name:'Dal catalogo',exact:true}).click();await expect(card(page,'A').getByRole('combobox',{name:'Mode',exact:true})).toHaveValue('lydian');
});
test('Empty, disjoint, doubled, octave-shifted and crossed positions',async({page})=>{
 await page.goto(route);await manual(page,'A',Array(6).fill(null));await manual(page,'B',Array(6).fill(null));
 await expect(page.locator('.hi-result')).toContainText('Nessuna nota nei due input');
 await manual(page,'A',[null,3,null,null,null,null]);await manual(page,'B',[null,null,1,null,null,null]);
 await expect(page.locator('.hi-result')).toContainText('Nessuna classe comune');
 await manual(page,'A',[null,3,2,0,1,0]);await manual(page,'B',maj);
 await expect(card(page,'A').locator('.hi-card-foot')).toContainText('5 note · 3 classi');
 await page.getByText('Registro, caselle, raddoppi e conteggi',{exact:true}).click();await expect(page.locator('.hi-result')).toContainText('Raddoppi A: C: C3');
 await manual(page,'A',maj);await manual(page,'B',maj.map(f=>f===null?null:f+12));
 await expect(page.locator('.hi-result')).toContainText('Altezze coincidenti: nessuna');
 expect(await chips(page)).toEqual([['C','E','G','B'],[],[]]);
 await manual(page,'A',[null,10,0,1,0,null]);await expect(card(page,'A').locator('.hi-note-summary')).toHaveText('D3 · G3 · A♭3 · B3');
});
test('Malformed recovery is isolated and blocked storage still permits editing',async({page})=>{
 await page.goto('/');
 await page.evaluate(()=>{localStorage.setItem('gtl.harmonic.A.v1','{broken');localStorage.setItem('gtl.harmonic.B.v1',JSON.stringify({version:1,mode:'manual',manual:[null,0,2,0,1,null]}));localStorage.setItem('gtl.harmonic.view.v1',JSON.stringify({version:1,editing:'bad',range:{start:4,end:99}}));});
 await page.goto(route);await expect(card(page,'A').getByRole('button',{name:'Dal catalogo',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(card(page,'B').locator('.hi-frets')).toHaveText('× · 0 · 2 · 0 · 1 · ×');
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('Blocked');}});});
 await page.reload();await expect(page.locator('.hi-storage-warning')).toBeVisible();
 await manual(page,'A',maj);await expect(card(page,'A').locator('.hi-frets')).toHaveText('× · 3 · 5 · 4 · 5 · ×');
});
test('Enharmonic manual G-flat shares the class of catalog F-sharp, no harmonic root is inferred',async({page})=>{
 await page.goto(route);await card(page,'A').getByRole('combobox',{name:'Mode',exact:true}).selectOption('lydian');
 await manual(page,'B',[null,3,4,3,4,null]);
 expect(await chips(page)).toEqual([['C','F♯'],['D','E','G','A','B'],['E♭','B♭']]);
 await expect(card(page,'B').locator('.hi-note-summary')).toHaveText('C3 · G♭3 · B♭3 · E♭4');
 await expect(card(page,'B').getByRole('heading',{name:'Posizione B',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Cerca nel catalogo B',exact:true}).click();
 await expect(card(page,'B').getByRole('button',{name:'Posizione manuale',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('button',{name:'Apri materiale nel catalogo B',exact:true})).toBeDisabled();
});
