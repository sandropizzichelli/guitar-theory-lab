import test from 'node:test';
import assert from 'node:assert/strict';
import { applyDrop, buildCloseDispositions, classifyV, findExactPositions, positionsFromFrets, orderedNotes, interpret, analyze, noteName, parseStructure, DROP_TYPES, estimateDifficulty, constructionNoteName, QUALITIES } from '../../src/tools/voicing-lab/music.js';
const fixtures = [
 [60,64,67,71],[55,60,64,71],[52,55,60,71],[52,60,67,71],
 [48,55,64,71],[48,64,67,71],[43,60,64,71],[43,52,60,71],
 [43,48,52,71],[43,48,64,71],[40,48,55,71],[40,55,60,71],
 [48,52,67,71],[48,52,55,71]
];
test('the three actual guitar examples, interpretations, omissions and spelling',()=> {
 const cases=[
  {frets:[null,3,5,4,5,null],pitches:[48,55,59,64],root:0,symbol:'Cmaj7',alt:9,altSymbol:'Am9/C',omitted:['fondamentale']},
  {frets:[null,0,2,0,1,null],pitches:[45,52,55,60],root:9,symbol:'Am7',alt:0,altSymbol:'C6/A',omitted:[]},
  {frets:[null,3,4,3,4,null],pitches:[48,54,58,63],root:0,symbol:'Cø7',alt:8,altSymbol:'A♭9/C',omitted:['fondamentale']}
 ];
 for(const c of cases) {
  const positions=orderedNotes(positionsFromFrets(c.frets));
  const pitches=positions.map(p=>p.midi);
  assert.deepEqual(pitches,c.pitches);
  assert.equal(classifyV(pitches).group,'V-2');
  assert.equal(interpret(pitches,c.root).symbol,c.symbol);
  const alt=interpret(pitches,c.alt);
  assert.equal(alt.symbol,c.altSymbol);
  assert.deepEqual(alt.omissions,c.omitted);
  assert.ok(findExactPositions(pitches).some(p=>p.frets.join(',')===c.frets.join(',')));
  const before=structuredClone(positions);
  for(let root=0;root<12;root++) analyze(pitches,root);
  assert.deepEqual(positions,before);
 }
 const d=interpret([48,54,58,63],2);
 assert.equal(d.symbol,'D7(♭9,♭13)/C');
 assert.deepEqual(d.omissions,['fondamentale','quinta']);
 assert.deepEqual(d.degrees,['♭7','3','♭13','♭9']);
 assert.equal(noteName(54,2,d.degrees[1]),'F♯3');
 assert.equal(noteName(54,0,'♭5'),'G♭3');
});
test('formula completeness is independent of contextual ambiguity',()=> {
 const a=analyze([45,52,55,60],9);
 assert.equal(a.selected.complete,true);
 assert.equal(a.ambiguous,true);
 assert.equal(a.alternatives[0].symbol,'C6/A');
 assert.equal(a.alternatives[0].complete,true);
 assert.equal(interpret([48,55,59,64],9).contextual,true);
 assert.equal(interpret([48,55,59,64],9).complete,false);
 assert.equal(interpret([48,49,54,58],0).symbol,null);
});
test('all four close dispositions and every simultaneous drop match absolute fixtures',()=> {
 assert.deepEqual(buildCloseDispositions(0,[0,4,7,11],4),[
  [60,64,67,71],[64,67,71,72],[67,71,72,76],[71,72,76,79]
 ]);
 const expected=[[60,64,67,71],[55,60,64,71],[52,60,67,71],[48,64,67,71],[52,55,60,71],[48,55,64,71],[48,52,67,71],[48,52,55,71]];
 DROP_TYPES.forEach((d,i)=>assert.deepEqual(applyDrop([60,64,67,71],d.voices),expected[i]));
 assert.throws(()=>applyDrop([48,64,67,71],[2]));
});
test('all 495 tetrachords, four close rotations, eight transformations preserve pitches and verified V correspondence',()=> {
 const expectedGroups=['V-1','V-2','V-4','V-6','V-3','V-5','V-13','V-14'];
 let count=0;
 for(let a=0;a<9;a++) for(let b=a+1;b<10;b++) for(let c=b+1;c<11;c++) for(let d=c+1;d<12;d++) {
  const pcs=[a,b,c,d];count++;
  for(const close of buildCloseDispositions(0,pcs,4)) {
   assert.ok(close[3]-close[0]<12);
   DROP_TYPES.forEach((drop,i)=> {
    const output=applyDrop(close,drop.voices);
    assert.equal(classifyV(output).group,expectedGroups[i]);
    assert.deepEqual(output.map(p=>p%12).sort((x,y)=>x-y),pcs);
    assert.equal(output[3],close[3]);
   });
  }
 }
 assert.equal(count,495);
});
test('all fourteen published V groups, transposition and systematic dispositions',()=> {
 const cycle=[0,4,7,11];
 fixtures.forEach((pitches,index)=> {
  assert.equal(classifyV(pitches).group,`V-${index+1}`);
  for(let shift=0;shift<12;shift++) assert.equal(classifyV(pitches.map(p=>p+shift)).group,`V-${index+1}`);
  let current=pitches;
  for(let rotation=0;rotation<4;rotation++) {
   assert.equal(classifyV(current).group,`V-${index+1}`);
   current=current.map(p=>{const rank=cycle.indexOf(p%12);return p+(rank===3?12-p%12:cycle[rank+1]-p%12);});
  }
 });
 assert.equal(classifyV([48,52,55,60]).group,null);
 assert.equal(classifyV([48,52,55]).group,null);
 assert.equal(classifyV([24,52,79,95]).group,null);
});
test('crossed voices sort by pitch, and exact search does not assume string order',()=> {
 const frets=[null,15,0,0,0,null];
 const positions=orderedNotes(positionsFromFrets(frets));
 assert.deepEqual(positions.map(p=>p.midi),[50,55,59,60]);
 assert.deepEqual(positions.map(p=>p.stringNumber),[4,3,2,5]);
 assert.equal(classifyV(positions.map(p=>p.midi)).group,'V-1');
 assert.ok(findExactPositions([50,55,59,60],{maxFret:15,maxSpan:0}).some(c=>c.frets.join(',')===frets.join(',')));
});
test('search respects exact pitches and all filters; impossible ranges do not mutate theory',()=> {
 const target=[48,55,59,64];
 const before=[...target];
 const candidates=findExactPositions(target,{minFret:1,maxFret:10,maxSpan:3,strings:[2,3,4,5]});
 assert.ok(candidates.length>0);
 for(const candidate of candidates) {
  assert.deepEqual(candidate.positions.map(p=>p.midi).sort((a,b)=>a-b),target);
  assert.equal(new Set(candidate.positions.map(p=>p.stringNumber)).size,4);
  assert.ok(candidate.positions.every(p=>p.fret>=1&&p.fret<=10&&[2,3,4,5].includes(p.stringNumber)));
  assert.ok(candidate.difficulty.span<=3);
 }
 assert.deepEqual(findExactPositions(target,{minFret:0,maxFret:0}),[]);
 assert.deepEqual(findExactPositions(target,{strings:[1,2,3]}),[]);
 assert.deepEqual(findExactPositions([24,28,31,35]),[]);
 assert.deepEqual(target,before);
 assert.equal(estimateDifficulty(positionsFromFrets([null,0,2,0,1,null])).span,1);
});
test('custom structures validate four distinct degrees',()=> {
 assert.deepEqual(parseStructure('1 2 #4 6').intervals,[0,2,6,9]);
 assert.deepEqual(parseStructure('1 ♭3 ♭5 ♭7').intervals,[0,3,6,10]);
 for(const value of ['1 3 5','1 3 5 7 9','1 2 9 5','1 nope 5 7']) assert.ok(parseStructure(value).error);
 assert.equal(noteName(57,0,'♭♭7'),'B♭♭3');
});
test('gap recognition agrees with independently encoded Method 1 master formulas and extra octaves',()=> {
 const master={
  'BTAS':1,'SBTA':1,'ASBT':1,'TASB':1,
  'TABS':2,'STAB':2,'BSTA':2,'ABST':2,
  'ABTS':3,'SABT':3,'TSAB':3,'BTSA':3,
  'STBA':4,'ASTB':4,'BAST':4,'TBAS':4,
  'BATS':5,'SBAT':5,'TSBA':5,'ATSB':5,
  'TBSA':8,'ATBS':8,'SATB':8,'BSAT':8
 };
 const extra={'1:0':6,'2:0':7,'3:0':12,'1:1':13,'2:1':10,'1:2':14,'2:2':9,'4:2':11};
 for(const pitches of fixtures) {
  const sequence=pitches.map((midi,i)=>({pc:midi%12,voice:'BTAS'[i]})).sort((a,b)=>a.pc-b.pc).map(p=>p.voice).join('');
  const basic=master[sequence];
  const octaveGap=pitches.slice(1).findIndex((midi,i)=>midi-pitches[i]>12);
  const expected=octaveGap<0?basic:extra[`${basic}:${octaveGap}`];
  assert.equal(classifyV(pitches).group,`V-${expected}`);
 }
});
test('Dmaj7 spelling follows the formula through all four closes, every drop and exact results',()=> {
 const formula=QUALITIES.find(q=>q.id==='maj7');
 const closes=buildCloseDispositions(2,formula.intervals,3);
 assert.deepEqual(closes,[[50,54,57,61],[54,57,61,62],[57,61,62,66],[61,62,66,69]]);
 assert.deepEqual(closes.map(pitches=>pitches.map(p=>constructionNoteName(p,2,formula))),[
  ['D3','F♯3','A3','C♯4'],['F♯3','A3','C♯4','D4'],['A3','C♯4','D4','F♯4'],['C♯4','D4','F♯4','A4']
 ]);
 const groups=['V-1','V-2','V-4','V-6','V-3','V-5','V-13','V-14'];
 for(const close of closes) DROP_TYPES.forEach((drop,i)=> {
  const target=applyDrop(close,drop.voices);
  const snapshot=[...target];
  const names=target.map(p=>constructionNoteName(p,2,formula));
  assert.ok(names.every(name=>/^(D|F♯|A|C♯)\d+$/.test(name)));
  assert.deepEqual(target,snapshot);
  assert.equal(classifyV(target).group,groups[i]);
  for(const candidate of findExactPositions(target)) {
   assert.deepEqual(candidate.positions.map(p=>p.midi),target);
   assert.ok(candidate.positions.map(p=>constructionNoteName(p.midi,2,formula)).every(name=>/^(D|F♯|A|C♯)\d+$/.test(name)));
  }
 });
 // Enharmonic and octave-boundary cases retain the sounding MIDI octave.
 assert.equal(constructionNoteName(60,1,formula),'C4');
 assert.equal(constructionNoteName(59,8,QUALITIES.find(q=>q.id==='m7')),'C♭4');
});
test('free construction uses neutral chromatic flat names, without guessing a formula',()=> {
 assert.equal(constructionNoteName(54,2),'G♭3');
 assert.equal(constructionNoteName(61,2),'D♭4');
 const reading=interpret([48,54,58,63],2);
 assert.equal(noteName(54,2,reading.degrees[1]),'F♯3');
 assert.equal(interpret([48,55,59,64],0).reason,'');
 assert.ok(!reading.reason.includes('Omesse'));
 assert.ok(!reading.reason.includes(reading.degrees.join(' · ')));
});
