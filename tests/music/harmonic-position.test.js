import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {physicalNotes,physicalComparison,distinct,exactClasses,validFrets,noteName,readState,writeSystem,writeView,systemDefault,systemKey,VIEW_KEY,viewDefault} from '../../src/tools/harmonic-intersections/positionModel.js';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
let catalog,compare;
try{
 catalog=await server.ssrLoadModule('/src/tools/harmonic-intersections/catalogModel.ts');
 compare=(await server.ssrLoadModule('/src/legacy-tools/harmonic-intersections/music/intersectionAnalyzer.ts')).compareMaterials;
}finally{await server.close();}
const maj=[null,3,5,4,5,null],minor=[null,0,2,0,1,null],dm=[null,5,7,5,6,null];
const classes=f=>distinct(physicalNotes(f).map(n=>n.pc));
const storage=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};};
test('Independent physical fixtures, crossed voices and all frets 0–24',()=>{
 assert.deepEqual(physicalNotes(maj).map(n=>n.midi),[48,55,59,64]);
 assert.deepEqual(physicalNotes(minor).map(n=>n.midi),[45,52,55,60]);
 assert.deepEqual(physicalNotes(dm).map(n=>n.midi),[50,57,60,65]);
 assert.deepEqual(physicalNotes([null,10,0,1,0,null]).map(n=>n.midi),[50,55,56,59]);
 for(let string=1;string<=6;string++)for(let fret=0;fret<=24;fret++){
  const f=Array(6).fill(null);f[6-string]=fret;
  assert.equal(physicalNotes(f)[0].midi,[64,59,55,50,45,40][string-1]+fret);
 }
 for(const bad of [[],[null,null,null,null,null,25],[null,null,null,null,null,-1],[null,null,null,null,null,1.2],Array(6),'xxxxxx'])assert.equal(validFrets(bad),false);
 assert.equal(noteName(88),'E6');
});
test('Cmaj7 / Am7: common PCs, pitches and physical cells are different comparisons',()=>{
 const c=compare(classes(maj),classes(minor));
 assert.deepEqual(c.common,[0,4,7]);assert.deepEqual(c.onlyA,[11]);assert.deepEqual(c.onlyB,[9]);assert.equal(c.overlapPercent,75);
 const p=physicalComparison(physicalNotes(maj),physicalNotes(minor));
 assert.deepEqual(p.pitches.map(n=>n.midi),[55]);assert.equal(p.cells.length,0);
 assert.equal(p.pitches[0].a[0].stringNumber,4);assert.equal(p.pitches[0].b[0].stringNumber,3);
 const up=maj.map(f=>f===null?null:f+12);
 assert.equal(compare(classes(maj),classes(up)).overlapPercent,100);
 assert.equal(physicalComparison(physicalNotes(maj),physicalNotes(up)).pitches.length,0);
});
test('Mixed C Lydian / Dm7, complete differences and catalog spelling',()=>{
 const config={...systemDefault().catalog,scaleId:'lydian'},scale=catalog.catalogData(config,'A').material;
 assert.deepEqual(scale.noteNames,['C','D','E','F♯','G','A','B']);
 const c=compare(scale.notes,classes(dm));
 assert.deepEqual(c.common,[0,2,9]);assert.deepEqual(c.onlyA,[4,6,7,11]);assert.deepEqual(c.onlyB,[5]);
 const d=catalog.catalogData({...config,root:2,scaleId:'ionian',materialMode:'arpeggios'},'A');
 assert.deepEqual(d.material.noteNames,['D','F♯','A','C♯']);
});
test('Duplicates, unisons, enharmonic classes, empty and disjoint sets',()=>{
 const repeated=physicalNotes([null,3,2,0,1,0]);assert.equal(repeated.length,5);assert.deepEqual(distinct(repeated.map(n=>n.pc)),[0,4,7]);
 assert.deepEqual(compare([0,0,4,7,12],[0,4,7]).common,[0,4,7]);
 assert.deepEqual(physicalComparison(physicalNotes([null,null,2,null,5,0]),physicalNotes([null,null,2,null,5,0])).pitches.map(n=>n.midi),[52,64]);
 assert.ok(exactClasses([6,18,-6],[6]));
 assert.deepEqual(compare([],[]).common,[]);assert.equal(compare([],[0,4,7]).overlapPercent,0);
 assert.deepEqual(compare([0],[3]).common,[]);
});
test('Every proposed catalog match is exact and has a reproducible source',()=>{
 const wanted=classes(maj),matches=catalog.exactCatalogMatches(wanted);
 assert.ok(matches.some(m=>m.config.root===0&&m.config.scaleId==='ionian'&&m.config.materialMode==='arpeggios'&&m.config.selectedArpeggio===0));
 for(const m of matches){assert.ok(exactClasses(wanted,m.notes));assert.ok(exactClasses(wanted,catalog.catalogData(m.config,'B').material.notes));}
 assert.equal(catalog.exactCatalogMatches([]).length,0);assert.equal(catalog.exactCatalogMatches([0]).length,0);
 assert.equal(catalog.exactCatalogMatches([0,1]).length,0);
 assert.equal(classes(maj.map(f=>f===null?null:f+12)).join(','),wanted.join(','));
});
test('Validated A/B recovery, independent clearing, malformed data and storage failure',()=>{
 const s=storage(),a={...systemDefault(),mode:'manual',manual:maj},b={...systemDefault(),mode:'manual',manual:minor};
 assert.ok(writeSystem(s,'A',a));assert.ok(writeSystem(s,'B',b));writeView(s,{...viewDefault(),editing:'B'});
 const recovered=readState(s,['ionian','lydian']);assert.deepEqual(recovered.A.manual,maj);assert.deepEqual(recovered.B.manual,minor);assert.equal(recovered.view.editing,'B');
 writeSystem(s,'A',{...a,manual:Array(6).fill(null)});assert.deepEqual(readState(s,['ionian']).A.manual,Array(6).fill(null));assert.deepEqual(readState(s,['ionian']).B.manual,minor);
 s.setItem(systemKey('A'),'{broken');assert.deepEqual(readState(s,['ionian']).A,systemDefault());assert.deepEqual(readState(s,['ionian']).B.manual,minor);
 s.setItem(systemKey('A'),JSON.stringify({...a,version:1,manual:[null,null,null,null,null,25],catalog:{...a.catalog,scaleId:'not-a-mode'}}));
 assert.deepEqual(readState(s,['ionian']).A.manual,Array(6).fill(null));assert.deepEqual(readState(s,['ionian']).A.catalog,systemDefault().catalog);
 s.setItem(VIEW_KEY,JSON.stringify({version:1,editing:'X',range:{start:9,end:2},strings:[0,7],displayMode:'invalid'}));assert.deepEqual(readState(s,['ionian']).view.range,{start:0,end:12});
 const blocked={getItem(){throw new Error('blocked');},setItem(){throw new Error('blocked');}};
 assert.equal(readState(blocked,['ionian']).available,false);assert.equal(writeSystem(blocked,'A',a),false);assert.equal(writeView(blocked,viewDefault()),false);
});
