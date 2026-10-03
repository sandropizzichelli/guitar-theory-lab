import test from 'node:test';
import assert from 'node:assert/strict';
import {positionsFromFrets, classifyV, findExactPositions, pc} from '../../src/tools/voicing-lab/music.js';
import {CONVERSIONS, INACTIVE_PROCEDURES, systematicDispositions, applyConversion, GREENE_EXAMPLES} from '../../src/tools/voicing-lab/greene.js';
// Independent reference: Method 2 table, not imported from the product catalog.
const gaps=[[0,0,0],[1,0,1],[0,1,2],[2,1,0],[1,2,1],[4,0,0],[5,0,1],[2,2,2],[1,0,5],[1,4,1],[2,1,4],[4,1,2],[0,4,0],[0,0,4]];
function referenceVoicing(classes,group,rotation=0) {
 const ranks=[rotation]; for(const gap of gaps[group-1])ranks.push(ranks.at(-1)+gap+1);
 return ranks.map(rank=>({midi:48+12*Math.floor(rank/4)+classes[rank%4]}));
}
function* sets() {for(let a=0;a<9;a++)for(let b=a+1;b<10;b++)for(let c=b+1;c<11;c++)for(let d=c+1;d<12;d++)yield[a,b,c,d];}
function referenceGaps(pitches) {
 const classes=pitches.map(pc);
 return pitches.slice(1).map((upper,index)=>{
  let count=0;for(let octave=-10;octave<20;octave++)for(const c of classes){const p=c+12*octave;if(p>pitches[index]&&p<upper)count++;}return count;
 });
}
test('all 495 sets × 14 groups × 4 dispositions, both directions: group, identities and octave cycle',()=> {
 let origins=0,checks=0;
 for(const classes of sets())for(let group=1;group<=14;group++)for(let rotation=0;rotation<4;rotation++) {
  const origin=referenceVoicing(classes,group,rotation);origins++;
  for(const direction of [1,-1]) {
   const rows=systematicDispositions(origin,direction);
   assert.equal(rows.length,4);
   rows.forEach((row,step)=>{
    checks++;assert.equal(row.classification.group,`V-${group}`);
    assert.deepEqual(referenceGaps(row.pitches),gaps[group-1]);
    assert.deepEqual(row.pitches.map(pc).sort((a,b)=>a-b),classes);
    assert.equal(row.sopranoFixed,step===0);
    assert.deepEqual(row.voices.map(v=>v.id),['B','T','A','S']);
    for(const voice of row.voices)assert.equal(voice.sourceMidi,origin[['B','T','A','S'].indexOf(voice.id)].midi);
   });
   const nextCycle=systematicDispositions(rows[3].pitches.map(midi=>({midi})),direction)[1];
   assert.deepEqual(nextCycle.pitches,origin.map(v=>v.midi+12*direction));
   assert.deepEqual(systematicDispositions(rows[1].pitches.map(midi=>({midi})),-direction)[1].pitches,origin.map(v=>v.midi));
  }
 }
 assert.equal(origins,27720);assert.equal(checks,221760);
});
test('31 octave conversions × 495 sets × 4 dispositions: target group, effective soprano and identity',()=> {
 let checks=0;
 for(const procedure of CONVERSIONS)for(const classes of sets())for(let rotation=0;rotation<4;rotation++) {
  const origin=referenceVoicing(classes,Number(procedure.from.slice(2)),rotation);
  const before=structuredClone(origin);
  const row=applyConversion(origin,procedure);checks++;
  assert.equal(row.classification.group,procedure.to);
  assert.deepEqual(referenceGaps(row.pitches),gaps[Number(procedure.to.slice(2))-1]);
  assert.equal(row.sopranoFixed,procedure.soprano==='fixed');
  assert.equal(row.sopranoFixed,row.pitches[3]===origin[3].midi);
  assert.deepEqual(row.pitches.map(pc).sort((a,b)=>a-b),classes);
  assert.equal(new Set(row.voices.map(v=>v.id)).size,4);
  for(const voice of row.voices) {
   const rank=['B','T','A','S'].indexOf(voice.id);
   assert.equal(voice.midi,origin[rank].midi+procedure.deltas[rank]);
   assert.equal(voice.delta,procedure.deltas[rank]);
   assert.equal(voice.sourceMidi,origin[rank].midi);
   assert.equal(voice.resultRole,['B','T','A','S'][row.pitches.indexOf(voice.midi)]);
  }
  assert.deepEqual(origin,before);
 }
 assert.equal(checks,61380);
});
test('independent A–D fixtures, actual fret assignments and former alto becoming bass',()=> {
 const expected=[[52,59,60,67],[47,48,55,64],[48,55,59,76],[40,55,60,71]];
 const groups=['V-2','V-3','V-9','V-12'];
 const fixed=[false,true,false,true];
 GREENE_EXAMPLES.forEach((example,index)=> {
  const positions=positionsFromFrets(example.frets);
  const row=index===0?systematicDispositions(positions)[1]:applyConversion(positions,CONVERSIONS.find(p=>p.id===example.target));
  assert.deepEqual(row.pitches,expected[index]);assert.equal(row.classification.group,groups[index]);assert.equal(row.sopranoFixed,fixed[index]);
  assert.ok(findExactPositions(row.pitches,{maxFret:24,maxSpan:5}).some(p=>JSON.stringify(p.frets)===JSON.stringify(example.expectedFrets)));
  if(index===1){assert.equal(row.voices[0].id,'A');assert.equal(row.voices[0].resultRole,'B');assert.equal(row.voices[0].sourceMidi,59);assert.equal(row.voices[0].midi,47);}
 });
});
test('Method 1 +12 active, documented +24 and swaps inactive; theoretical verification never certifies guitar routes',()=> {
 const positions=positionsFromFrets(GREENE_EXAMPLES[0].frets);
 const plus12=CONVERSIONS.find(p=>p.id==='v2-v9-s-up');
 assert.ok(plus12.source.title.includes('Metodo 1'));assert.equal(plus12.deltas[3],12);
 assert.equal(applyConversion(positions,plus12).classification.group,'V-9');
 for(const procedure of INACTIVE_PROCEDURES)assert.throws(()=>applyConversion(positions,procedure));
 assert.equal(classifyV([48,55,59,88]).group,null);
 const plus24=INACTIVE_PROCEDURES[0];assert.equal(plus24.provenance,'Documentato');assert.equal(plus24.theoryVerification,'Da chiarire');
 assert.ok(!plus24.condition.includes('errore dell’autore'));
 for(const p of CONVERSIONS)assert.equal(p.guitarVerification,'Percorso originale sulle corde non verificato');
 assert.throws(()=>systematicDispositions([{midi:48},{midi:52},{midi:55},{midi:60}]));
 const negative=applyConversion(positions,CONVERSIONS.find(p=>p.id==='v2-v12-a-down2'));
 assert.deepEqual(findExactPositions(negative.pitches,{minFret:0,maxFret:0}),[]);
});
test('source-independent fixtures: Hober Method 1 Emaj7 and Method 2 Dm7, with concrete octave conversions',()=> {
 // Method 1 pp. 1–2: G# D# E B, first-inversion Emaj7 on strings 4–1.
 const e=positionsFromFrets([null,null,6,8,5,7]);
 assert.equal(classifyV(e.map(p=>p.midi)).group,'V-2');
 const third=applyConversion(e,CONVERSIONS.find(p=>p.id==='v2-v3-a-down'));
 assert.deepEqual(third.pitches,[52,56,63,71]);
 assert.equal(third.classification.group,'V-3');assert.equal(third.sopranoFixed,true);
 // Method 2 p. 2: Dm7 with chord-tone gaps 2/1/0 (D C F A).
 const d=[50,60,65,69].map(midi=>({midi}));
 assert.equal(classifyV(d.map(p=>p.midi)).group,'V-4');
 const eleventh=applyConversion(d,CONVERSIONS.find(p=>p.id==='v4-v11-s-up'));
 assert.deepEqual(eleventh.pitches,[50,60,65,81]);assert.equal(eleventh.classification.group,'V-11');assert.equal(eleventh.sopranoFixed,false);
});
