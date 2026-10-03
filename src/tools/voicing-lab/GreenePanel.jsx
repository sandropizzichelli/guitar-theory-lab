import { useEffect, useRef, useState } from 'react';
import { positionsFromFrets, orderedNotes, noteName, analyze, findExactPositions, estimateDifficulty, classifyV } from './music.js';
import { CONVERSIONS, INACTIVE_PROCEDURES, ROLE_NAMES, systematicDispositions, applyConversion, SYSTEMATIC_SOURCE } from './greene.js';

const fretLabel=frets=>frets.map(f=>f??'×').join(' · ');
function namesFor(pitches,root) {
 const degrees=analyze(pitches,root).selected.degrees;
 return new Map(pitches.map((pitch,i)=>[pitch,noteName(pitch,root,degrees[i])]));
}
function PositionDiagram({frets,root,label}) {
 const positions=orderedNotes(positionsFromFrets(frets));
 const names=namesFor(positions.map(p=>p.midi),root);
 const pressed=frets.filter(f=>f!==null&&f>0);
 const start=pressed.length?Math.min(...pressed):1;
 const rows=pressed.length?Math.max(4,Math.max(...pressed)-start+1):4;
 const height=80+rows*26;
 return <svg className="vl-comparison-diagram" viewBox={`0 0 270 ${height}`} role="img" aria-label={`${label}: ${fretLabel(frets)}`}>
  {[6,5,4,3,2,1].map((s,i)=><g key={s}><line x1={45+i*40} x2={45+i*40} y1="48" y2={48+rows*26}/><text x={45+i*40} y="14" textAnchor="middle">{s}</text><text x={45+i*40} y="36" textAnchor="middle">{frets[i]===null?'×':frets[i]===0?'○':''}</text></g>)}
  {Array.from({length:rows+1},(_,i)=><line key={i} x1="35" x2="255" y1={48+i*26} y2={48+i*26}/>)}
  {Array.from({length:rows},(_,i)=><text key={i} x="12" y={65+i*26}>{start+i}</text>)}
  {positions.map(p=>{const y=p.fret===0?34:61+(p.fret-start)*26;const x=45+(6-p.stringNumber)*40;return <g key={p.stringNumber}><circle cx={x} cy={y} r="15"/><text className="vl-dot-name" x={x} y={y+4} textAnchor="middle">{names.get(p.midi)}</text></g>;})}
 </svg>;
}
function ProcedureDetails({procedure}) {
 return <details className="vl-procedure-details"><summary>Fonte e condizioni</summary>
  <dl><dt>Provenienza</dt><dd>{procedure.provenance}</dd><dt>Verifica teorica</dt><dd>{procedure.theoryVerification}</dd><dt>Condizioni chitarristiche</dt><dd>{procedure.guitarVerification}</dd></dl>
  <p>{procedure.condition}</p><a href={procedure.source.url} target="_blank" rel="noreferrer">{procedure.source.title} · {procedure.source.location}</a>
 </details>;
}
export default function GreenePanel({frets,root,onApply}) {
 const [tab,setTab]=useState('systematic');
 const [direction,setDirection]=useState(1);
 const [sopranoFilter,setSopranoFilter]=useState('all');
 const [session,setSession]=useState(null);
 const [restore,setRestore]=useState(null);
 const [scope,setScope]=useState('original');
 const [minFret,setMinFret]=useState(0);
 const [maxFret,setMaxFret]=useState(24);
 const [maxSpan,setMaxSpan]=useState(5);
 const ownedChange=useRef(null);
 const originalKey=JSON.stringify(frets);
 useEffect(()=>{
  const owned=ownedChange.current===originalKey;
  ownedChange.current=null;
  if(owned)return;
  setSession(null);setRestore(null);
 },[originalKey]);
 const positions=orderedNotes(positionsFromFrets(frets));
 const group=classifyV(positions.map(p=>p.midi)).group;
 const dispositions=group?systematicDispositions(positions,direction):[];
 const procedures=CONVERSIONS.filter(p=>p.from===group&&(sopranoFilter==='all'||p.soprano===sopranoFilter));
 function choose(candidate) {setSession({originFrets:[...frets],candidate,search:null,realization:null,applied:false});}
 const currentSearchKey=JSON.stringify({scope,minFret,maxFret,maxSpan});
 const stale=session?.search&&session.search.key!==currentSearchKey;
 function searchPositions() {
  if(!session)return;
  const strings=scope==='original'?positionsFromFrets(session.originFrets).map(p=>p.stringNumber):[1,2,3,4,5,6];
  const results=findExactPositions(session.candidate.pitches,{minFret,maxFret,maxSpan,strings});
  setSession({...session,search:{results,key:currentSearchKey,scope},realization:null});
 }
 function apply() {
  if(!session?.realization||stale||session.applied)return;
  const next=[...session.realization.frets];
  setRestore([...frets]);ownedChange.current=JSON.stringify(next);
  setSession({...session,applied:true});onApply(next);
 }
 function restoreOriginal() {
  if(!restore)return;
  const previous=[...restore];ownedChange.current=JSON.stringify(previous);
  setSession(null);setRestore(null);onApply(previous);
 }
 const candidate=session?.candidate;
 const originalPositions=session?orderedNotes(positionsFromFrets(session.originFrets)):[];
 const originalNames=namesFor(originalPositions.map(p=>p.midi),root);
 const candidateNames=namesFor(candidate?.pitches??[],root);
 const inactive=INACTIVE_PROCEDURES.filter(p=>p.from===group||!p.from);
 return <details className="vl-explore" data-testid="greene-panel"><summary>Esplora il gruppo{group&&` · ${group}`}</summary>
  {!group?<p className="vl-help">Servono quattro classi distinte appartenenti a uno dei quattordici gruppi V.</p>:<>
   <div className="vl-greene-tabs" role="tablist" aria-label="Operazioni Greene"><button role="tab" aria-selected={tab==='systematic'} onClick={()=>setTab('systematic')}>Disposizioni sistematiche</button><button role="tab" aria-selected={tab==='conversions'} onClick={()=>setTab('conversions')}>Conversioni</button></div>
   {tab==='systematic'?<section aria-label="Disposizioni sistematiche"><label className="vl-field"><span>Direzione sistematica</span><select value={direction} onChange={e=>setDirection(Number(e.target.value))}><option value="1">Ascendente</option><option value="-1">Discendente</option></select></label>
    <div className="vl-dispositions">{dispositions.map(row=>{const names=namesFor(row.pitches,root);return <button key={row.id} aria-pressed={candidate?.id===row.id} onClick={()=>choose(row)}><strong>{row.description}</strong><span>{row.pitches.map(p=>names.get(p)).join(' · ')}</span><small>{row.classification.group} · {row.sopranoFixed?'soprano conservato':'soprano cambiato'}</small></button>;})}</div>
    <details className="vl-procedure-details"><summary>Regola e fonte delle disposizioni</summary><p>Ogni voce passa alla successiva classe presente, conservando la sua identità e il gruppo V. Nessuna nota omessa viene introdotta. La disposizione 1 è la posizione attuale; dopo quattro passi si ritorna un’ottava sopra o sotto.</p><a href={SYSTEMATIC_SOURCE.url} target="_blank" rel="noreferrer">{SYSTEMATIC_SOURCE.title} · {SYSTEMATIC_SOURCE.location}</a></details>
   </section>:<section aria-label="Conversioni documentate"><label className="vl-field"><span>Filtro soprano</span><select value={sopranoFilter} onChange={e=>setSopranoFilter(e.target.value)}><option value="all">Tutte</option><option value="fixed">Soprano conservato</option><option value="changed">Soprano cambiato</option></select></label>
    <div className="vl-conversions">{procedures.map(procedure=><article key={procedure.id}><button aria-pressed={candidate?.id===procedure.id} data-procedure={procedure.id} onClick={()=>choose(applyConversion(positions,procedure))}><strong>{procedure.from} → {procedure.to}</strong><span>{procedure.label}</span><small>{procedure.soprano==='fixed'?'Soprano conservato':'Soprano cambiato'} · trasformazione teorica</small></button><ProcedureDetails procedure={procedure}/></article>)}</div>
    {procedures.length===0&&<p className="vl-help">Nessuna conversione d’ottava nel filtro selezionato.</p>}
    <details className="vl-inactive"><summary>Procedimenti documentati inattivi</summary>{inactive.map(p=><article key={p.id}><h4>{p.label} · inattivo</h4><ProcedureDetails procedure={p}/></article>)}</details>
   </section>}
  </>}
  {candidate&&<section className="vl-comparison" aria-label="Confronto originale e candidata">
   <div className="vl-section-title"><h3>{candidate.description}</h3><span>{candidate.sopranoFixed?'Soprano conservato':'Soprano cambiato'}</span></div>
   <div className="vl-comparison-columns">
    <article><p className="vl-eyebrow">{session.applied?'ORIGINALE PRECEDENTE':'ORIGINALE'}</p><h4 data-testid="compare-original-frets">{fretLabel(session.originFrets)}</h4><PositionDiagram frets={session.originFrets} root={root} label="Originale"/><p data-testid="compare-original-pitches">{originalPositions.map(p=>originalNames.get(p.midi)).join(' · ')}</p><small>{classifyV(originalPositions.map(p=>p.midi)).group}</small></article>
    <article><p className="vl-eyebrow">CANDIDATA · DISPOSIZIONE TEORICA</p><h4 data-testid="greene-candidate-pitches" data-pitches={candidate.pitches.join(',')}>{candidate.pitches.map(p=>candidateNames.get(p)).join(' · ')}</h4><p>{candidate.classification.group} · gap {candidate.classification.gaps.join(' / ')}</p><p className="vl-help">Basso {candidateNames.get(candidate.pitches[0])} · soprano {candidateNames.get(candidate.soprano)}</p>{session.realization?<><PositionDiagram frets={session.realization.frets} root={root} label="Candidata"/><p data-testid="compare-candidate-frets">{fretLabel(session.realization.frets)}</p><small>Stima {session.realization.difficulty.label.toLowerCase()} · apertura {session.realization.difficulty.span}. Diteggiatura non verificata.</small></>:<p className="vl-theory-only">Nessuna realizzazione selezionata. Le altezze teoriche restano invariate.</p>}</article>
   </div>
   <div className="vl-movements-scroll"><table className="vl-movements"><caption>Identità originali → ruoli risultanti, dopo il riordino</caption><thead><tr><th>Voce originale</th><th>Nota iniziale</th><th>Nota finale</th><th>Semitoni</th><th>Ruolo risultante</th><th>Corde</th></tr></thead><tbody>{['B','T','A','S'].map(id=>{const voice=candidate.voices.find(v=>v.id===id);const resultString=session.realization?.positions.find(p=>p.midi===voice.midi)?.stringNumber;return <tr key={id} data-voice={id}><th>{id} · {ROLE_NAMES[id]}</th><td data-label="Nota iniziale">{originalNames.get(voice.sourceMidi)}</td><td data-label="Nota finale">{candidateNames.get(voice.midi)}</td><td data-label="Semitoni">{voice.delta>0?'+':''}{voice.delta}</td><td data-label="Ruolo risultante">{voice.resultRole} · {ROLE_NAMES[voice.resultRole]}</td><td data-label="Corde">{voice.sourceString??'—'} → {resultString??'—'}</td></tr>;})}</tbody></table></div>
   <details className="vl-procedure-details"><summary>Dettagli del confronto</summary><p>Originale e candidata sono indipendenti. Il soprano viene confrontato per altezza effettiva. Le voci mantengono l’identità iniziale, anche quando cambia il ruolo dopo il riordino.</p><a href={candidate.source.url} target="_blank" rel="noreferrer">{candidate.source.title} · {candidate.source.location}</a>{candidate.procedure&&<><p>Provenienza: {candidate.procedure.provenance}. Teoria: {candidate.procedure.theoryVerification}.</p><p>Condizione della fonte: {candidate.procedure.condition}</p><p>{candidate.procedure.guitarVerification}. Le posizioni cercate sono realizzazioni software, non percorsi sulle corde attribuiti a Greene.</p></>}</details>
   <fieldset className="vl-greene-search"><legend>Ricerca delle altezze esatte</legend><label className="vl-field"><span>Corde della candidata</span><select value={scope} onChange={e=>setScope(e.target.value)}><option value="original">Solo corde originali</option><option value="all">Tutte le corde · ricerca software</option></select></label><div className="vl-pair"><label className="vl-field"><span>Tasto minimo candidata</span><input type="number" min="0" max="24" value={minFret} onChange={e=>setMinFret(Number(e.target.value))}/></label><label className="vl-field"><span>Tasto massimo candidata</span><input type="number" min="0" max="24" value={maxFret} onChange={e=>setMaxFret(Number(e.target.value))}/></label></div><label className="vl-field"><span>Apertura massima candidata</span><input type="number" min="0" max="24" value={maxSpan} onChange={e=>setMaxSpan(Number(e.target.value))}/></label><button disabled={minFret>maxFret||minFret<0||maxFret>24||maxSpan<0||maxSpan>24||![minFret,maxFret,maxSpan].every(Number.isInteger)} onClick={searchPositions}>Cerca posizioni della candidata</button></fieldset>
   {session.search&&<><p role="status">{session.search.results.length} posizioni trovate{stale?' · Filtri cambiati: cerca di nuovo.':''}</p>{session.search.results.length===0?<p className="vl-help">{session.search.scope==='original'?'Nessuna sulle corde originali entro i filtri. Puoi scegliere esplicitamente tutte le corde.':'Nessuna posizione nei filtri. La candidata resta teorica.'}</p>:<div className="vl-results vl-greene-results">{session.search.results.map(result=><button key={result.id} data-realization={result.id} disabled={Boolean(stale)} aria-pressed={session.realization?.id===result.id} onClick={()=>setSession({...session,realization:result})}><strong>{fretLabel(result.frets)}</strong><small>Stima {result.difficulty.label.toLowerCase()} · apertura {result.difficulty.span}</small><span>Seleziona realizzazione</span></button>)}</div>}</>}
   <div className="vl-comparison-actions"><button className="vl-primary" disabled={!session.realization||Boolean(stale)||session.applied} onClick={apply}>Usa questa posizione</button>{restore&&<button onClick={restoreOriginal}>Ripristina originale</button>}</div>
   {session.applied&&<p role="status">Posizione applicata tramite comando esplicito.</p>}
  </section>}
  {!candidate&&restore&&<button onClick={restoreOriginal}>Ripristina originale</button>}
 </details>;
}
