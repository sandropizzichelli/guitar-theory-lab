import { pc, orderedNotes, classifyV, SOURCES } from './music.js';
export const VOICE_ROLES=['B','T','A','S'];
export const ROLE_NAMES={B:'Basso',T:'Tenore',A:'Alto',S:'Soprano'};
export const SYSTEMATIC_SOURCE={title:'James Hober · Systematic Inversions',url:'https://www.tedgreene.com/images/lessons/v_system/27_How_Systematic_Inversions_Relate_to_the_V-System.pdf',location:'pp. 1, 5–7'};
// Provenance, theoretical verification and guitar-route verification are independent.
function conversion(id,from,to,deltas,soprano,label,row,condition='Nessuna condizione aggiuntiva esplicita.') {
 return {id,from:`V-${from}`,to:`V-${to}`,deltas,soprano,label,enabled:true,
  provenance:'Documentato',theoryVerification:'Verificato su 495 insiemi × 4 disposizioni',
  guitarVerification:'Percorso originale sulle corde non verificato',condition,
  source:{title:'Ted Greene · Conversion Methods',url:SOURCES.conversions,location:`${to<=9?'p. 1':'p. 2'}, riga ${row}`}};
}
export const CONVERSIONS=[
 conversion('v1-v2-a-down',1,2,[0,0,-12,0],'fixed','Abbassa alto di un’ottava','V-2'),
 conversion('v2-v3-a-down',2,3,[0,0,-12,0],'fixed','Abbassa alto di un’ottava','V-3'),
 conversion('v3-v4-t-up',3,4,[0,12,0,0],'fixed','Alza tenore di un’ottava','V-4.2'),
 conversion('v2-v5-t-down',2,5,[0,-12,0,0],'fixed','Abbassa tenore di un’ottava','V-5.1'),
 conversion('v1-v6-b-down',1,6,[-12,0,0,0],'fixed','Abbassa basso di un’ottava','V-6.1'),
 conversion('v5-v6-t-up',5,6,[0,12,0,0],'fixed','Alza tenore di un’ottava','V-6.3','Gruppo di corde inferiore.'),
 conversion('v2-v7-b-down',2,7,[-12,0,0,0],'fixed','Abbassa basso di un’ottava','V-7.2'),
 conversion('v3-v8-t-down',3,8,[0,-12,0,0],'fixed','Abbassa tenore di un’ottava','V-8.2'),
 conversion('v8-v9-a-down',8,9,[0,0,-12,0],'fixed','Abbassa alto di un’ottava','V-9.2'),
 conversion('v9-v10-a-up',9,10,[0,0,12,0],'fixed','Alza alto di un’ottava','V-10.1'),
 conversion('v2-v10-bt-down',2,10,[-12,-12,0,0],'fixed','Abbassa basso e tenore simultaneamente','V-10.2','Gruppo di corde più alto.'),
 conversion('v5-v10-t-down',5,10,[0,-12,0,0],'fixed','Abbassa tenore di un’ottava','V-10.3','Gruppo di corde alto.'),
 conversion('v5-v11-a-down2',5,11,[0,0,-24,0],'fixed','Abbassa alto di due ottave','V-11.2','Gruppo alto; riconfigurare la diteggiatura.'),
 conversion('v2-v12-a-down2',2,12,[0,0,-24,0],'fixed','Abbassa alto di due ottave','V-12.1','Gruppo più alto.'),
 conversion('v3-v12-b-down',3,12,[-12,0,0,0],'fixed','Abbassa basso di un’ottava','V-12.1','Gruppo più alto.'),
 conversion('v11-v12-t-up',11,12,[0,12,0,0],'fixed','Alza tenore di un’ottava','V-12.3'),
 conversion('v6-v13-t-down',6,13,[0,-12,0,0],'fixed','Abbassa tenore di un’ottava','V-13.1'),
 conversion('v1-v13-bt-down',1,13,[-12,-12,0,0],'fixed','Abbassa basso e tenore simultaneamente','V-13.1'),
 conversion('v5-v14-a-down',5,14,[0,0,-12,0],'fixed','Abbassa alto di un’ottava','V-14.2','Gruppo alto.'),
 conversion('v3-v14-a-down',3,14,[0,0,-12,0],'fixed','Abbassa alto di un’ottava','V-14.2','Gruppo alto.'),
 conversion('v13-v14-a-down',13,14,[0,0,-12,0],'fixed','Abbassa alto di un’ottava','V-14.3'),
 conversion('v1-v14-bta-down',1,14,[-12,-12,-12,0],'fixed','Abbassa le tre voci inferiori simultaneamente','V-14.4','V-1 nel registro alto.'),
 conversion('v2-v4-s-down2',2,4,[0,0,0,-24],'changed','Abbassa soprano di due ottave','V-4.1','Quattro corde alte → cinque inferiori; soprano dalla corda 1 alla 6.'),
 conversion('v2-v5-a-up',2,5,[0,0,12,0],'changed','Alza alto di un’ottava','V-5.2','Secondo o terzo gruppo di corde V-2: mappatura ancora da precisare.'),
 conversion('v4-v6-t-up',4,6,[0,12,0,0],'changed','Alza tenore di un’ottava','V-6.2','Gruppo inferiore.'),
 conversion('v4-v8-a-up',4,8,[0,0,12,0],'changed','Alza alto di un’ottava','V-8.1','Gruppo inferiore.'),
 conversion('v4-v11-s-up',4,11,[0,0,0,12],'changed','Alza soprano di un’ottava','V-11.1','Gruppo più basso; riconfigurare la diteggiatura.'),
 conversion('v5-v12-t-up2',5,12,[0,24,0,0],'changed','Alza tenore di due ottave','V-12.2','Gruppo più basso.'),
 conversion('v3-v13-a-up',3,13,[0,0,12,0],'changed','Alza alto di un’ottava','V-13.2','Gruppo più basso.'),
 conversion('v1-v14-s-up',1,14,[0,0,0,12],'changed','Alza soprano di un’ottava','V-14.1','Gruppo più basso.'),
 {...conversion('v2-v9-s-up',2,9,[0,0,0,12],'changed','Alza soprano di un’ottava','Metodo 1'),
  source:{title:'Metodo 1 · tabella di Greene, spiegazione di Hober',url:SOURCES.method1,location:'p. 2, Master Formula Table, V-9'},condition:'V-2 con soprano un’ottava più alto; nessun percorso specifico sulle corde attivato.'}
];
export const INACTIVE_PROCEDURES=[
 {id:'v2-v9-s-up2',from:'V-2',to:'V-9',deltas:[0,0,0,24],enabled:false,provenance:'Documentato',theoryVerification:'Da chiarire',guitarVerification:'Non verificato',label:'V-2 → V-9 · soprano +24',condition:'Indicazione nel manoscritto e nella trascrizione: non coincide con +12 del Metodo 1. La variante rimane inattiva, senza attribuire un errore all’autore.',source:{title:'Ted Greene · Conversion Methods',url:SOURCES.conversions,location:'p. 1, V-9.1'}},
 {id:'v2-v4-swap',from:'V-2',enabled:false,provenance:'Documentato',theoryVerification:'Scambio da definire',guitarVerification:'Non verificato',label:'V-2 → V-4 · scambio basso/alto',condition:'Registri e spostamenti delle voci non ancora precisamente definiti.',source:{title:'Ted Greene · Conversion Methods',url:SOURCES.conversions,location:'p. 1, V-4.3'}},
 {id:'v6-v7-swap',from:'V-6',enabled:false,provenance:'Documentato',theoryVerification:'Scambio da definire',guitarVerification:'Non verificato',label:'V-6 → V-7 · scambio corde esterne',condition:'Percorso specifico sulle corde ancora da verificare.',source:{title:'Ted Greene · Conversion Methods',url:SOURCES.conversions,location:'p. 1, V-7.1'}}
];
export function originalVoices(positions) {
 const ordered=orderedNotes(positions);
 if(!classifyV(ordered.map(p=>p.midi)).group) throw new Error('Serve una posizione di quattro classi distinte in un gruppo V.');
 return ordered.map((p,i)=>({id:VOICE_ROLES[i],originalRole:VOICE_ROLES[i],sourceMidi:p.midi,sourceString:p.stringNumber??null,sourceFret:p.fret??null,midi:p.midi,resultRole:VOICE_ROLES[i],delta:0}));
}
function candidateFrom(voices,midis,description,source) {
 const transformed=voices.map((v,i)=>({...v,midi:midis[i],delta:midis[i]-v.sourceMidi})).sort((a,b)=>a.midi-b.midi);
 transformed.forEach((v,i)=>{v.resultRole=VOICE_ROLES[i];});
 const pitches=transformed.map(v=>v.midi);
 const classification=classifyV(pitches);
 if(!classification.group)throw new Error('La candidata non appartiene a un gruppo V.');
 const originalSoprano=Math.max(...voices.map(v=>v.sourceMidi));
 return {voices:transformed,pitches,classification,sopranoFixed:pitches[3]===originalSoprano,originalSoprano,soprano:pitches[3],description,source};
}
export function systematicDispositions(positions,direction=1) {
 if(![1,-1].includes(direction))throw new Error('Direzione non valida.');
 const voices=originalVoices(positions);
 const cycle=new Set(voices.map(v=>pc(v.midi)));
 let pitches=voices.map(v=>v.midi);
 return Array.from({length:4},(_,step)=>{
  const candidate=candidateFrom(voices,pitches,`Disposizione ${step+1}`,SYSTEMATIC_SOURCE);
  pitches=pitches.map(p=>{let next=p+direction;while(!cycle.has(pc(next)))next+=direction;return next;});
  return {...candidate,id:`systematic-${direction}-${step}`,kind:'systematic',step,direction};
 });
}
export function applyConversion(positions,procedure) {
 if(!procedure.enabled || !CONVERSIONS.some(p=>p.id===procedure.id))throw new Error('Procedimento inattivo.');
 const voices=originalVoices(positions);
 if(classifyV(voices.map(v=>v.midi)).group!==procedure.from)throw new Error('Gruppo di origine non compatibile.');
 const candidate=candidateFrom(voices,voices.map((v,i)=>v.midi+procedure.deltas[i]),procedure.label,procedure.source);
 if(candidate.classification.group!==procedure.to || candidate.sopranoFixed!==(procedure.soprano==='fixed'))throw new Error('Gruppo o soprano non corrispondono al procedimento.');
 return {...candidate,id:procedure.id,kind:'conversion',procedure};
}
export const GREENE_EXAMPLES=[
 {id:'A',label:'A · Disposizione V-2',frets:[null,3,5,4,5,null],target:'systematic-1-1',expectedFrets:[null,null,2,4,1,3]},
 {id:'B',label:'B · V-2 → V-3',frets:[null,3,5,4,5,null],target:'v2-v3-a-down',expectedFrets:[7,3,5,null,5,null]},
 {id:'C',label:'C · V-2 → V-9',frets:[null,3,5,4,5,null],target:'v2-v9-s-up',expectedFrets:[8,10,9,null,null,12]},
 {id:'D',label:'D · V-3 → V-12',frets:[null,7,5,5,null,7],target:'v3-v12-b-down',expectedFrets:[0,null,5,5,null,7]}
];
