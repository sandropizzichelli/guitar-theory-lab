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
for(const width of [1440,390,320])for(const c of greeneCases) {
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
  if(width<=390) {
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

async function openBass(page,name,octave,mode='separate') {
 const bass=page.getByTestId('bass-panel');await bass.locator(':scope>summary').click();
 await bass.getByRole('combobox',{name:'Nota del basso',exact:true}).selectOption(name);
 await bass.getByRole('combobox',{name:'Ottava del basso',exact:true}).selectOption(String(octave));
 await bass.getByRole('combobox',{name:'Realizzazione del basso',exact:true}).selectOption(mode);return bass;
}
for(const width of [1440,390,320])for(const example of ['A','D','unavailable','duplicate'])test(`external bass ${example} exact lifecycle at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/tools/voicing-lab');
 if(example==='D')for(const [i,f] of ['x','3','4','3','4','x'].entries())await page.getByRole('combobox',{name:`Corda ${6-i}`,exact:true}).selectOption(f);
 const originalFrets=await frets(page).textContent(),originalPitches=await pitches(page).getAttribute('data-pitches'),originalStrings=await pitches(page).getAttribute('data-strings');
 const bass=await openBass(page,example==='A'?'A':example==='duplicate'?'C':'D',2,example==='A'||example==='unavailable'?'guitar':'separate');
 await expect(page.getByTestId('bass-sound')).toHaveCount(0);await expect(frets(page)).toHaveText(originalFrets);
 if(example==='A'||example==='unavailable') {
  await bass.getByRole('button',{name:'Cerca basso sulle corde inutilizzate'}).click();
  if(example==='unavailable') {await expect(bass.getByRole('button',{name:'Aggiungi questo basso'})).toBeDisabled();await expect(bass).toContainText('Nessuna corda inutilizzata');await bass.getByRole('combobox',{name:'Realizzazione del basso'}).selectOption('separate');}
  else {await expect(bass.getByRole('button',{name:'Aggiungi questo basso'})).toBeDisabled();await bass.locator('[data-bass-string="6"]').click();}
 }
 await expect(frets(page)).toHaveText(originalFrets);await bass.getByRole('button',{name:'Aggiungi questo basso'}).click();
 await expect(frets(page)).toHaveText(originalFrets);await expect(pitches(page)).toHaveAttribute('data-pitches',originalPitches);await expect(pitches(page)).toHaveAttribute('data-strings',originalStrings);
 await expect(page.getByTestId('v-group')).toContainText('V-2');
 const selected=page.locator('.vl-analysis>.vl-reading');
 if(example==='A'){await expect(selected.locator('h3')).toHaveText('Cmaj7/A');await expect(selected).toContainText('Cmaj7 completo sopra un basso A, esterno alla formula');await expect(selected).not.toContainText('incompatibile');await root(page).selectOption('9');await expect(selected.locator('h3')).toHaveText('Am9');await expect(selected).toContainText('Formula completa');await root(page).selectOption('0');await expect(page.getByTestId('bass-sound')).toContainText('5 · 3 · 5 · 4 · 5 · ×');}
 if(example==='D'){await root(page).selectOption('2');await expect(selected.locator('h3')).toHaveText('D7(♭9,♭13)');await expect(selected.locator('.vl-omissions')).toHaveText('Omesse: quinta');await expect(pitches(page)).toContainText('F♯3');}
 if(example==='duplicate'){await expect(selected.locator('h3')).toHaveText('Cmaj7');await expect(page.getByTestId('bass-sound')).toContainText('5 note, 4 classi');}
 await expect(frets(page)).toHaveText(originalFrets);
 await page.screenshot({path:`${previewDir}/bass-${example}-${width}.png`,fullPage:true});
 if(example==='A')await page.locator('.vl-workspace').screenshot({path:`${previewDir}/bass-preview-${width}.png`,style:'.platform-nav { visibility:hidden !important; }'});
 await bass.getByRole('combobox',{name:'Ottava del basso'}).selectOption('3');await bass.getByRole('combobox',{name:'Nota del basso'}).selectOption('C');await expect(bass.getByRole('button',{name:'Aggiungi questo basso'})).toBeDisabled();
 await expect(page.getByTestId('bass-sound')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await bass.getByRole('button',{name:'Rimuovi basso'}).click();await expect(page.getByTestId('bass-sound')).toHaveCount(0);await expect(frets(page)).toHaveText(originalFrets);await expect(pitches(page)).toHaveAttribute('data-pitches',originalPitches);
});
for(const mode of ['separate','guitar'])test(`Greene snapshots include external bass ${mode}, collision and register independently`,async({page})=>{
 await page.goto('/tools/voicing-lab');const bass=await openBass(page,'A',2,mode);
 if(mode==='guitar'){await bass.getByRole('button',{name:'Cerca basso sulle corde inutilizzate'}).click();await bass.locator('[data-bass-string="6"]').click();}
 await bass.getByRole('button',{name:'Aggiungi questo basso'}).click();
 const originalBass=await page.getByTestId('bass-sound').getAttribute('data-bass'),beforePitches=await pitches(page).getAttribute('data-pitches');
 await page.getByRole('combobox',{name:'Approccio',exact:true}).selectOption('greene');const panel=page.getByTestId('greene-panel');await panel.locator(':scope>summary').click();await panel.getByRole('tab',{name:'Conversioni',exact:true}).click();
 await panel.locator('[data-procedure="v2-v7-b-down"]').click();await expect(page.getByTestId('greene-bass-check')).toContainText('deve essere sotto');await expect(panel.getByRole('button',{name:'Usa questa posizione'})).toBeDisabled();
 await panel.locator('[data-procedure="v2-v3-a-down"]').click();await panel.getByRole('combobox',{name:'Corde della candidata'}).selectOption('all');await panel.getByRole('button',{name:'Cerca posizioni della candidata'}).click();await panel.locator('[data-realization="7-3-5-x-5-x"]').click();
 if(mode==='guitar'){
  await expect(page.getByTestId('greene-bass-check')).toContainText('Collisione');await expect(panel.getByRole('button',{name:'Usa questa posizione'})).toBeDisabled();
  await panel.getByRole('tab',{name:'Disposizioni sistematiche',exact:true}).click();await panel.getByRole('button',{name:/Disposizione 1/}).click();await panel.getByRole('button',{name:'Cerca posizioni della candidata'}).click();await panel.locator('[data-realization="x-3-5-x-0-0"]').click();
 }
 await root(page).selectOption('9');await expect(page.getByTestId('bass-sound')).toHaveAttribute('data-bass',originalBass);await expect(pitches(page)).toHaveAttribute('data-pitches',beforePitches);
 await panel.getByRole('button',{name:'Usa questa posizione'}).click();await expect(frets(page)).toHaveText(mode==='guitar'?'× · 3 · 5 · × · 0 · 0':'7 · 3 · 5 · × · 5 · ×');await expect(page.getByTestId('bass-sound')).toHaveAttribute('data-bass',originalBass);
 await panel.getByRole('button',{name:'Ripristina originale'}).click();await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');await expect(pitches(page)).toHaveAttribute('data-pitches',beforePitches);await expect(page.getByTestId('bass-sound')).toHaveAttribute('data-bass',originalBass);
 if(mode==='guitar'){await page.getByRole('combobox',{name:'Corda 6',exact:true}).selectOption('7');await expect(page.getByRole('alert')).toContainText('Collisione');await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');}
 await bass.getByRole('button',{name:'Rimuovi basso'}).click();await expect(page.getByTestId('bass-sound')).toHaveCount(0);await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');
});

for(const width of [1440,390,320])test(`modal panel and Greene invariance ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/tools/voicing-lab');
 const modal=page.getByTestId('modal-panel');await modal.locator(':scope>summary').click();
 await expect(modal).toContainText('Scegli esplicitamente un centro');
 const center=modal.getByRole('combobox',{name:'Centro modale',exact:true});await center.selectOption('C');
 const results=page.getByTestId('modal-results');await expect(results).toHaveAttribute('data-complete','MAJ-I,MAJ-IV,HM-VI');
 await results.locator('[data-mode="MAJ-IV"]>summary').click();await expect(results).toContainText('F♯');
 await page.getByRole('button',{name:'Am7 / C6'}).click();await center.selectOption('A');await expect(results).toHaveAttribute('data-complete','MAJ-II,MAJ-III,MAJ-VI,MM-II,HM-IV');
 await page.getByRole('button',{name:'Cø7 / A♭9'}).click();await center.selectOption('C');await expect(results).toHaveAttribute('data-complete','MAJ-VII,MM-VI,MM-VII,HM-II,HM-IV');
 await results.locator('[data-mode="HM-IV"]>summary').click();await expect(results).toContainText('G♭ e F♯ sono la stessa altezza');
 await expect(pitches(page)).toContainText('G♭3');
 const original=await frets(page).textContent();
 for(const c of ['A','F♯','G♭','C']){await center.selectOption(c);await expect(frets(page)).toHaveText(original);await expect(pitches(page)).toHaveAttribute('data-pitches','48,54,58,63');}
 await root(page).selectOption('2');await expect(results).toHaveAttribute('data-complete','MAJ-VII,MM-VI,MM-VII,HM-II,HM-IV');
 await root(page).selectOption('0');
 await results.getByRole('button',{name:/Affinità parziali/}).click();await expect(results.locator('[data-mode]')).toHaveCount(16);await expect(results.locator('[data-mode]').first()).toContainText('Fuori scala:');
 await results.getByRole('button',{name:/^Compatibili/}).click();
 await modal.getByLabel('Maggiore',{exact:true}).uncheck();await expect(results).toHaveAttribute('data-complete','MM-VI,MM-VII,HM-II,HM-IV');await modal.getByLabel('Maggiore',{exact:true}).check();
 await mkdir(previewDir,{recursive:true});await results.locator('[data-mode="HM-IV"]>summary').click();
 await modal.screenshot({path:`${previewDir}/modal-final-${width}.png`,style:'.platform-nav{visibility:hidden}'});
 await results.locator('[data-mode="HM-IV"]>summary').click();
 await page.locator('.vl-workspace').screenshot({path:`${previewDir}/modal-workspace-${width}.png`,style:'.platform-nav{visibility:hidden}'});
 await page.getByRole('button',{name:'Cmaj7 / Am9'}).click();await center.selectOption('C');
 await page.getByRole('combobox',{name:'Approccio',exact:true}).selectOption('greene');
 const greene=page.getByTestId('greene-panel');await greene.locator(':scope>summary').click();await greene.getByRole('button',{name:/Disposizione 2/}).click();
 const candidate=await page.getByTestId('greene-candidate-pitches').getAttribute('data-pitches');
 await center.selectOption('A');await center.selectOption('C');await expect(page.getByTestId('greene-candidate-pitches')).toHaveAttribute('data-pitches',candidate);
 const comparison=page.getByTestId('modal-comparison');await comparison.locator(':scope>summary').click();await expect(comparison).toContainText('Compatibilità identiche');
 await comparison.getByText('Originale · 3 compatibili',{exact:true}).click();await comparison.getByText('Candidata teorica · 3 compatibili',{exact:true}).click();
 await expect(page.getByTestId('modal-original-results')).toHaveAttribute('data-complete','MAJ-I,MAJ-IV,HM-VI');await expect(page.getByTestId('modal-candidate-results')).toHaveAttribute('data-complete','MAJ-I,MAJ-IV,HM-VI');
 await comparison.screenshot({path:`${previewDir}/modal-greene-${width}.png`,style:'.platform-nav{visibility:hidden}'});
 await greene.getByRole('button',{name:'Cerca posizioni della candidata'}).click();await greene.locator('[data-realization]').first().click();await expect(frets(page)).toHaveText('× · 3 · 5 · 4 · 5 · ×');
 await greene.getByRole('button',{name:'Usa questa posizione',exact:true}).click();await expect(page.getByTestId('modal-results')).toHaveAttribute('data-complete','MAJ-I,MAJ-IV,HM-VI');await greene.getByRole('button',{name:'Ripristina originale'}).click();await expect(pitches(page)).toHaveAttribute('data-pitches','48,55,59,64');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('modal bass additions, zero results and preserved physical state',async({page})=>{
 await page.goto('/tools/voicing-lab');const modal=page.getByTestId('modal-panel');await modal.locator(':scope>summary').click();await modal.getByRole('combobox',{name:'Centro modale'}).selectOption('C');
 const bass=page.getByTestId('bass-panel');await bass.locator(':scope>summary').click();await bass.getByRole('combobox',{name:'Nota del basso',exact:true}).selectOption('B♭');await bass.getByRole('combobox',{name:'Ottava del basso',exact:true}).selectOption('2');await bass.getByRole('button',{name:'Aggiungi questo basso'}).click();
 await expect(page.getByTestId('modal-results')).toHaveAttribute('data-complete','');await expect(modal).toContainText('Nessuna compatibilità completa');
 const state=await page.getByTestId('bass-sound').getAttribute('data-bass');
 await modal.getByRole('combobox',{name:'Centro modale'}).selectOption('A');await expect(page.getByTestId('bass-sound')).toHaveAttribute('data-bass',state);await expect(pitches(page)).toHaveAttribute('data-pitches','48,55,59,64');
 await bass.getByRole('button',{name:'Rimuovi basso'}).click();await modal.getByRole('combobox',{name:'Centro modale'}).selectOption('C');await expect(page.getByTestId('modal-results')).toHaveAttribute('data-complete','MAJ-I,MAJ-IV,HM-VI');
});

for(const width of [1440,390,320])test(`final integrated journey, keyboard focus and scrolling ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('/tools/voicing-lab');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const noOverflow=async()=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const modal=page.getByTestId('modal-panel');await modal.locator(':scope>summary').click();const center=modal.getByRole('combobox',{name:'Centro modale'});await center.selectOption('C');
 await page.getByRole('combobox',{name:'Corda 6',exact:true}).selectOption('0');await page.getByTestId('modal-results').locator('[data-mode="MAJ-I"]>summary').click();
 await expect(modal).toContainText('nota 5');await expect(modal).not.toContainText('undefined');await expect(page.getByTestId('v-group')).toContainText('V non assegnato');
 for(const [i,f] of ['x','3','5','4','5','x'].entries())await page.getByRole('combobox',{name:`Corda ${6-i}`,exact:true}).selectOption(f);
 const initialFrets=await frets(page).textContent(),initialPitches=await pitches(page).getAttribute('data-pitches');
 await root(page).selectOption('2');await expect(frets(page)).toHaveText(initialFrets);await expect(pitches(page)).toHaveAttribute('data-pitches',initialPitches);await expect(center).toHaveValue('C');await noOverflow();
 const board=page.locator('.vl-board-scroll');await board.focus();await board.press('ArrowRight');await expect.poll(()=>board.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
 await expect(board).toBeFocused();expect(await board.evaluate(el=>getComputedStyle(el).outlineStyle)).toBe('solid');
 const highFret=page.getByRole('button',{name:'Corda 1, tasto 24, E6',exact:true});await highFret.focus();await expect(highFret).toBeFocused();
 expect(await highFret.evaluate(el=>{const r=el.getBoundingClientRect(),b=el.closest('.vl-board-scroll').getBoundingClientRect();return r.left>=b.left&&r.right<=b.right;})).toBe(true);
 await highFret.press('Enter');await expect(pitches(page)).toHaveAttribute('data-pitches','48,55,59,64,88');await highFret.press('Enter');await expect(pitches(page)).toHaveAttribute('data-pitches',initialPitches);await noOverflow();
 await page.getByRole('button',{name:'Conserva nelle ricerche'}).click();await page.getByRole('tab',{name:'Costruisci',exact:true}).click();await page.getByRole('combobox',{name:'Close iniziale'}).selectOption('0');await page.getByRole('combobox',{name:'Ottava della fondamentale'}).selectOption('4');await page.getByRole('combobox',{name:'Trasformazione'}).selectOption('close');await expect(page.getByTestId('theory-pitches')).toHaveText('D4 — F♯4 — A4 — C♯5');
 await page.getByRole('combobox',{name:'Trasformazione'}).selectOption('drop23');await expect(page.getByTestId('theory-pitches')).toHaveText('F♯3 — A3 — D4 — C♯5');await page.getByRole('button',{name:'Cerca queste altezze'}).click();await expect(frets(page)).toHaveText(initialFrets);await noOverflow();
 await page.getByRole('tab',{name:'Analizza una posizione',exact:true}).click();await root(page).selectOption('0');
 const bass=await openBass(page,'A',2,'guitar');await bass.getByRole('button',{name:'Cerca basso sulle corde inutilizzate'}).click();await bass.locator('[data-bass-string="6"]').click();await bass.getByRole('button',{name:'Aggiungi questo basso'}).click();const bassState=await page.getByTestId('bass-sound').getAttribute('data-bass');
 await expect(page.locator('.vl-analysis>.vl-reading')).toContainText('Cmaj7 completo sopra un basso A, esterno alla formula');await expect(page.getByTestId('v-group')).toHaveText('V-2 · 1 / 0 / 1');
 await page.getByRole('combobox',{name:'Corda 6',exact:true}).selectOption('7');await expect(page.getByRole('alert')).toContainText('Collisione');await expect(frets(page)).toHaveText(initialFrets);
 await page.getByRole('combobox',{name:'Approccio',exact:true}).selectOption('greene');const greene=page.getByTestId('greene-panel');await greene.locator(':scope>summary').click();await greene.getByRole('tab',{name:'Conversioni',exact:true}).click();await greene.locator('[data-procedure="v2-v3-a-down"]').click();await greene.getByRole('combobox',{name:'Corde della candidata'}).selectOption('all');await greene.getByRole('button',{name:'Cerca posizioni della candidata'}).click();await greene.locator('[data-realization="7-3-5-x-5-x"]').click();await expect(greene.getByRole('button',{name:'Usa questa posizione'})).toBeDisabled();await expect(page.getByTestId('greene-bass-check')).toContainText('Collisione');
 const comparison=page.getByTestId('modal-comparison');await comparison.locator(':scope>summary').click();await comparison.getByText('Originale · 3 compatibili',{exact:true}).click();await comparison.getByText('Candidata teorica · 3 compatibili',{exact:true}).click();
 for(const testId of ['modal-original-results','modal-candidate-results']){const result=page.getByTestId(testId);await expect(result).toHaveAttribute('data-complete','MAJ-I,MAJ-IV,HM-VI');await result.getByRole('button',{name:/Affinità parziali/}).click();await expect(result.locator('[data-mode]').first()).toContainText('Fuori scala:');await result.getByRole('button',{name:/^Compatibili/}).click();}
 await center.selectOption('A');await root(page).selectOption('9');await expect(page.getByTestId('greene-candidate-pitches')).toHaveAttribute('data-pitches','47,48,55,64');await expect(frets(page)).toHaveText(initialFrets);await expect(page.getByTestId('bass-sound')).toHaveAttribute('data-bass',bassState);await center.selectOption('C');await root(page).selectOption('0');await noOverflow();
 await greene.locator('.vl-comparison-columns').screenshot({path:`${previewDir}/review-comparison-${width}.png`,style:'.platform-nav{visibility:hidden}'});
 await greene.getByRole('tab',{name:'Disposizioni sistematiche',exact:true}).click();await greene.getByRole('button',{name:/Disposizione 1/}).click();await comparison.locator(':scope>summary').click();await expect(comparison).toContainText('Compatibilità identiche; stesse altezze');
 await greene.getByRole('button',{name:'Cerca posizioni della candidata'}).click();await greene.locator('[data-realization="x-3-5-x-0-0"]').click();await greene.getByRole('button',{name:'Usa questa posizione'}).click();await expect(frets(page)).toHaveText('× · 3 · 5 · × · 0 · 0');await expect(greene.getByRole('button',{name:'Ripristina originale'})).toBeFocused();await greene.getByRole('button',{name:'Ripristina originale'}).press('Enter');await expect(frets(page)).toBeFocused();await expect(frets(page)).toHaveText(initialFrets);await expect(pitches(page)).toHaveAttribute('data-pitches',initialPitches);await expect(page.getByTestId('bass-sound')).toHaveAttribute('data-bass',bassState);await expect(center).toHaveValue('C');
 await board.evaluate(el=>{el.scrollLeft=0;});
 const restoredClip=await page.locator('.vl-workspace').evaluate(el=>{const a=el.querySelector('.vl-position-head').getBoundingClientRect(),b=el.querySelector('[data-testid="bass-sound"]').getBoundingClientRect();return {x:a.x+scrollX,y:a.y+scrollY,width:a.width,height:b.bottom-a.top+15};});await page.screenshot({path:`${previewDir}/review-restored-with-bass-${width}.png`,fullPage:true,clip:restoredClip,style:'.platform-nav{visibility:hidden}'});
 await bass.getByRole('button',{name:'Rimuovi basso'}).click();await expect(bass.getByRole('combobox',{name:'Nota del basso',exact:true})).toBeFocused();await expect(page.getByTestId('bass-sound')).toHaveCount(0);await bass.getByRole('combobox',{name:'Ottava del basso'}).selectOption('4');await expect(bass.getByRole('button',{name:'Aggiungi questo basso'})).toBeDisabled();await expect(bass).toContainText('deve essere sotto');
 await bass.locator(':scope>summary').click();await greene.locator(':scope>summary').click();await page.getByTestId('modal-results').locator('[data-mode="MAJ-I"]>summary').click();await page.getByTestId('modal-results').locator('[data-mode="MAJ-I"]>summary').press('Tab');expect(await page.evaluate(()=>document.activeElement.tagName)).toBe('A');await noOverflow();
 await modal.screenshot({path:`${previewDir}/review-modal-${width}.png`,style:'.platform-nav{visibility:hidden}'});
 await page.getByTestId('modal-results').locator('[data-mode="MAJ-I"]>summary').click();
 await page.evaluate(()=>{const el=document.querySelector('.vl-board-scroll');el.scrollLeft=0;window.scrollTo(0,0);});
 const clip=await page.locator('.vl-workspace').evaluate(el=>{const a=el.querySelector('.vl-position-head').getBoundingClientRect(),b=el.querySelector('.vl-position-meta').getBoundingClientRect();return {x:a.x+scrollX,y:a.y+scrollY,width:a.width,height:b.bottom-a.top+15};});await page.screenshot({path:`${previewDir}/review-restored-${width}.png`,fullPage:true,clip,style:'.platform-nav{visibility:hidden}'});
 expect(errors).toEqual([]);
});
test('enharmonic half-diminished explanation is not assigned to unrelated positions',async({page})=>{
 await page.goto('/tools/voicing-lab');for(const [i,f]of ['x','3','0','x','7','5'].entries())await page.getByRole('combobox',{name:`Corda ${6-i}`,exact:true}).selectOption(f);
 const modal=page.getByTestId('modal-panel');await modal.locator(':scope>summary').click();await modal.getByRole('combobox',{name:'Centro modale'}).selectOption('C');await page.getByTestId('modal-results').locator('[data-mode="HM-IV"]>summary').click();await expect(modal).not.toContainText('lettura armonica Cø7');await expect(pitches(page)).toHaveAttribute('data-pitches','48,50,66,69');
});
