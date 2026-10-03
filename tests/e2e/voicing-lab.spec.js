import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const previewDir='/tmp/voicing-lab-preview';
const root=page=>page.getByRole('combobox',{name:'Fondamentale interpretativa'});
const frets=page=>page.getByTestId('position-frets');
const pitches=page=>page.getByTestId('position-pitches');

test('all three examples, root changes without lock, exact D reading and contextual ambiguity',async({page})=> {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/tools/voicing-lab');
 await expect(page.getByRole('heading',{name:'Voicing Lab',exact:true})).toBeVisible();
 await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');
 await expect(pitches(page)).toHaveAttribute('data-pitches','48,55,59,64');
 for(let r=0;r<12;r++) {
  await root(page).selectOption(String(r));
  await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');
  await expect(pitches(page)).toHaveAttribute('data-pitches','48,55,59,64');
  await expect(page.getByTestId('v-group')).toHaveText('V-2 · 1 / 0 / 1');
 }
 await root(page).selectOption('9');
 await expect(page.locator('.vl-analysis>.vl-reading h3')).toHaveText('Am9/C');
 await expect(page.locator('.vl-analysis>.vl-reading .vl-omissions')).toHaveText('Omesse: fondamentale');
 await page.getByRole('button',{name:'Am7 / C6'}).click();
 await expect(pitches(page)).toHaveAttribute('data-pitches','45,52,55,60');
 await expect(page.locator('.vl-analysis>.vl-reading')).toContainText('Formula completa');
 await expect(page.locator('.vl-analysis>.vl-reading')).toContainText('Interpretazione ambigua');
 await root(page).selectOption('0');
 await expect(page.locator('.vl-analysis>.vl-reading h3')).toHaveText('C6/A');
 await page.getByRole('button',{name:'Cø7 / A♭9'}).click();
 await root(page).selectOption('2');
 await expect(page.locator('.vl-analysis>.vl-reading h3')).toHaveText('D7(♭9,♭13)/C');
 await expect(page.locator('.vl-analysis>.vl-reading .vl-omissions')).toHaveText('Omesse: fondamentale e quinta');
 await expect(pitches(page)).toHaveAttribute('data-pitches','48,54,58,63');
 await expect(pitches(page)).toContainText('F♯3');
 await expect(frets(page)).toHaveText('× · 3 · 4 · 3 · 4 · ×');
 expect(errors).toEqual([]);
});

test('locked search preserves position, exact candidates are explicit and failed search keeps theoretical pitches',async({page})=> {
 await page.goto('/tools/voicing-lab');
 await page.getByRole('button',{name:'Conserva nelle ricerche'}).click();
 await page.getByRole('tab',{name:'Costruisci',exact:true}).click();
 await page.getByRole('combobox',{name:'Trasformazione'}).selectOption('drop23');
 await page.getByRole('combobox',{name:'Ottava della fondamentale'}).selectOption('4');
 await page.getByRole('combobox',{name:'Close iniziale'}).selectOption('0');
 await expect(page.getByTestId('theory-pitches')).toHaveText('E3 — G3 — C4 — B4');
 await page.getByRole('button',{name:'Cerca queste altezze'}).click();
 await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');
 await expect(page.getByRole('status')).toContainText('La posizione conservata non è stata sostituita');
 await expect(page.locator('.vl-results button').first()).toBeVisible();
 await page.locator('.vl-results button').first().click();
 await expect(pitches(page)).toHaveAttribute('data-pitches','52,55,60,71');
 await root(page).selectOption('9');
 await expect(pitches(page)).toHaveAttribute('data-pitches','52,55,60,71');
 await expect(page.getByRole('status')).toContainText('cerca di nuovo');
 await page.getByRole('combobox',{name:'Tasto massimo',exact:true}).selectOption('0');
 await page.getByRole('button',{name:'Cerca queste altezze'}).click();
 await expect(page.getByRole('status')).toContainText('0 posizioni trovate');
 await expect(page.getByText('Nessuna posizione nei filtri.',{exact:false})).toBeVisible();
 await expect(pitches(page)).toHaveAttribute('data-pitches','52,55,60,71');
});

test('unlocked search adopts exact position and crossed voices are ordered by sound',async({page})=> {
 await page.goto('/tools/voicing-lab');
 await page.getByRole('tab',{name:'Costruisci',exact:true}).click();
 await page.getByRole('button',{name:'Cerca queste altezze'}).click();
 await expect(pitches(page)).toHaveAttribute('data-pitches','48,55,59,64');
  await page.getByRole('tab',{name:'Analizza una posizione',exact:true}).click();
  for(const s of [1,6]) await page.getByRole('combobox',{name:`Corda ${s}`,exact:true}).selectOption('x');
 await page.getByRole('combobox',{name:'Corda 5',exact:true}).selectOption('15');
 for(const s of [4,3,2]) await page.getByRole('combobox',{name:`Corda ${s}`,exact:true}).selectOption('0');
 await expect(pitches(page)).toHaveAttribute('data-pitches','50,55,59,60');
 await expect(pitches(page)).toHaveAttribute('data-strings','4,3,2,5');
 await expect(page.getByTestId('v-group')).toHaveText('V-1 · 0 / 0 / 0');
 await page.getByRole('combobox',{name:'Approccio',exact:true}).selectOption('greene');
 await expect(page.getByRole('heading',{name:'Ted Greene — spaziatura delle voci'})).toBeVisible();
 await page.getByText('I quattordici gruppi',{exact:true}).click();
 await expect(page.locator('.vl-vtable>span')).toHaveCount(14);
 await page.getByRole('button',{name:'Corda 1, tasto 0, E4',exact:true}).click();
 await expect(page.getByTestId('v-group')).toHaveText('V non assegnato');
});

for(const size of [{name:'desktop',width:1440,height:1100},{name:'mobile',width:390,height:844},{name:'mobile-small',width:320,height:740}]) {
 test(`${size.name} preview, no page overflow, accessible controls and fretboard editing`,async({page})=> {
  await page.setViewportSize({width:size.width,height:size.height});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/tools/voicing-lab');
  await expect(pitches(page)).toHaveAttribute('data-pitches','48,55,59,64');
  await root(page).selectOption('9');
  await expect(pitches(page)).toHaveAttribute('data-pitches','48,55,59,64');
  await root(page).selectOption('0');
  const unnamed=await page.locator('.vl-app select').evaluateAll(items=>items.filter(item=>!item.closest('label')).length);
  expect(unnamed).toBe(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.getByRole('button',{name:'Corda 1, tasto 0, E4',exact:true}).click();
  await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · 0');
  await expect(page.getByTestId('v-group')).toHaveText('V non assegnato');
  await page.getByRole('button',{name:'Corda 1 muta',exact:true}).click();
  await page.getByRole('button',{name:'Cmaj7 / Am9'}).click();
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await mkdir(previewDir,{recursive:true});
  await page.screenshot({path:`${previewDir}/${size.name}.png`,fullPage:true});
  await page.getByRole('tab',{name:'Costruisci',exact:true}).click();
  await page.getByRole('button',{name:'Cerca queste altezze'}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:`${previewDir}/${size.name}-build.png`,fullPage:true});
  expect(errors).toEqual([]);
 });
}

test('Dmaj7 spelling in closes, all drops and search results; result spelling stays tied to searched formula',async({page})=> {
 await page.goto('/tools/voicing-lab');
 await page.getByRole('tab',{name:'Costruisci',exact:true}).click();
 await root(page).selectOption('2');
 const close=page.getByRole('combobox',{name:'Close iniziale'});
 await expect(close.locator('option')).toHaveText([
  '1 · D3 F♯3 A3 C♯4','2 · F♯3 A3 C♯4 D4','3 · A3 C♯4 D4 F♯4','4 · C♯4 D4 F♯4 A4'
 ]);
 const before=await frets(page).textContent();
 for(const rotation of ['0','1','2','3']) {
  await close.selectOption(rotation);
  for(const drop of ['close','drop2','drop3','drop4','drop23','drop24','drop34','drop234']) {
   await page.getByRole('combobox',{name:'Trasformazione'}).selectOption(drop);
   const text=await page.getByTestId('theory-pitches').textContent();
   expect(text).not.toMatch(/G♭|D♭/);
   expect(text).toContain('F♯');expect(text).toContain('C♯');
  }
 }
 await expect(frets(page)).toHaveText(before);
 await close.selectOption('2');
 await page.getByRole('combobox',{name:'Trasformazione'}).selectOption('drop2');
 await page.getByRole('button',{name:'Cerca queste altezze'}).click();
 await expect(pitches(page)).toHaveAttribute('data-pitches','50,57,61,66');
 await expect(page.locator('.vl-result-notes').first()).toHaveText('D3 · A3 · C♯4 · F♯4');
 await expect(page.getByTestId('v-group')).toHaveText('V-2 · 1 / 0 / 1');
 const resultNames=await page.locator('.vl-result-notes').allTextContents();
 await root(page).selectOption('0');
 expect(await page.locator('.vl-result-notes').allTextContents()).toEqual(resultNames);
 await expect(pitches(page)).toHaveAttribute('data-pitches','50,57,61,66');
 await page.getByRole('combobox',{name:'Accordo o struttura'}).selectOption('custom');
 await expect(page.getByText('Struttura libera: nomi cromatici con bemolli, senza funzione armonica assegnata.')).toBeVisible();
 await root(page).selectOption('2');
 await expect(page.getByTestId('theory-pitches')).toHaveText('D3 — A3 — D♭4 — G♭4');
});

test('compact readings show one degree row and one omissions row, and enharmonic reinterpretation preserves physical position',async({page})=> {
 await page.goto('/tools/voicing-lab');
 const main=page.locator('.vl-analysis>.vl-reading');
 await expect(main.locator('.vl-degrees')).toHaveCount(1);
 await expect(main.locator('.vl-motivation')).toHaveCount(0);
 await expect(main).not.toContainText('Presenti');
 await expect(main).not.toContainText('Tutte le note');
 await root(page).selectOption('9');
 await expect(main.locator('.vl-omissions')).toHaveCount(1);
 expect((await main.textContent()).match(/Omesse:/g)).toHaveLength(1);
 await page.getByRole('button',{name:'Cø7 / A♭9'}).click();
 await expect(pitches(page)).toContainText('G♭3');
 const beforeFrets=await frets(page).textContent();
 const beforePitches=await pitches(page).getAttribute('data-pitches');
 const beforeStrings=await pitches(page).getAttribute('data-strings');
 for(const locked of [false,true]) {
  if(locked) await page.getByRole('button',{name:'Conserva nelle ricerche'}).click();
  await root(page).selectOption('2');
  await expect(pitches(page)).toContainText('F♯3');
  await expect(main.locator('h3')).toHaveText('D7(♭9,♭13)/C');
  await expect(main.locator('.vl-omissions')).toHaveText('Omesse: fondamentale e quinta');
  expect((await main.textContent()).match(/Omesse:/g)).toHaveLength(1);
  await expect(frets(page)).toHaveText(beforeFrets);
  await expect(pitches(page)).toHaveAttribute('data-pitches',beforePitches);
  await expect(pitches(page)).toHaveAttribute('data-strings',beforeStrings);
  await expect(page.getByTestId('v-group')).toHaveText('V-2 · 1 / 0 / 1');
  await root(page).selectOption('0');
  await expect(pitches(page)).toContainText('G♭3');
 }
});

const greeneCases=[
 {name:'A',frets:['x','3','5','4','5','x'],candidate:'52,59,60,67',result:'x-x-2-4-1-3',group:'V-2',procedure:null},
 {name:'B',frets:['x','3','5','4','5','x'],candidate:'47,48,55,64',result:'7-3-5-x-5-x',group:'V-3',procedure:'v2-v3-a-down'},
 {name:'C',frets:['x','3','5','4','5','x'],candidate:'48,55,59,76',result:'8-10-9-x-x-12',group:'V-9',procedure:'v2-v9-s-up'},
 {name:'D',frets:['x','7','5','5','x','7'],candidate:'40,55,60,71',result:'0-x-5-5-x-7',group:'V-12',procedure:'v3-v12-b-down'}
];
for(const width of [1440,390])for(const c of greeneCases) {
 test(`Greene ${c.name} comparison, explicit application and exact restore at ${width}px`,async({page})=> {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:1000});await page.goto('/tools/voicing-lab');
  for(let i=0;i<6;i++)await page.getByRole('combobox',{name:`Corda ${6-i}`,exact:true}).selectOption(c.frets[i]);
  const beforeFrets=await frets(page).textContent();const beforePitches=await pitches(page).getAttribute('data-pitches');
  await page.getByRole('combobox',{name:'Approccio',exact:true}).selectOption('greene');
  const panel=page.getByTestId('greene-panel');
  await expect(panel).not.toHaveAttribute('open','');
  await panel.locator(':scope>summary').click();
  if(c.procedure){await page.getByRole('tab',{name:'Conversioni',exact:true}).click();await panel.locator(`[data-procedure="${c.procedure}"]`).click();}
  else await panel.getByRole('button',{name:/Disposizione 2/}).click();
  await expect(page.getByTestId('greene-candidate-pitches')).toHaveAttribute('data-pitches',c.candidate);
  await expect(frets(page)).toHaveText(beforeFrets);
  await expect(panel.getByRole('button',{name:'Usa questa posizione',exact:true})).toBeDisabled();
  await panel.getByRole('button',{name:'Cerca posizioni della candidata',exact:true}).click();
  await expect(frets(page)).toHaveText(beforeFrets);
  await panel.getByRole('combobox',{name:'Corde della candidata'}).selectOption('all');
  await panel.getByRole('button',{name:'Cerca posizioni della candidata',exact:true}).click();
  await panel.locator(`[data-realization="${c.result}"]`).click();
  await expect(frets(page)).toHaveText(beforeFrets);
  await root(page).selectOption('9');
  await expect(frets(page)).toHaveText(beforeFrets);await expect(pitches(page)).toHaveAttribute('data-pitches',beforePitches);
  await expect(page.getByTestId('greene-candidate-pitches')).toHaveAttribute('data-pitches',c.candidate);
  await root(page).selectOption('0');
  if(c.name==='B')await expect(panel.locator('[data-voice="A"]')).toContainText('B · Basso');
  if(c.name==='C'){await panel.getByText('Dettagli del confronto',{exact:true}).click();await expect(panel.locator('.vl-comparison')).toContainText('Metodo 1');}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(width===390) {
   expect(await panel.locator('.vl-movements-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
   await expect(panel.locator('[data-voice="A"] [data-label="Ruolo risultante"]')).toBeVisible();
  }
  await mkdir(previewDir,{recursive:true});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:`${previewDir}/greene-${c.name}-${width}.png`,fullPage:true});
  if(c.name==='B')await panel.locator('.vl-comparison').screenshot({path:`${previewDir}/greene-final-comparison-${width}.png`,style:'.platform-nav { visibility:hidden !important; }'});
  await panel.getByRole('button',{name:'Usa questa posizione',exact:true}).click();
  await expect(pitches(page)).toHaveAttribute('data-pitches',c.candidate);
  await expect(page.getByTestId('v-group')).toContainText(c.group);
  await expect(page.getByTestId('compare-original-frets')).toHaveText(beforeFrets);
  await panel.getByRole('button',{name:'Ripristina originale',exact:true}).click();
  await expect(frets(page)).toHaveText(beforeFrets);await expect(pitches(page)).toHaveAttribute('data-pitches',beforePitches);
  await expect(page.getByTestId('greene-candidate-pitches')).toHaveCount(0);
  await page.screenshot({path:`${previewDir}/greene-${c.name}-${width}-restored.png`,fullPage:true});
  if(c.name==='B') {
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   const clip=await page.locator('.vl-workspace').evaluate(el=>{
    const a=el.querySelector('.vl-position-head').getBoundingClientRect(),b=el.querySelector('.vl-position-meta').getBoundingClientRect();
    return {x:a.x+scrollX,y:a.y+scrollY,width:a.width,height:b.bottom-a.top+15};
   });
   await page.screenshot({path:`${previewDir}/greene-final-restored-${width}.png`,fullPage:true,clip,style:'.platform-nav { visibility:hidden !important; }'});
  }
  expect(errors).toEqual([]);
 });
}
test('Greene filters, direction, inactive procedures, locked position and manual invalidation',async({page})=> {
 await page.goto('/tools/voicing-lab');
 await page.getByRole('button',{name:'Conserva nelle ricerche'}).click();
 await page.getByRole('combobox',{name:'Approccio',exact:true}).selectOption('greene');
 const panel=page.getByTestId('greene-panel');await panel.locator(':scope>summary').click();
 await panel.getByRole('combobox',{name:'Direzione sistematica'}).selectOption('-1');
 await panel.getByRole('button',{name:/Disposizione 2/}).click();
 await expect(page.getByTestId('greene-candidate-pitches')).toHaveAttribute('data-pitches','47,52,55,60');
 await page.getByRole('tab',{name:'Conversioni',exact:true}).click();
 await panel.getByRole('combobox',{name:'Filtro soprano'}).selectOption('fixed');
 await expect(panel.locator('[data-procedure="v2-v9-s-up"]')).toHaveCount(0);
 await panel.locator('[data-procedure="v2-v3-a-down"]').click();
 await panel.getByRole('spinbutton',{name:'Tasto massimo candidata'}).fill('0');
 await panel.getByRole('button',{name:'Cerca posizioni della candidata'}).click();
 await expect(panel.getByRole('status')).toContainText('0 posizioni trovate');
 await expect(panel.getByRole('button',{name:'Usa questa posizione'})).toBeDisabled();
 await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');
 await panel.getByRole('spinbutton',{name:'Tasto massimo candidata'}).fill('24');
 await panel.getByRole('combobox',{name:'Corde della candidata'}).selectOption('all');
 await panel.getByRole('button',{name:'Cerca posizioni della candidata'}).click();
 await panel.locator('[data-realization="7-3-5-x-5-x"]').click();
 await panel.getByRole('spinbutton',{name:'Apertura massima candidata'}).fill('0');
 await expect(panel.getByRole('button',{name:'Usa questa posizione'})).toBeDisabled();
 await panel.getByRole('spinbutton',{name:'Apertura massima candidata'}).fill('5');
 await panel.getByRole('button',{name:'Usa questa posizione'}).click();
 await expect(frets(page)).toHaveText('7 · 3 · 5 · × · 5 · ×');
 await panel.getByRole('button',{name:'Ripristina originale'}).click();
 await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');
 await panel.getByText('Procedimenti documentati inattivi',{exact:true}).click();
 await expect(panel.locator('.vl-inactive')).toContainText('soprano +24');
 await expect(panel.locator('.vl-inactive button')).toHaveCount(0);
 await panel.locator('[data-procedure="v2-v3-a-down"]').click();
 await page.getByRole('combobox',{name:'Corda 5',exact:true}).selectOption('4');
 await expect(page.getByTestId('greene-candidate-pitches')).toHaveCount(0);
 await expect(panel.getByRole('button',{name:'Ripristina originale'})).toHaveCount(0);
});
