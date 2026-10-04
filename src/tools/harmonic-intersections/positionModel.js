// Physical positions and browser state belong to this tool, not to the shared board.
export const TUNING=[64,59,55,50,45,40].map((midi,i)=>({stringNumber:i+1,midi}));
export const CHROMATIC_NAMES=['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
export const pc=n=>((n%12)+12)%12;
export const noteName=m=>`${CHROMATIC_NAMES[pc(m)]}${Math.floor(m/12)-1}`;
export const validFrets=f=>Array.isArray(f)&&f.length===6&&Array.from(f).every(n=>n===null||Number.isInteger(n)&&n>=0&&n<=24);
export function physicalNotes(frets){
 if(!validFrets(frets))throw new Error('Sei corde: tasti interi 0–24 oppure mute.');
 return frets.flatMap((fret,index)=>fret===null?[]:[{stringNumber:6-index,fret,midi:TUNING[5-index].midi+fret,pc:pc(TUNING[5-index].midi+fret)}]).sort((a,b)=>a.midi-b.midi||b.stringNumber-a.stringNumber);
}
export const distinct=notes=>[...new Set(notes.map(pc))].sort((a,b)=>a-b);
export const exactClasses=(a,b)=>distinct(a).join(',')===distinct(b).join(',');
export function physicalComparison(a,b){
 const midi=[...new Set(a.map(n=>n.midi))].filter(m=>b.some(n=>n.midi===m)).sort((a,b)=>a-b);
 return {pitches:midi.map(m=>({midi:m,a:a.filter(n=>n.midi===m),b:b.filter(n=>n.midi===m)})),cells:a.filter(n=>b.some(m=>m.stringNumber===n.stringNumber&&m.fret===n.fret))};
}
export const catalogDefault=()=>({root:0,scaleId:'ionian',materialMode:'scales',arpeggioType:'seventh',selectedArpeggio:0,pentatonicType:'major',selectedPentatonic:0});
export const systemDefault=()=>({mode:'catalog',manual:Array(6).fill(null),catalog:catalogDefault()});
export const viewDefault=()=>({editing:'A',displayMode:'notes',layers:{notesA:true,notesB:true,common:true},range:{start:0,end:12},strings:[1,2,3,4,5,6]});
export const systemKey=id=>`gtl.harmonic.${id}.v1`;
export const VIEW_KEY='gtl.harmonic.view.v1';
export function validCatalog(c,scaleIds){
 return !!c&&Number.isInteger(c.root)&&c.root>=0&&c.root<12&&scaleIds.includes(c.scaleId)&&['scales','arpeggios','pentatonics'].includes(c.materialMode)&&['triad','seventh','ninth','eleventh','thirteenth'].includes(c.arpeggioType)&&['major','minor'].includes(c.pentatonicType)&&[c.selectedArpeggio,c.selectedPentatonic].every(n=>Number.isInteger(n)&&n>=0&&n<7);
}
export function readState(storage,scaleIds){
 const state={A:systemDefault(),B:systemDefault(),view:viewDefault(),available:true};
 for(const id of ['A','B'])try{
  const saved=JSON.parse(storage.getItem(systemKey(id)));
  if(saved?.version===1){
   if(saved.mode==='catalog'||saved.mode==='manual')state[id].mode=saved.mode;
   if(validFrets(saved.manual))state[id].manual=[...saved.manual];
   if(validCatalog(saved.catalog,scaleIds))state[id].catalog={...saved.catalog};
  }
 }catch(error){if(!(error instanceof SyntaxError))state.available=false;}
 try{
  const s=JSON.parse(storage.getItem(VIEW_KEY));
  if(s?.version===1){
   if(s.editing==='A'||s.editing==='B')state.view.editing=s.editing;
   if(s.displayMode==='notes'||s.displayMode==='degrees')state.view.displayMode=s.displayMode;
   if(s.layers&&['notesA','notesB','common'].every(k=>typeof s.layers[k]==='boolean'))state.view.layers={...s.layers};
   if(Number.isInteger(s.range?.start)&&Number.isInteger(s.range?.end)&&s.range.start>=0&&s.range.end<=12&&s.range.start<=s.range.end)state.view.range={...s.range};
   if(Array.isArray(s.strings)&&s.strings.every(n=>Number.isInteger(n)&&n>=1&&n<=6))state.view.strings=[...new Set(s.strings)];
  }
 }catch(error){if(!(error instanceof SyntaxError))state.available=false;}
 // The visible editor must refer to a manual system whenever one exists.
 if(state[state.view.editing].mode!=='manual'){
  const manual=['A','B'].find(id=>state[id].mode==='manual');if(manual)state.view.editing=manual;
 }
 return state;
}
export function writeSystem(storage,id,system){try{storage.setItem(systemKey(id),JSON.stringify({version:1,...system}));return true;}catch{return false;}}
export function writeView(storage,view){try{storage.setItem(VIEW_KEY,JSON.stringify({version:1,...view}));return true;}catch{return false;}}
