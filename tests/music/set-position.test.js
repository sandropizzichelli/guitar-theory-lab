import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeClasses,analyzePosition,POSITION_CATALOG,fretsFromVoicing} from '../../src/tools/set-class-explorer/positionAnalysis.js';
import {parseNotes} from '../../src/legacy-tools/set-visualizer/setUtils.js';
import {FORTE_REFERENCE} from '../../src/legacy-tools/set-visualizer/setData.js';
test('Fixture indipendenti: accordi, raddoppi e altezze reali',()=>{
 for(const [frets,midi,id,pf,iv] of [
 [[null,3,2,0,1,0],[48,52,55,60,64],'3-11',[0,3,7],[0,0,1,1,1,0]],
 [[null,3,5,4,5,null],[48,55,59,64],'4-20',[0,1,5,8],[1,0,1,2,2,0]],
 [[null,0,2,0,1,null],[45,52,55,60],'4-26',[0,3,5,8],[0,1,2,1,2,0]],
 [[null,3,4,3,4,null],[48,54,58,63],'4-27',[0,2,5,8],[0,1,2,1,1,1]]]){
 const before=[...frets],r=analyzePosition(frets);assert.deepEqual(r.notes.map(n=>n.midi),midi);assert.equal(r.forte,id);assert.deepEqual(r.prime,pf);assert.deepEqual(r.vector,iv);assert.deepEqual(frets,before);
 }
 const doubled=analyzePosition([0,null,null,null,null,0]);assert.equal(doubled.notes.length,2);assert.equal(doubled.cardinality,1);assert.equal(doubled.forte,null);assert.deepEqual(doubled.prime,[0]);assert.deepEqual(doubled.vector,[0,0,0,0,0,0]);
 assert.equal(analyzePosition(Array(6).fill(null)).cardinality,0);
 assert.deepEqual(analyzePosition([null,10,0,1,0,null]).notes.map(n=>n.stringNumber),[4,5,3,2]);
});
test('Tutti i 2431 insiemi del catalogo: riconoscimento indipendente per orbite Tn/TnI',()=>{
 const orbit=new Map();
 for(const {id,prime} of POSITION_CATALOG)for(const sign of [1,-1])for(let t=0;t<12;t++){
 const key=prime.map(pc=>(sign*pc+t+24)%12).sort((a,b)=>a-b).join(',');assert.ok(!orbit.has(key)||orbit.get(key)===id);orbit.set(key,id);
 }
 assert.equal(orbit.size,2431);
 for(const [key,id] of orbit){const pcs=key.split(',').map(Number),r=analyzeClasses(pcs);assert.equal(r.forte,id,key);assert.deepEqual(r.prime,POSITION_CATALOG.find(c=>c.id===id).prime);assert.equal(r.vector.reduce((a,b)=>a+b,0),pcs.length*(pcs.length-1)/2);}
 for(const c of POSITION_CATALOG){if(FORTE_REFERENCE[c.id]?.iv)assert.equal(analyzeClasses(c.prime).vector.join(''),FORTE_REFERENCE[c.id].iv.replace(/[^0-9]/g,''));}
});
test('Fuori catalogo, equivalenze e coppia Z indipendente',()=>{
 for(const pcs of [[],[0],[0,1],[0,1,2,3,4,5,6]]){const r=analyzeClasses(pcs);assert.equal(r.forte,null);assert.equal(r.cardinality,pcs.length);assert.ok(r.limit);}
 assert.deepEqual(analyzeClasses([6,18,-6,1]),analyzeClasses([1,6]));assert.deepEqual(analyzeClasses(parseNotes('C E G♭ B♭').pcs),analyzeClasses(parseNotes('C E F♯ A♯').pcs));
 assert.equal(analyzeClasses([0,1,4,6]).forte,'4-Z15');assert.equal(analyzeClasses([0,1,3,7]).forte,'4-Z29');assert.deepEqual(analyzeClasses([0,1,4,6]).vector,[1,1,1,1,1,1]);
});
test('Trasferimento conserva corde e tasti, rifiuta collisioni e corrispondenze false',()=>{
 const p=[{stringIndex:1,fret:3,pc:0},{stringIndex:2,fret:2,pc:4}];assert.deepEqual(fretsFromVoicing({positions:p}),[null,3,2,null,null,null]);
 for(const positions of [[...p,p[0]],[{stringIndex:0,fret:13}],[{stringIndex:0,fret:0,pc:5}],[{stringIndex:0,fret:0,midi:52}],[]])assert.equal(fretsFromVoicing({positions}),null);
});
test('Registro manuale 13–24, raddoppi ed esatta equivalenza della classe',()=>{
 for(let f=13;f<=24;f++){
  const r=analyzePosition([f,null,null,null,null,f]);assert.deepEqual(r.notes.map(n=>n.midi),[40+f,64+f]);assert.equal(r.cardinality,1);assert.equal(r.notes.length,2);
 }
 const upper=analyzePosition([null,15,14,12,13,12]),lower=analyzePosition([null,3,2,0,1,0]);assert.deepEqual(upper.notes.map(n=>n.midi),[60,64,67,72,76]);assert.equal(upper.forte,lower.forte);assert.deepEqual(upper.vector,lower.vector);assert.equal(upper.duplicates.length,2);
 for(const bad of [[25,null,null,null,null,null],[-1,null,null,null,null,null],[1.5,null,null,null,null,null]])assert.throws(()=>analyzePosition(bad));
});
