import test from 'node:test';
import assert from 'node:assert/strict';
import {bassNote,validateBass,findBassPositions,physicalFrets,soundingPitches,analyzeWithBass} from '../../src/tools/voicing-lab/bass.js';
import {positionsFromFrets,classifyV} from '../../src/tools/voicing-lab/music.js';
import {applyConversion,CONVERSIONS} from '../../src/tools/voicing-lab/greene.js';
const frets=[null,3,5,4,5,null];const pitches=[48,55,59,64];
test('four proposal examples: Cmaj7/A, Am9, D altered, unavailable D2 guitar and C2 duplicate',()=>{
 const a=bassNote('A',2);const results=findBassPositions(frets,a);assert.equal(results.length,1);assert.equal(results[0].stringNumber,6);assert.equal(results[0].fret,5);
 assert.deepEqual(physicalFrets(frets,results[0]),[5,3,5,4,5,null]);assert.deepEqual(frets,[null,3,5,4,5,null]);
 const c=analyzeWithBass(pitches,0,a).selected;assert.equal(c.symbol,'Cmaj7/A');assert.equal(c.complete,true);assert.equal(c.bassRole,'external');assert.deepEqual(c.omissions,[]);assert.match(c.bassDescription,/esterno alla formula/);
 const am=analyzeWithBass(pitches,9,a).selected;assert.equal(am.symbol,'Am9');assert.equal(am.complete,true);assert.equal(am.bassRole,'formula');
 const half=[null,3,4,3,4,null];const d=bassNote('D',2);const altered=analyzeWithBass(positionsFromFrets(half).map(p=>p.midi),2,d).selected;
 assert.equal(altered.symbol,'D7(♭9,♭13)');assert.deepEqual(altered.omissions,['quinta']);assert.equal(altered.bassRole,'formula');
 assert.deepEqual(findBassPositions(frets,d),[]);assert.equal(validateBass(frets,d).valid,true);assert.equal(validateBass(frets,{...d,mode:'guitar',stringNumber:6,fret:-2}).valid,false);
 const duplicate=bassNote('C',2);assert.deepEqual(soundingPitches(frets,duplicate),[36,48,55,59,64]);assert.equal(new Set(soundingPitches(frets,duplicate).map(p=>p%12)).size,4);assert.equal(analyzeWithBass(pitches,0,duplicate).selected.symbol,'Cmaj7');assert.equal(classifyV(pitches).group,'V-2');assert.equal(classifyV(soundingPitches(frets,duplicate)).group,null);
});
test('strict register, empty or malformed notes, exact unused-string search and open notes',()=>{
 for(const n of [bassNote('C',3),bassNote('D',3)])assert.equal(validateBass(frets,n).valid,false);
 assert.equal(bassNote('C',NaN),null);assert.equal(bassNote('C',9),null);assert.equal(bassNote('H',2),null);
 assert.equal(validateBass(frets,{midi:NaN,mode:'separate'}).valid,false);
 assert.equal(validateBass([null,null,null,null,null,null],bassNote('C',2)).valid,false);
 const e=findBassPositions(frets,bassNote('E',2));assert.equal(e[0].fret,0);assert.equal(validateBass(frets,e[0]).valid,true);
 assert.equal(findBassPositions([1,3,5,4,5,1],bassNote('E',2)).length,0);
 const sharp=bassNote('F♯',2),flat=bassNote('G♭',2);assert.equal(sharp.midi,flat.midi);assert.notEqual(sharp.name,flat.name);
});
test('Greene register and string availability are independent of four-voice group; snapshot restores all physical state',()=>{
 const a=findBassPositions(frets,bassNote('A',2))[0];
 const conv=applyConversion(positionsFromFrets(frets),CONVERSIONS.find(c=>c.id==='v2-v3-a-down'));assert.equal(conv.classification.group,'V-3');
 assert.equal(validateBass([7,3,5,null,5,null],a).valid,false);assert.match(validateBass([7,3,5,null,5,null],a).reason,/Collisione/);
 assert.equal(validateBass([null,3,5,4,5,null],bassNote('B',2),[40,55,59,64]).valid,false);
 assert.equal(validateBass([null,3,5,null,0,0],a).valid,true);
 const snapshot=structuredClone({frets,bass:a});const newState={frets:[null,3,5,null,0,0],bass:{...a}};
 assert.notDeepEqual(newState.frets,snapshot.frets);assert.deepEqual(snapshot.frets,frets);assert.deepEqual(physicalFrets(snapshot.frets,snapshot.bass),[5,3,5,4,5,null]);
});
