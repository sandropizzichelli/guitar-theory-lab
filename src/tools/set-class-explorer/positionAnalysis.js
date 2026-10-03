import {STRINGS,PC_TO_NAME,TRICHORD_FORTE_MAP,TETRACHORD_KEYS,PENTACHORD_KEYS,HEXACHORD_KEYS,FORTE_REFERENCE} from '../../legacy-tools/set-visualizer/setData.js';
import {normalizePcs,normalOrder,primeForm,parsePfString,rotateToStartAtZero} from '../../legacy-tools/set-visualizer/setUtils.js';
export const MAX_INPUT_FRET=24;
export const MAX_EXPLORE_FRET=12;
export const isValidInputFrets=frets=>Array.isArray(frets)&&frets.length===6&&Array.from(frets).every(f=>f===null||(Number.isInteger(f)&&f>=0&&f<=MAX_INPUT_FRET));
export const INPUT_TUNING=[...STRINGS].reverse().map(s=>({stringNumber:Number(s.name),midi:s.openAbs}));
export const pitchName=midi=>`${PC_TO_NAME[((midi%12)+12)%12].replaceAll('#','♯').replaceAll('b','♭')}${Math.floor(midi/12)-1}`;
export function intervalVector(pcs){
 const classes=normalizePcs(pcs),vector=[0,0,0,0,0,0];
 for(let a=0;a<classes.length;a++)for(let b=a+1;b<classes.length;b++){const distance=classes[b]-classes[a];vector[Math.min(distance,12-distance)-1]++;}
 return vector;
}
export const POSITION_CATALOG=[
 ...Object.entries(TRICHORD_FORTE_MAP).map(([key,id])=>({id,prime:key.split(',').map(Number)})),
 ...[...TETRACHORD_KEYS,...PENTACHORD_KEYS,...HEXACHORD_KEYS].map(id=>({id,prime:parsePfString(FORTE_REFERENCE[id].pf)}))
];
const lookup=new Map(POSITION_CATALOG.map(item=>[item.prime.join(','),item]));
export function analyzeClasses(pcs){
 if(pcs.some(n=>!Number.isInteger(n)))throw new Error('Le classi devono essere numeri interi.');
 const classes=normalizePcs(pcs),normal=normalOrder(classes),prime=primeForm(classes),vector=intervalVector(classes);
 const matched=lookup.get(prime.join(','));
 const cardinality=classes.length;
 return {classes,normal,direct:rotateToStartAtZero(normal),inverted:rotateToStartAtZero(normalOrder(classes.map(pc=>(12-pc)%12))),prime,vector,cardinality,forte:matched?.id??null,limit:!cardinality?'Inserisci almeno una nota.':cardinality<3||cardinality>6?'Cardinalità fuori dal catalogo attuale (3–6 classi).':!matched?'Nessuna corrispondenza nel catalogo verificato.':null};
}
export function positionNotes(frets){
 if(!isValidInputFrets(frets))throw new Error('Sei corde, tasti 0–24 oppure null.');
 return frets.flatMap((fret,index)=>fret===null?[]:[{stringNumber:6-index,fret,midi:STRINGS[index].openAbs+fret,pc:(STRINGS[index].openAbs+fret)%12}]).sort((a,b)=>a.midi-b.midi||b.stringNumber-a.stringNumber);
}
export function analyzePosition(frets){
 const notes=positionNotes(frets),analysis=analyzeClasses(notes.map(n=>n.pc));
 const duplicates=analysis.classes.flatMap(pc=>{const occurrences=notes.filter(n=>n.pc===pc);return occurrences.length>1?[{pc,occurrences}]:[];});
 return {...analysis,notes,duplicates};
}
export function fretsFromVoicing(voicing){
 if(!Array.isArray(voicing?.positions)||!voicing.positions.length)return null;
 const frets=Array(6).fill(null);
 for(const p of voicing.positions){
  if(!Number.isInteger(p.stringIndex)||p.stringIndex<0||p.stringIndex>5||!Number.isInteger(p.fret)||p.fret<0||p.fret>MAX_EXPLORE_FRET||frets[p.stringIndex]!==null)return null;
  const midi=STRINGS[p.stringIndex].openAbs+p.fret;
  if(p.pc!==undefined&&((p.pc%12)+12)%12!==midi%12)return null;
  if(p.midi!==undefined&&p.midi!==midi)return null;
  frets[p.stringIndex]=p.fret;
 }
 return frets;
}
