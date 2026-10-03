import { STANDARD_TUNING, pc, positionsFromFrets, orderedNotes, interpret, noteName, DEGREE_LABELS, estimateDifficulty } from './music.js';
export const BASS_NOTES=[['C',0],['C♯',1],['D♭',1],['D',2],['D♯',3],['E♭',3],['E',4],['F',5],['F♯',6],['G♭',6],['G',7],['G♯',8],['A♭',8],['A',9],['A♯',10],['B♭',10],['B',11]];
export function bassNote(name,octave,mode='separate') {
 const entry=BASS_NOTES.find(n=>n[0]===name);
 if(!entry||!Number.isInteger(octave)||octave<0||octave>8||!['separate','guitar'].includes(mode))return null;
 return {midi:12*(octave+1)+entry[1],name,octave,mode};
}
export function validateBass(frets,bass,pitches=null) {
 if(!bass)return {valid:true,reason:''};
 const notes=pitches??positionsFromFrets(frets).map(p=>p.midi);
 if(bass.mode==='guitar'&&Number.isInteger(bass.stringNumber)&&bass.stringNumber>=1&&bass.stringNumber<=6&&frets[6-bass.stringNumber]!==null)return {valid:false,reason:`Collisione: la corda ${bass.stringNumber} è occupata dalla posizione.`};
 if(notes.length!==4)return {valid:false,reason:'Servono quattro note originali.'};
 if(!Number.isInteger(bass.midi)||bass.midi<0||bass.midi>127||!['separate','guitar'].includes(bass.mode))return {valid:false,reason:'Nota e ottava del basso non valide.'};
 if(bass.midi>=Math.min(...notes))return {valid:false,reason:`Il basso deve essere sotto ${noteName(Math.min(...notes))}.`};
 if(bass.mode==='guitar') {
  const tuning=STANDARD_TUNING.find(s=>s.stringNumber===bass.stringNumber);
  if(!tuning||!Number.isInteger(bass.fret)||bass.fret<0||bass.fret>24||tuning.midi+bass.fret!==bass.midi)return {valid:false,reason:'Serve una realizzazione esatta su una corda inutilizzata.'};
  if(frets[6-bass.stringNumber]!==null)return {valid:false,reason:`Collisione: la corda ${bass.stringNumber} è occupata dalla posizione.`};
 }
 return {valid:true,reason:''};
}
export function findBassPositions(frets,bass) {
 if(!bass||!validateBass(frets,{...bass,mode:'separate'}).valid)return [];
 return STANDARD_TUNING.flatMap(s=>{
  const fret=bass.midi-s.midi;
  if(frets[6-s.stringNumber]!==null||!Number.isInteger(fret)||fret<0||fret>24)return [];
  const result={...bass,mode:'guitar',stringNumber:s.stringNumber,fret};
  return [{...result,difficulty:estimateDifficulty([...positionsFromFrets(frets),{midi:bass.midi,stringNumber:s.stringNumber,fret}])}];
 });
}
export function physicalFrets(frets,bass) {
 const result=[...frets];
 if(bass?.mode==='guitar'&&validateBass(frets,bass).valid)result[6-bass.stringNumber]=bass.fret;
 return result;
}
export function soundingPitches(frets,bass) {return [...positionsFromFrets(frets).map(p=>p.midi),...(bass?[bass.midi]:[])].sort((a,b)=>a-b);}
export function interpretWithBass(pitches,root,bass) {
 if(!bass)return interpret(pitches,root);
 const all=[bass.midi,...pitches].sort((a,b)=>a-b);
 const full=interpret(all,root);
 if(full.symbol)return {...full,bassRole:'formula',bassDescription:`Basso aggiunto ${bass.name}${bass.octave}: nota della formula.`};
 const upper=interpret(pitches,root);
 if(upper.symbol&&!upper.formulaIntervals.includes(pc(bass.midi-root))) {
  const chord=upper.symbol.split('/')[0];
  return {...upper,symbol:`${chord}/${bass.name}`,degrees:[DEGREE_LABELS[pc(bass.midi-root)],...upper.degrees],bassRole:'external',bassDescription:`${chord}${upper.complete?' completo':''} sopra un basso ${bass.name}, esterno alla formula.`,score:upper.score+1};
 }
 return {...full,bassRole:'unassigned',bassDescription:`Basso aggiunto ${bass.name}${bass.octave}; formula non assegnata.`};
}
export function analyzeWithBass(pitches,root,bass) {
 const selected=interpretWithBass(pitches,root,bass);
 const alternatives=Array.from({length:12},(_,r)=>r).filter(r=>r!==root).map(r=>interpretWithBass(pitches,r,bass)).filter(r=>r.symbol).sort((a,b)=>a.score-b.score||a.root-b.root).slice(0,2);
 return {selected,alternatives,ambiguous:Boolean(selected.symbol&&alternatives.length)};
}
export function bassCompatibility(frets,bass,pitches) {
 if(!bass)return {valid:true,registerValid:true,stringValid:true,reason:''};
 const register=validateBass(frets,{...bass,mode:'separate'},pitches);
 const tuning=STANDARD_TUNING.find(s=>s.stringNumber===bass.stringNumber);
 const stringValid=bass.mode==='separate'||Boolean(tuning&&frets[6-bass.stringNumber]===null&&Number.isInteger(bass.fret)&&bass.fret>=0&&bass.fret<=24&&tuning.midi+bass.fret===bass.midi);
 return {valid:register.valid&&stringValid,registerValid:register.valid,stringValid,reason:[register.valid?'':register.reason,stringValid?'':`Collisione o assegnazione non valida: corda ${bass.stringNumber}.`].filter(Boolean).join(' ')};
}
