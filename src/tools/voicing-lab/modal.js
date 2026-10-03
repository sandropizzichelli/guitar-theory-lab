import {pc} from './music.js';
export const MODAL_SOURCES={
 major:{title:'Dirk Laukens · Guitar Modes',url:'https://www.jazzguitar.be/blog/guitar-modes/'},
 melodic:{title:'Dirk Laukens · Melodic Minor Modes',url:'https://www.jazzguitar.be/blog/melodic-minor-modes'},
 harmonic:{title:'Stef Ramin · Harmonic Minor Modes',url:'https://www.jazz-guitar-licks.com/pages/guitar-scales-modes/modes-of-the-harmonic-minor-scale/'}
};
export const FAMILIES=[{id:'major',label:'Maggiore',base:[0,2,4,5,7,9,11],prefix:'MAJ'},{id:'melodic',label:'Minore melodica',base:[0,2,3,5,7,9,11],prefix:'MM'},{id:'harmonic',label:'Minore armonica',base:[0,2,3,5,7,8,11],prefix:'HM'}];
const descriptions=[
 ['Ionico','Dorico','Frigio','Lidio','Misolidio','Eolio','Locrio'],
 ['Minore melodica','Dorico ♭2','Lidio aumentato','Lidio dominante','Misolidio ♭6','Locrio ♮2','Superlocrio'],
 ['Minore armonica','Locrio ♮6','Ionico ♯5','Dorico ♯4','Frigio dominante','Lidio ♯2','Superlocrio ♭♭7']
];
const characteristics=[[[4,11],[2,9],[1,8],[6,11],[9,10],[8],[6]],[[3,9,11],[1,9],[6,8],[6,10],[8,10],[2,6],[4]],[[8,11],[6,9],[8,11],[6,9],[1,4],[3,6],[4,9]]];
const aliases={'MM-VI':'Eolio ♭5','MM-VII':'Alterata / locrio ♭4','HM-VII':'Ultralocrio'};
const roman=['I','II','III','IV','V','VI','VII'];
const majorDegrees=[0,2,4,5,7,9,11];
const accidental=n=>n<0?'♭'.repeat(-n):'♯'.repeat(n);
export const MODES=FAMILIES.flatMap((family,f)=>family.base.map((start,i)=>{
 const intervals=family.base.map((_,j)=>pc(family.base[(i+j)%7]-start));
 const degrees=intervals.map((v,j)=>`${accidental(v-majorDegrees[j])}${j+1}`);
 const id=`${family.prefix}-${roman[i]}`;
 return {id,family:family.id,familyLabel:family.label,number:roman[i],name:descriptions[f][i],alias:aliases[id],intervals,degrees,characteristics:characteristics[f][i],source:MODAL_SOURCES[family.id]};
}));
const letters=['C','D','E','F','G','A','B'];
const naturals=[0,2,4,5,7,9,11];
export function parseCenter(name){
 const match=/^([A-G])([♭♯]*)$/.exec(name??'');
 if(!match)return null;
 const letter=letters.indexOf(match[1]);
 const alteration=[...match[2]].reduce((n,a)=>n+(a==='♯'?1:-1),0);
 return {name,letter,alteration,pc:pc(naturals[letter]+alteration)};
}
export function modalSpelling(mode,center,midi=null){
 const c=parseCenter(center);if(!c)return [];
 return mode.intervals.map((interval,i)=>{
  const letter=(c.letter+i)%7;
  const target=naturals[c.letter]+c.alteration+interval;
  const natural=naturals[letter]+12*Math.floor((c.letter+i)/7);
  const alteration=target-natural;
  const name=letters[letter]+accidental(alteration);
  const pitchClass=pc(target);
  const octave=midi!==null&&pc(midi)===pitchClass?Math.floor((midi-(naturals[letter]+alteration))/12)-1:null;
  return {name,pc:pitchClass,degree:mode.degrees[i],interval,octave,label:octave===null?name:`${name}${octave}`};
 });
}
export function soundRecords(notes,bass=null){
 const original=notes.map((note,i)=>({...note,provenance:'position',voice:note.id??(notes.length===4?['B','T','A','S'][i]:null),noteNumber:i+1}));
 if(bass)original.push({...bass,provenance:'bass',voice:'＋'});
 return original.sort((a,b)=>a.midi-b.midi);
}
export function analyzeModes(records,center,families=FAMILIES.map(f=>f.id)){
 const c=parseCenter(center);if(!c||!records.length)return {complete:[],partial:[],empty:[],classes:[],records,centerPresent:false};
 const classes=[...new Set(records.map(n=>pc(n.midi)))].sort((a,b)=>a-b);
 const rows=MODES.filter(m=>families.includes(m.family)).map(mode=>{
  const scale=modalSpelling(mode,center);
  const scaleClasses=scale.map(n=>n.pc);
  const outside=classes.filter(n=>!scaleClasses.includes(n));
  const shared=classes.length-outside.length;
  const present=records.map(record=>({record,spelling:modalSpelling(mode,center,record.midi).find(n=>n.pc===pc(record.midi))??null}));
  return {...mode,scale,outside,shared,present,characteristicsPresent:scale.filter(n=>mode.characteristics.includes(n.interval)&&classes.includes(n.pc)),characteristicsAbsent:scale.filter(n=>mode.characteristics.includes(n.interval)&&!classes.includes(n.pc)),discriminantsAbsent:[]};
 });
 const complete=rows.filter(r=>!r.outside.length);
 for(const row of complete)row.discriminantsAbsent=row.scale.filter(n=>!classes.includes(n.pc)&&complete.some(other=>other.id!==row.id&&!other.scale.some(s=>s.pc===n.pc)));
 return {complete,partial:rows.filter(r=>r.outside.length&&r.shared),empty:rows.filter(r=>!r.shared),classes,records,centerPresent:classes.includes(c.pc)};
}
