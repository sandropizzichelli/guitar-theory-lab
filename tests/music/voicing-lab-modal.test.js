import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MODES,FAMILIES,analyzeModes,modalSpelling,soundRecords} from '../../src/tools/voicing-lab/modal.js';
import {positionsFromFrets} from '../../src/tools/voicing-lab/music.js';
import {systematicDispositions,CONVERSIONS,applyConversion} from '../../src/tools/voicing-lab/greene.js';
const fixtures=[
[0,2,4,5,7,9,11],[0,2,3,5,7,9,10],[0,1,3,5,7,8,10],[0,2,4,6,7,9,11],[0,2,4,5,7,9,10],[0,2,3,5,7,8,10],[0,1,3,5,6,8,10],
[0,2,3,5,7,9,11],[0,1,3,5,7,9,10],[0,2,4,6,8,9,11],[0,2,4,6,7,9,10],[0,2,4,5,7,8,10],[0,2,3,5,6,8,10],[0,1,3,4,6,8,10],
[0,2,3,5,7,8,11],[0,1,3,5,6,9,10],[0,2,4,5,8,9,11],[0,2,3,6,7,9,10],[0,1,4,5,7,8,10],[0,3,4,6,7,9,11],[0,1,3,4,6,8,9]];
const degreeFixtures=['1 2 3 4 5 6 7','1 2 ♭3 4 5 6 ♭7','1 ♭2 ♭3 4 5 ♭6 ♭7','1 2 3 ♯4 5 6 7','1 2 3 4 5 6 ♭7','1 2 ♭3 4 5 ♭6 ♭7','1 ♭2 ♭3 4 ♭5 ♭6 ♭7','1 2 ♭3 4 5 6 7','1 ♭2 ♭3 4 5 6 ♭7','1 2 3 ♯4 ♯5 6 7','1 2 3 ♯4 5 6 ♭7','1 2 3 4 5 ♭6 ♭7','1 2 ♭3 4 ♭5 ♭6 ♭7','1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭7','1 2 ♭3 4 5 ♭6 7','1 ♭2 ♭3 4 ♭5 6 ♭7','1 2 3 4 ♯5 6 7','1 2 ♭3 ♯4 5 6 ♭7','1 ♭2 3 4 5 ♭6 ♭7','1 ♯2 3 ♯4 5 6 7','1 ♭2 ♭3 ♭4 ♭5 ♭6 ♭♭7'];
const centers=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
const records=pitches=>pitches.map(midi=>({midi}));
const ids=(pitches,center)=>analyzeModes(records(pitches),center).complete.map(r=>r.id);
test('21 independent formulas and modal spelling including octave boundaries',()=>{
 assert.equal(MODES.length,21);MODES.forEach((m,i)=>{assert.deepEqual(m.intervals,fixtures[i]);assert.equal(m.degrees.join(' '),degreeFixtures[i]);for(const center of [...centers,'B♯','C♭']){const spellings=modalSpelling(m,center);assert.equal(new Set(spellings.map(n=>n.name[0])).size,7);assert.equal(new Set(spellings.map(n=>n.pc)).size,7);}});
 assert.deepEqual(modalSpelling(MODES[17],'C').map(n=>n.name),['C','D','E♭','F♯','G','A','B♭']);
 assert.equal(modalSpelling(MODES[13],'C')[3].name,'F♭');
 assert.equal(modalSpelling(MODES[20],'C')[6].name,'B♭♭');
 assert.equal(modalSpelling(MODES[0],'B♯',60)[0].label,'B♯3');
 assert.equal(modalSpelling(MODES[0],'C♭',59)[0].label,'C♭4');
 assert.deepEqual(ids([48,54,58,63],'C'),ids([48,54,58,63],'B♯'));
});
test('three examples and every documented bass addition',()=>{
 const cases=[
 [[48,55,59,64],'C',['MAJ-I','MAJ-IV','HM-VI'],[[45,['MAJ-I','MAJ-IV','HM-VI']],[36,['MAJ-I','MAJ-IV','HM-VI']],[38,['MAJ-I','MAJ-IV']],[41,['MAJ-I']],[46,[]]]],
 [[45,52,55,60],'A',['MAJ-II','MAJ-III','MAJ-VI','MM-II','HM-IV'],[[40,['MAJ-II','MAJ-III','MAJ-VI','MM-II','HM-IV']],[35,['MAJ-II','MAJ-VI','HM-IV']],[34,['MAJ-III','MM-II']],[42,['MAJ-II','MM-II','HM-IV']],[39,['HM-IV']]]],
 [[48,54,58,63],'C',['MAJ-VII','MM-VI','MM-VII','HM-II','HM-IV'],[[42,['MAJ-VII','MM-VI','MM-VII','HM-II','HM-IV']],[38,['MM-VI','HM-IV']],[44,['MAJ-VII','MM-VI','MM-VII']],[45,['HM-II','HM-IV']],[43,['HM-IV']]]]];
 for(const [notes,center,expected,basses] of cases){assert.deepEqual(ids(notes,center),expected);for(const [bass,wanted]of basses)assert.deepEqual(ids([...notes,bass],center),wanted);}
 const a=analyzeModes(records([48,55,59,64]),'C');
 assert.deepEqual(a.complete[0].discriminantsAbsent.map(n=>n.name),['D','F']);
 assert.deepEqual(a.partial.find(r=>r.id==='MM-III').outside,[7]);
 const split=analyzeModes(records([48,55,59,64,46]),'C');assert.equal(split.complete.length,0);
 assert(split.partial.every(r=>r.outside.length&&r.shared));assert.equal(split.partial.length+split.empty.length,21);
 assert.deepEqual(ids([36,48,55,59,64],'C'),ids([48,55,59,64],'C'));
 assert.deepEqual(analyzeModes([], 'C').complete,[]);assert.deepEqual(analyzeModes(records([60]),'').complete,[]);
});
test('495 sets × 12 centers: independent inclusion and all 12 additional bass classes',()=>{
 let inclusion=0,bassChecks=0;
 for(let a=0;a<9;a++)for(let b=a+1;b<10;b++)for(let c=b+1;c<11;c++)for(let d=c+1;d<12;d++){
 const notes=[a,b,c,d];
 for(let center=0;center<12;center++){
 const result=analyzeModes(records(notes),centers[center]);
 const bassResults=Array.from({length:12},(_,bass)=>new Set(analyzeModes(records([...notes,bass]),centers[center]).complete.map(r=>r.id)));
 for(let i=0;i<21;i++){
 const expectedScale=new Set(fixtures[i].map(n=>(n+center)%12));
 const complete=notes.every(n=>expectedScale.has(n));assert.equal(result.complete.some(r=>r.id===MODES[i].id),complete);inclusion++;
 for(let bass=0;bass<12;bass++){const withBass=complete&&expectedScale.has(bass);assert.equal(bassResults[bass].has(MODES[i].id),withBass);bassChecks++;}
 }
 }
 }
 assert.equal(inclusion,124740);assert.equal(bassChecks,1496880);
});
test('physical provenance preserved independently of duplicated pitch classes',()=>{
 const notes=positionsFromFrets([null,3,5,4,5,null]);const bass={midi:36,name:'C',octave:2,mode:'separate'};
 const before=JSON.stringify({notes,bass});const all=soundRecords(notes,bass);
 for(const center of centers)analyzeModes(all,center);
 assert.equal(JSON.stringify({notes,bass}),before);assert.equal(all.length,5);assert.equal(all[0].provenance,'bass');
});

test('Greene dispositions and conversions: independent modal lists on all centers with all bass classes',()=>{
 const origin=positionsFromFrets([null,3,5,4,5,null]);
 const candidates=[...systematicDispositions(origin),...systematicDispositions(origin,-1),...CONVERSIONS.filter(p=>p.from==='V-2').map(p=>applyConversion(origin,p))];
 for(const center of centers)for(let bass=0;bass<12;bass++){
  const wanted=ids([...origin.map(n=>n.midi),bass+24],center);
  for(const candidate of candidates)assert.deepEqual(ids([...candidate.pitches,bass+24],center),wanted);
 }
});
test('manual cardinalities retain notes without assigning four-voice roles',()=>{
 for(const count of [1,2,3,5,6]){const notes=Array.from({length:count},(_,i)=>({midi:48+i}));const result=soundRecords(notes);assert.equal(result.length,count);assert(result.every(n=>n.voice===null));assert.deepEqual(result.map(n=>n.noteNumber),Array.from({length:count},(_,i)=>i+1));}
 assert.deepEqual(soundRecords(records([48,55,59,64])).map(n=>n.voice),['B','T','A','S']);
});
