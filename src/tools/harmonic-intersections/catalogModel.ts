import {SCALES} from '../../legacy-tools/harmonic-intersections/data/scales';
import {generateScale} from '../../legacy-tools/harmonic-intersections/music/scaleGenerator';
import {generateArpeggios,ARPEGGIO_TYPE_OPTIONS} from '../../legacy-tools/harmonic-intersections/music/arpeggioGenerator';
import {generatePentatonics,PENTATONIC_TYPE_OPTIONS} from '../../legacy-tools/harmonic-intersections/music/pentatonicGenerator';
import {buildDegreeLabelsFromPitchClasses,buildDegreeLabelsFromScaleDegree} from '../../legacy-tools/harmonic-intersections/music/degreeLabels';
import {catalogDefault,distinct} from './positionModel.js';
// Catalog roles supply spelling; this never changes pitch classes or physical notes.
const letters=['C','D','E','F','G','A','B'],natural=[0,2,4,5,7,9,11];
function spell(rootName:string,pcs:number[],steps:number[]){
 const start=letters.indexOf(rootName[0]);
 return pcs.map((pc,i)=>{const degree=(start+steps[i])%7,diff=(pc-natural[degree]+12)%12,delta=diff>6?diff-12:diff;return letters[degree]+(delta<0?'♭'.repeat(-delta):'♯'.repeat(delta));});
}
export function catalogData(c:any,id:'A'|'B'){
 const scale=generateScale(c.root,c.scaleId,'flats');
 scale.noteNames=spell(scale.noteNames[0],scale.notes,[0,1,2,3,4,5,6]);
 const arpeggios=generateArpeggios(scale,'flats',id,c.arpeggioType),pentatonics=generatePentatonics(scale,'flats',id,c.pentatonicType);
 for(const arp of arpeggios){const old=arp.noteNames[0],rootName=scale.noteNames[arp.degree];arp.noteNames=arp.notes.map(pc=>scale.noteNames[scale.notes.indexOf(pc)]);arp.chordName=rootName+arp.chordName.slice(old.length);}
 for(const pent of pentatonics){const old=pent.noteNames[0],rootName=scale.noteNames[pent.degree];pent.noteNames=spell(rootName,pent.notes,c.pentatonicType==='major'?[0,1,2,4,5]:[0,2,3,4,6]);pent.name=rootName+pent.name.slice(old.length);}
 const arp=arpeggios[c.selectedArpeggio],pent=pentatonics[c.selectedPentatonic];
 const material=c.materialMode==='arpeggios'?{...arp,label:arp.roman+' '+arp.chordName}:c.materialMode==='pentatonics'?{...pent,label:pent.roman+' '+pent.name}:{...scale,label:scale.noteNames[0]+' '+scale.label};
 const degrees=c.materialMode==='pentatonics'?buildDegreeLabelsFromPitchClasses(pent.notes,pent.degreeLabels):buildDegreeLabelsFromScaleDegree(scale.notes,c.materialMode==='arpeggios'?arp.degree:0);
 return {scale,arpeggios,pentatonics,material,degrees};
}
let index:any[]|null=null;
export function exactCatalogMatches(classes:number[]){
 if(!classes.length)return [];
 if(!index){index=[];
  for(let root=0;root<12;root++)for(const def of SCALES){
   const scale=generateScale(root,def.id,'flats'),base={...catalogDefault(),root,scaleId:def.id},origin=scale.noteNames[0]+' '+scale.label;
   const add=(config:any,notes:number[],label:string)=>index!.push({id:index!.length.toString(),config,notes,signature:distinct(notes).join(','),label:origin+' · '+label});
   add(base,scale.notes,'Full scale');
   for(const {id:type,label} of ARPEGGIO_TYPE_OPTIONS)catalogData({...base,arpeggioType:type},'A').arpeggios.forEach((a,i)=>add({...base,materialMode:'arpeggios',arpeggioType:type,selectedArpeggio:i},a.notes,label+' · '+a.roman+' '+a.chordName));
   for(const {id:type} of PENTATONIC_TYPE_OPTIONS)catalogData({...base,pentatonicType:type},'A').pentatonics.forEach((p,i)=>add({...base,materialMode:'pentatonics',pentatonicType:type,selectedPentatonic:i},p.notes,p.roman+' '+p.name));
  }
 }
 return index.filter(m=>m.signature===distinct(classes).join(','));
}
