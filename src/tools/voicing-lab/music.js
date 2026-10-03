// Absolute pitches follow the already verified Goodrick tuning. No legacy module is changed.
import { STANDARD_TUNING, normalizePitchClass } from '../../legacy-tools/goodrick-voice-leading-visualizer/music.js';
export { STANDARD_TUNING };
export const pc = normalizePitchClass;
export const ROOTS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
export const DEGREE_LABELS = ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'];
const DEGREE_VALUES = { '1':0, 'b2':1, 'b9':1, '2':2, '9':2, '#9':3, 'b3':3, '3':4, '4':5, '11':5, '#4':6, '#11':6, 'b5':6, '5':7, '#5':8, 'b6':8, 'b13':8, '6':9, '13':9, 'b7':10, '7':11 };
const LETTERS = ['C','D','E','F','G','A','B'];
const NATURAL_PCS = [0,2,4,5,7,9,11];
const DEGREE_NUMBER = { '1':1, '♭2':2, '2':2, '♭3':3, '3':3, '4':4, '♭5':5, '5':5, '♭6':6, '6':6, '♭7':7, '7':7, '♭9':9, '9':9, '♯9':9, '11':11, '♯11':11, '♭13':13, '13':13, '♯5':5, '♭♭7':7 };
export const DROP_TYPES = [
  { id:'close', label:'Close', voices:[] },
  ...[[2],[3],[4],[2,3],[2,4],[3,4],[2,3,4]].map(voices => ({ id:`drop${voices.join('')}`, label:`Drop ${voices.join('+')}`, voices }))
];
export const V_GROUPS = [
  [0,0,0],[1,0,1],[0,1,2],[2,1,0],[1,2,1],[4,0,0],[5,0,1],
  [2,2,2],[1,0,5],[1,4,1],[2,1,4],[4,1,2],[0,4,0],[0,0,4]
].map((gaps,i)=>({ id:`V-${i+1}`, gaps }));
export const SOURCES = {
  index:'https://tedgreene.com/teaching/v_system.asp',
  method1:'https://tedgreene.com/images/lessons/v_system/03_Method1_HowToRecognize.pdf',
  method2:'https://tedgreene.com/images/lessons/v_system/10_Method_2-The_Chord_Tone_Gap_Method.pdf',
  conversions:'https://tedgreene.com/images/lessons/v_system/V-System_Conversion_Methods_1989-02-04and2003-06-19.pdf'
};
export const QUALITIES = [
  { id:'maj7', label:'maj7', intervals:[0,4,7,11], labels:['1','3','5','7'] },
  { id:'7', label:'7', intervals:[0,4,7,10], labels:['1','3','5','♭7'] },
  { id:'m7', label:'m7', intervals:[0,3,7,10], labels:['1','♭3','5','♭7'] },
  { id:'m7b5', label:'ø7', intervals:[0,3,6,10], labels:['1','♭3','♭5','♭7'] },
  { id:'dim7', label:'dim7', intervals:[0,3,6,9], labels:['1','♭3','♭5','♭♭7'] },
  { id:'mMaj7', label:'m(maj7)', intervals:[0,3,7,11], labels:['1','♭3','5','7'] },
  { id:'6', label:'6', intervals:[0,4,7,9], labels:['1','3','5','6'] },
  { id:'m6', label:'m6', intervals:[0,3,7,9], labels:['1','♭3','5','6'] }
];
const FORMULAS = [
  ...QUALITIES.map(q=>({...q, allowedOmissions:[0,7]})),
  { id:'major', label:'', intervals:[0,4,7], labels:['1','3','5'], allowedOmissions:[] },
  { id:'minor', label:'m', intervals:[0,3,7], labels:['1','♭3','5'], allowedOmissions:[] },
  { id:'sus2', label:'sus2', intervals:[0,2,7], labels:['1','2','5'], allowedOmissions:[] },
  { id:'sus4', label:'sus4', intervals:[0,5,7], labels:['1','4','5'], allowedOmissions:[] },
  { id:'add9', label:'add9', intervals:[0,2,4,7], labels:['1','9','3','5'], allowedOmissions:[] },
  { id:'9', label:'9', intervals:[0,2,4,7,10], labels:['1','9','3','5','♭7'], allowedOmissions:[0,7] },
  { id:'m9', label:'m9', intervals:[0,2,3,7,10], labels:['1','9','♭3','5','♭7'], allowedOmissions:[0,7] },
  { id:'maj9', label:'maj9', intervals:[0,2,4,7,11], labels:['1','9','3','5','7'], allowedOmissions:[0,7] },
  { id:'7b9b13', label:'7(♭9,♭13)', intervals:[0,1,4,7,8,10], labels:['1','♭9','3','5','♭13','♭7'], allowedOmissions:[0,7] }
];
export function parseStructure(value) {
  const parts = value.trim().replaceAll('♭','b').replaceAll('♯','#').split(/[\s,;–]+/).filter(Boolean);
  const intervals = parts.map(token => DEGREE_VALUES[token]);
  if(parts.length !== 4 || intervals.some(x=>x===undefined) || new Set(intervals).size !== 4) {
    return { error:'Inserisci quattro gradi distinti, per esempio 1 3 5 7 oppure 1 2 #4 6.' };
  }
  return { intervals:intervals.sort((a,b)=>a-b) };
}
export function positionsFromFrets(frets) {
  if(frets.length !== 6 || frets.some(f=>f!==null && (!Number.isInteger(f)||f<0||f>24))) throw new Error('Sono richiesti sei tasti, da 0 a 24 oppure null.');
  return frets.flatMap((fret,index)=> {
    if(fret===null) return [];
    const stringNumber=6-index;
    const tuning=STANDARD_TUNING.find(s=>s.stringNumber===stringNumber);
    return [{ stringNumber, fret, midi:tuning.midi+fret, pitchClass:pc(tuning.midi+fret) }];
  });
}
export function orderedNotes(positions) { return [...positions].sort((a,b)=>a.midi-b.midi || b.stringNumber-a.stringNumber); }
export function noteName(midi,root=null,degree=null) {
  if(root===null || !degree || !DEGREE_NUMBER[degree]) return `${ROOTS[pc(midi)]}${Math.floor(midi/12)-1}`;
  const rootLetter=LETTERS.indexOf(ROOTS[root][0]);
  const letterIndex=(rootLetter+DEGREE_NUMBER[degree]-1)%7;
  const natural=NATURAL_PCS[letterIndex];
  let difference=pc(midi)-natural;
  if(difference>6) difference-=12;
  if(difference< -6) difference+=12;
  const accidental=difference>0?'♯'.repeat(difference):'♭'.repeat(-difference);
  const octave=Math.floor((midi-difference)/12)-1;
  return `${LETTERS[letterIndex]}${accidental}${octave}`;
}
// Display only: formulas supply diatonic spelling; free structures use the
// explicit chromatic flat-name convention, without inferring a chord formula.
export function constructionNoteName(midi,root,formula=null) {
  const index=formula?.intervals.indexOf(pc(midi-root))??-1;
  return index<0?noteName(midi):noteName(midi,root,formula.labels[index]);
}
export function buildCloseDispositions(root,intervals,octave=3) {
  if(intervals.length!==4 || new Set(intervals.map(pc)).size!==4) throw new Error('Quattro classi di altezza distinte richieste.');
  const ascending=[...intervals].map(pc).sort((a,b)=>a-b).map(i=>12*(octave+1)+root+i);
  return ascending.map((_,rotation)=>[...ascending.slice(rotation),...ascending.slice(0,rotation).map(p=>p+12)]);
}
export function applyDrop(pitches,voiceNumbers) {
  if(pitches.length!==4 || pitches.some((p,i)=>i && p<=pitches[i-1]) || pitches[3]-pitches[0]>=12) throw new Error('Il drop richiede quattro voci strette ordinate.');
  if(voiceNumbers.some(v=>![2,3,4].includes(v)) || new Set(voiceNumbers).size!==voiceNumbers.length) throw new Error('Voci drop non valide.');
  return pitches.map((midi,i)=>voiceNumbers.includes(4-i)?midi-12:midi).sort((a,b)=>a-b);
}
export function classifyV(pitches) {
  if(pitches.length!==4 || new Set(pitches.map(pc)).size!==4) return { group:null, gaps:null, reason:'V-System: servono quattro note con classi di altezza distinte, senza raddoppi.' };
  const sorted=[...pitches].sort((a,b)=>a-b);
  const classes=new Set(sorted.map(pc));
  const gaps=sorted.slice(1).map((upper,i)=> {
    let count=0;
    for(let pitch=sorted[i]+1;pitch<upper;pitch++) if(classes.has(pc(pitch))) count++;
    return count;
  });
  const group=V_GROUPS.find(v=>v.gaps.every((g,i)=>g===gaps[i]));
  return { group:group?.id??null, gaps, reason:group?null:'Spaziatura fuori dai quattordici gruppi documentati.' };
}
export function estimateDifficulty(positions) {
  const fretted=positions.filter(p=>p.fret>0);
  const span=fretted.length?Math.max(...fretted.map(p=>p.fret))-Math.min(...fretted.map(p=>p.fret)):0;
  const strings=positions.map(p=>p.stringNumber);
  const skipped=strings.length?Math.max(...strings)-Math.min(...strings)+1-strings.length:0;
  const label=span>4 || fretted.length>4?'Impegnativa':span>2 || skipped>0?'Intermedia':'Contenuta';
  return { span, skipped, label, explanation:`Apertura ${span} tasti · ${skipped} corde interne mute. Stima geometrica; dita, barrè e mobilità della mano non verificati.` };
}
export function findExactPositions(pitches,{minFret=0,maxFret=15,maxSpan=5,strings=[1,2,3,4,5,6]}={}) {
  if(pitches.length!==4 || new Set(pitches).size!==4) return [];
  const choices=pitches.map(midi=>STANDARD_TUNING.filter(s=>strings.includes(s.stringNumber)).map(s=>({stringNumber:s.stringNumber,fret:midi-s.midi,midi,pitchClass:pc(midi)})).filter(p=>p.fret>=minFret && p.fret<=maxFret));
  const results=[];
  function visit(index,positions) {
    if(index===choices.length) {
      const difficulty=estimateDifficulty(positions);
      if(difficulty.span>maxSpan) return;
      const frets=Array(6).fill(null);
      positions.forEach(p=>{frets[6-p.stringNumber]=p.fret;});
      results.push({ positions,frets,difficulty,id:frets.map(f=>f??'x').join('-') });
      return;
    }
    for(const position of choices[index]) if(!positions.some(p=>p.stringNumber===position.stringNumber)) visit(index+1,[...positions,position]);
  }
  visit(0,[]);
  return results.sort((a,b)=>a.difficulty.span-b.difficulty.span || a.difficulty.skipped-b.difficulty.skipped || a.id.localeCompare(b.id));
}
export function interpret(pitches,root) {
  if(!pitches.length) return { root, symbol:null, degrees:[], omissions:[], complete:false, contextual:true, reason:'Inserisci almeno una nota.' };
  const sorted=[...pitches].sort((a,b)=>a-b);
  const intervals=[...new Set(sorted.map(p=>pc(p-root)))].sort((a,b)=>a-b);
  const candidates=FORMULAS.flatMap(formula=> {
    if(intervals.some(i=>!formula.intervals.includes(i))) return [];
    const missing=formula.intervals.filter(i=>!intervals.includes(i));
    if(missing.some(i=>!formula.allowedOmissions.includes(i)) || missing.length>2 || intervals.length<3) return [];
    const score=missing.length*10 + (!intervals.includes(0)?5:0) + formula.intervals.length*0.1;
    return [{ formula, missing, score }];
  }).sort((a,b)=>a.score-b.score);
  const best=candidates[0];
  if(!best) return { root,symbol:null,degrees:sorted.map(p=>DEGREE_LABELS[pc(p-root)]),omissions:[],complete:null,contextual:true,reason:'Nessuna sigla convenzionale utile nel dizionario iniziale. La struttura non implica una funzione armonica.' };
  const {formula,missing}=best;
  const labelFor=i=>formula.labels[formula.intervals.indexOf(i)];
  const degrees=sorted.map(p=>labelFor(pc(p-root)));
  const bass=sorted[0];
  const slash=pc(bass)!==root?`/${noteName(bass,root,degrees[0]).replace(/-?\d+$/,'')}`:'';
  const omissions=missing.map(i=>i===0?'fondamentale':i===7?'quinta':labelFor(i));
  const reason=missing.includes(0)
    ? formula.intervals.includes(4)&&formula.intervals.includes(10)
      ? 'Il tritono fra terza e settima sostiene una possibile lettura dominante.'
      : formula.intervals.includes(3)&&formula.intervals.includes(10)
        ? 'Terza minore e settima minore sostengono questa lettura.'
        : formula.intervals.includes(4)&&formula.intervals.includes(11)
          ? 'Terza e settima maggiore sostengono questa lettura.'
          : ''
    : '';
  return { root,symbol:`${ROOTS[root]}${formula.label}${slash}`,degrees,omissions,complete:missing.length===0,contextual:missing.includes(0),score:best.score,formulaId:formula.id,reason };
}
export function analyze(pitches,root) {
  const selected=interpret(pitches,root);
  const alternatives=Array.from({length:12},(_,r)=>r).filter(r=>r!==root).map(r=>interpret(pitches,r)).filter(r=>r.symbol).sort((a,b)=>a.score-b.score||a.root-b.root).slice(0,2);
  return {selected,alternatives,ambiguous:Boolean(selected.symbol&&alternatives.length)};
}
export const EXAMPLES = [
  { label:'Cmaj7 / Am9',root:0,frets:[null,3,5,4,5,null] },
  { label:'Am7 / C6',root:9,frets:[null,0,2,0,1,null] },
  { label:'Cø7 / A♭9',root:0,frets:[null,3,4,3,4,null] }
];
