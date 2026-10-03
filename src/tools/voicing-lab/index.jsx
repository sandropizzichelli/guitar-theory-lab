import { useMemo, useState } from 'react';
import { STANDARD_TUNING, ROOTS, DROP_TYPES, QUALITIES, V_GROUPS, SOURCES, EXAMPLES, positionsFromFrets, orderedNotes, noteName, constructionNoteName, buildCloseDispositions, applyDrop, classifyV, findExactPositions, estimateDifficulty, parseStructure, analyze } from './music.js';
import './styles.css';
import GreenePanel from './GreenePanel.jsx';
import BassPanel from './BassPanel.jsx';
import {validateBass,physicalFrets,soundingPitches,analyzeWithBass} from './bass.js';

function Field({label,children}) { return <label className="vl-field"><span>{label}</span>{children}</label>; }
function Reading({reading,ambiguous=false,onChoose}) {
  return <article className="vl-reading">
    <div className="vl-reading-title"><h3>{reading.symbol??`Struttura su ${ROOTS[reading.root]}`}</h3>{onChoose&&<button type="button" onClick={onChoose}>Leggi su {ROOTS[reading.root]}</button>}</div>
    <p className="vl-degrees">{reading.degrees.join(' · ')||'—'}</p>
    <div className="vl-tags"><span>{reading.complete===null?'Formula non assegnata':reading.complete?'Formula completa':'Formula con omissioni'}</span><span>{reading.contextual?'Dipende dal contesto':ambiguous?'Interpretazione ambigua':'Lettura convenzionale'}</span></div>
    {reading.bassDescription&&<p className="vl-bass-description">{reading.bassDescription}</p>}
    {reading.reason&&<p className="vl-motivation">{reading.reason}</p>}
    {reading.omissions.length>0&&<p className="vl-omissions">Omesse: {reading.omissions.join(' e ')}</p>}
  </article>;
}
function Fretboard({frets,onChange,root,degrees,showDegrees,bass}) {
  const selected=orderedNotes(positionsFromFrets(frets));
  const degreeByString=new Map(selected.map((p,i)=>[p.stringNumber,degrees[i]]));
  return <div className="vl-board-scroll" tabIndex={0} aria-label="Tastiera scorrevole, corde dalla prima alla sesta">
    <div className="vl-board">
      <div className="vl-fret-numbers"><span>Corda</span><span>Muta</span>{Array.from({length:25},(_,f)=><span key={f}>{f}</span>)}</div>
      {STANDARD_TUNING.map(string=> {
        const added=bass?.mode==='guitar'&&bass.stringNumber===string.stringNumber;
        const selectedFret=added?bass.fret:frets[6-string.stringNumber];
        return <div className="vl-string" key={string.stringNumber}>
          <span className="vl-string-label">{string.stringNumber} <small>{noteName(string.midi)}</small></span>
          <button className={`vl-mute ${selectedFret===null?'active':''}`} aria-label={`Corda ${string.stringNumber} muta`} aria-pressed={selectedFret===null} disabled={added} onClick={()=>onChange(string.stringNumber,null)}>×</button>
          {Array.from({length:25},(_,fret)=> {
            const active=selectedFret===fret;
            const degree=degreeByString.get(string.stringNumber);
            const name=noteName(string.midi+fret,root,active?degree:null);
            return <button key={fret} className={`vl-fret ${active?'selected':''} ${added&&active?'vl-bass-dot':''} ${[3,5,7,9,12,15,17,19,21,24].includes(fret)?'vl-marker':''}`} aria-label={`Corda ${string.stringNumber}, tasto ${fret}, ${name}`} aria-pressed={active} disabled={added} onClick={()=>onChange(string.stringNumber,active?null:fret)}><span>{active?(added?`＋${bass.name}${bass.octave}`:showDegrees?degree:name):fret===0?'○':''}</span></button>;
          })}
        </div>;
      })}
    </div>
  </div>;
}
export default function VoicingLab() {
  const [mode,setMode]=useState('analyze');
  const [approach,setApproach]=useState('general');
  const [frets,setFrets]=useState([...EXAMPLES[0].frets]);
  const [root,setRoot]=useState(0);
  const [bass,setBass]=useState(null);
  const [physicalError,setPhysicalError]=useState('');
  const [locked,setLocked]=useState(false);
  const [showDegrees,setShowDegrees]=useState(false);
  const [quality,setQuality]=useState('maj7');
  const [custom,setCustom]=useState('1 3 5 7');
  const [octave,setOctave]=useState(3);
  const [rotation,setRotation]=useState(2);
  const [drop,setDrop]=useState('drop2');
  const [minFret,setMinFret]=useState(0);
  const [maxFret,setMaxFret]=useState(15);
  const [maxSpan,setMaxSpan]=useState(5);
  const [strings,setStrings]=useState([1,2,3,4,5,6]);
  const [search,setSearch]=useState(null);
  const positions=useMemo(()=>orderedNotes(positionsFromFrets(frets)),[frets]);
  const pitches=positions.map(p=>p.midi);
  const baseReading=analyze(pitches,root).selected;
  const readings=analyzeWithBass(pitches,root,bass);
  const sound=soundingPitches(frets,bass);
  const v=classifyV(pitches);
  const difficulty=estimateDifficulty(positions);
  const constructionFormula=quality==='custom'?null:QUALITIES.find(q=>q.id===quality);
  const parsed=constructionFormula?{intervals:constructionFormula.intervals}:parseStructure(custom);
  const constructionName=pitch=>constructionNoteName(pitch,root,constructionFormula);
  const closes=parsed.error?[]:buildCloseDispositions(root,parsed.intervals,octave);
  const theoretical=closes.length?applyDrop(closes[rotation],DROP_TYPES.find(d=>d.id===drop).voices):[];
  const theoryV=classifyV(theoretical);
  const filterKey=JSON.stringify({minFret,maxFret,maxSpan,strings:[...strings].sort()});
  function setPosition(next,nextBass=bass) { const check=validateBass(next,nextBass);if(!check.valid){setPhysicalError(`${check.reason} Rimuovi o modifica esplicitamente il basso.`);return;}setPhysicalError('');setFrets([...next]);setBass(nextBass); }
  function edit(stringNumber,fret) { setPosition(frets.map((f,i)=>i===6-stringNumber?fret:f)); }
  function loadExample(example) { setPosition([...example.frets]);setRoot(example.root);setMode('analyze'); }
  function runSearch() {
    const candidates=findExactPositions(theoretical,{minFret,maxFret,maxSpan,strings});
    setSearch({pitches:[...theoretical],candidates,filterKey,root,formula:constructionFormula});
    if(approach==='general'&&!locked&&!bass&&candidates.length) setFrets([...candidates[0].frets]);
  }
  const searchStale=search&&(search.pitches.join(',')!==theoretical.join(',')||search.filterKey!==filterKey||search.root!==root||search.formula?.id!==constructionFormula?.id);
  return <div className="vl-app">
    <div className="vl-toolbar">
      <div className="vl-tabs" role="tablist" aria-label="Accesso al laboratorio">
        <button role="tab" id="vl-analyze-tab" aria-controls="vl-panel" aria-selected={mode==='analyze'} onClick={()=>setMode('analyze')}>Analizza una posizione</button>
        <button role="tab" id="vl-build-tab" aria-controls="vl-panel" aria-selected={mode==='build'} onClick={()=>setMode('build')}>Costruisci</button>
      </div>
      <Field label="Approccio"><select value={approach} onChange={e=>setApproach(e.target.value)}><option value="general">Generale</option><option value="greene">Ted Greene — V-System</option></select></Field>
    </div>
    <div className="vl-layout" id="vl-panel" role="tabpanel" aria-labelledby={mode==='analyze'?'vl-analyze-tab':'vl-build-tab'}>
      <aside className="vl-controls">
        <Field label="Fondamentale interpretativa"><select value={root} onChange={e=>setRoot(Number(e.target.value))}>{ROOTS.map((name,i)=><option key={i} value={i}>{name}</option>)}</select></Field>
        <p className="vl-help">In analisi cambia solo la lettura. Note, corde e tasti restano invariati.</p>
        {mode==='analyze'?<>
          <h2>La tua posizione</h2>
          <p className="vl-help">Tasti dalla corda 6 alla 1. Seleziona × per una corda muta, oppure tocca la tastiera.</p>
          <div className="vl-fret-inputs">{[6,5,4,3,2,1].map((s,i)=><Field key={s} label={`Corda ${s}`}><select value={frets[i]??'x'} onChange={e=>edit(s,e.target.value==='x'?null:Number(e.target.value))}><option value="x">×</option>{Array.from({length:25},(_,f)=><option key={f} value={f}>{f}</option>)}</select></Field>)}</div>
          <h2>Esempi</h2><div className="vl-examples">{EXAMPLES.map((example,i)=><button key={i} onClick={()=>loadExample(example)}>{example.label}<small>{example.frets.map(f=>f??'×').join(' · ')}</small></button>)}</div>
        </>:<>
          <h2>Disposizione teorica</h2>
          <Field label="Accordo o struttura"><select value={quality} onChange={e=>setQuality(e.target.value)}>{QUALITIES.map(q=><option key={q.id} value={q.id}>{q.label}</option>)}<option value="custom">Struttura intervallare</option></select></Field>
          {quality==='custom'&&<><Field label="Quattro gradi"><input value={custom} onChange={e=>setCustom(e.target.value)} placeholder="1 3 5 7"/></Field><p className="vl-help">Struttura libera: nomi cromatici con bemolli, senza funzione armonica assegnata.</p></>}
          {parsed.error&&<p role="alert" className="vl-error">{parsed.error}</p>}
          <div className="vl-pair"><Field label="Ottava della fondamentale"><select value={octave} onChange={e=>setOctave(Number(e.target.value))}>{[2,3,4,5].map(o=><option key={o}>{o}</option>)}</select></Field><Field label="Close iniziale"><select value={rotation} onChange={e=>setRotation(Number(e.target.value))}>{[0,1,2,3].map(i=><option key={i} value={i}>{i+1}{closes[i]?` · ${closes[i].map(constructionName).join(' ')}`:''}</option>)}</select></Field></div>
          <Field label="Trasformazione"><select value={drop} onChange={e=>setDrop(e.target.value)}>{DROP_TYPES.map(d=><option key={d.id} value={d.id}>{d.label}</option>)}</select></Field>
          <p className="vl-help">Voci contate dall’alto nella close originale. I drop combinati agiscono simultaneamente.</p>
          <h2>Ricerca sulla chitarra</h2>
          <div className="vl-pair"><Field label="Tasto minimo"><select value={minFret} onChange={e=>setMinFret(Number(e.target.value))}>{Array.from({length:25},(_,i)=><option key={i}>{i}</option>)}</select></Field><Field label="Tasto massimo"><select value={maxFret} onChange={e=>setMaxFret(Number(e.target.value))}>{Array.from({length:25},(_,i)=><option key={i}>{i}</option>)}</select></Field></div>
          <Field label="Apertura massima (tasti premuti)"><select value={maxSpan} onChange={e=>setMaxSpan(Number(e.target.value))}>{[0,1,2,3,4,5,6,8,12,24].map(i=><option key={i}>{i}</option>)}</select></Field>
          <fieldset className="vl-string-filters"><legend>Corde incluse</legend>{[6,5,4,3,2,1].map(s=><label key={s}><input type="checkbox" checked={strings.includes(s)} onChange={e=>setStrings(previous=>e.target.checked?[...previous,s]:previous.filter(x=>x!==s))}/>{s}</label>)}</fieldset>
          <button className="vl-primary" disabled={Boolean(parsed.error)||minFret>maxFret||strings.length<4} onClick={runSearch}>Cerca queste altezze</button>
          {minFret>maxFret&&<p role="alert" className="vl-error">Il minimo supera il massimo.</p>}
          {strings.length<4&&<p className="vl-help">Servono almeno quattro corde per questa ricerca.</p>}
        </>}
      </aside>
      <section className="vl-workspace" aria-label="Posizione e analisi">
        <div className="vl-position-head"><div><p className="vl-eyebrow">{bass?'POSIZIONE ORIGINALE · QUATTRO VOCI':'POSIZIONE SULLA CHITARRA'}</p><h2 data-testid="position-frets">{frets.map(f=>f??'×').join(' · ')}</h2></div><button className={locked?'vl-lock active':'vl-lock'} aria-pressed={locked} onClick={()=>setLocked(!locked)}>{locked?'Posizione conservata':'Conserva nelle ricerche'}</button></div>
        <div className="vl-board-options"><label><input type="checkbox" checked={showDegrees} onChange={e=>setShowDegrees(e.target.checked)}/> Mostra gradi</label><span>Una nota per corda · 0–24 tasti</span></div>
        <Fretboard bass={bass} frets={frets} onChange={edit} root={root} degrees={baseReading.degrees} showDegrees={showDegrees}/>
        <p className="vl-help vl-scroll-hint">Scorri la tastiera per raggiungere i tasti più alti.</p>
        <div className="vl-pitch-strip" data-testid="position-pitches" data-pitches={pitches.join(',')} data-strings={positions.map(p=>p.stringNumber).join(',')}>{positions.map((p,i)=><span key={p.stringNumber}><strong>{noteName(p.midi,root,baseReading.degrees[i])}</strong><small>{['Basso','Tenore','Alto','Soprano'][positions.length===4?i:-1]??`Nota ${i+1}`} · corda {p.stringNumber}</small></span>)}</div>
        {positions.length>0?<div className="vl-position-meta"><span>{bass?'Basso della posizione':'Basso reale'} <strong>{noteName(pitches[0],root,baseReading.degrees[0])}</strong></span><span>Difficoltà stimata <strong>{difficulty.label.toLowerCase()}</strong></span><span className="vl-vbadge" data-testid="v-group">{v.group??'V non assegnato'}{v.gaps&&` · ${v.gaps.join(' / ')}`}</span></div>:<p>Seleziona almeno una nota sulla tastiera.</p>}
        <p className="vl-help">{difficulty.explanation}</p>
        {physicalError&&<p role="alert">{physicalError}</p>}
        {bass&&<div className="vl-bass-sound" data-testid="bass-sound" data-pitches={sound.join(',')} data-bass={JSON.stringify(bass)}><strong>＋ Basso aggiunto {bass.name}{bass.octave}</strong><p>{bass.mode==='separate'?'Accompagnamento separato':`Corda ${bass.stringNumber} · tasto ${bass.fret}`}</p><p>Posizione: {v.group??'V non assegnato'} · quattro voci originali. Insieme sonoro: {sound.length} note, {new Set(sound.map(p=>((p%12)+12)%12)).size} classi · basso reale {bass.name}{bass.octave}. Nessun gruppo V assegnato all’insieme completo.</p>{bass.mode==='guitar'&&<p>Insieme sulla chitarra: {physicalFrets(frets,bass).map(f=>f??'×').join(' · ')} · stima {estimateDifficulty(positionsFromFrets(physicalFrets(frets,bass))).label.toLowerCase()}; diteggiatura non verificata.</p>}</div>}
        {v.reason&&<p className="vl-help">{v.reason}</p>}
        {approach==='greene'&&<div className="vl-greene"><h3>Ted Greene — spaziatura delle voci</h3><p>{v.group?`${v.group}: i gap ${v.gaps.join(' / ')} contano le occorrenze delle quattro classi presenti fra basso–tenore, tenore–alto e alto–soprano.`:v.reason} La fondamentale interpretativa non entra nel calcolo.</p><p className="vl-help">Classificazione tramite il Metodo 2 di James Hober. Le disposizioni e le conversioni d’ottava sono disponibili in «Esplora il gruppo». I percorsi originali sulle corde restano da verificare.</p><details><summary>I quattordici gruppi</summary><div className="vl-vtable">{V_GROUPS.map(g=><span key={g.id}><strong>{g.id}</strong> {g.gaps.join(' / ')}</span>)}</div></details></div>}
        {mode==='build'&&<section className="vl-theory" aria-label="Costruzione teorica"><p className="vl-eyebrow">DISPOSIZIONE TEORICA · {DROP_TYPES.find(d=>d.id===drop).label.toUpperCase()}</p><h3 data-testid="theory-pitches">{theoretical.map(constructionName).join(' — ')||'Struttura da correggere'}</h3><p>{theoryV.group??'—'} · {theoryV.gaps?.join(' / ')}. Queste altezze vengono cercate senza trasposizioni o adattamenti.</p>{search&&<><div role="status"><strong>{search.candidates.length} posizioni trovate</strong>{locked?' · La posizione conservata non è stata sostituita.':''}{searchStale?' · Risultati di una costruzione precedente: cerca di nuovo.':''}</div><p className="vl-help">Risultati per {search.pitches.map(p=>constructionNoteName(p,search.root,search.formula)).join(' — ')}. Sono assegnazioni a corde e tasti; la diteggiatura non è verificata.</p>{search.candidates.length===0?<p>Nessuna posizione nei filtri. Prova un altro registro, altre corde o un intervallo di tasti più ampio.</p>:<div className="vl-results">{search.candidates.map((candidate,i)=><button key={candidate.id} onClick={()=>setPosition([...candidate.frets])} aria-label={`Usa posizione ${candidate.id}`}><strong>{candidate.frets.map(f=>f??'×').join(' · ')}</strong><small className="vl-result-notes">{candidate.positions.map(p=>constructionNoteName(p.midi,search.root,search.formula)).join(' · ')}</small><small>Stima {candidate.difficulty.label.toLowerCase()} · apertura {candidate.difficulty.span}</small><span>Usa posizione {i+1}</span></button>)}</div>}</>}</section>}
        <BassPanel frets={frets} bass={bass} onApply={value=>setPosition(frets,value)} onRemove={()=>setPosition(frets,null)}/>
        <section className="vl-analysis" aria-label="Interpretazioni armoniche"><div className="vl-section-title"><h2>Lettura su {ROOTS[root]}</h2><span>Gradi dal grave all’acuto</span></div><Reading reading={readings.selected} ambiguous={readings.ambiguous}/>{readings.alternatives.length>0&&<><h3 className="vl-alternatives-title">Altre letture delle stesse note</h3><div className="vl-alternatives">{readings.alternatives.map(reading=><Reading key={reading.root} reading={reading} ambiguous onChoose={()=>setRoot(reading.root)}/>)}</div></>}</section>
        {approach==='greene'&&<GreenePanel frets={frets} root={root} bass={bass} onApply={setPosition}/>}
      </section>
    </div>
    <details className="vl-sources"><summary>Fonti e metodo</summary><p>V-System di Ted Greene. Metodo 2 e spiegazioni di James Hober, su tedgreene.com. Quattro voci senza raddoppi; le note omesse non vengono contate nei gap. Le altezze effettive definiscono basso, tenore, alto e soprano, indipendentemente dalle corde.</p><nav aria-label="Fonti musicali"><a href={SOURCES.index} target="_blank" rel="noreferrer">Archivio V-System</a><a href={SOURCES.method1} target="_blank" rel="noreferrer">Metodo 1 · tabella di Greene</a><a href={SOURCES.method2} target="_blank" rel="noreferrer">Metodo 2 · James Hober</a><a href={SOURCES.conversions} target="_blank" rel="noreferrer">Conversioni · note originali</a></nav><p>Ricerca delle altezze esatte, stima geometrica e selezione delle sigle sono estensioni di Guitar Theory Lab. Il numero di un gruppo V non identifica il numero di un drop. Una formula completa può avere più interpretazioni.</p><p>Versione locale: disposizioni sistematiche e conversioni d’ottava verificate sono disponibili. Scambi di voci e percorsi sulle corde non definiti restano inattivi; basso esterno disponibile come estensione software; compatibilità modali, monetizzazione e assistente AI restano successivi. L’inversione intervallare è distinta dal rivolto armonico e non è implementata qui.</p></details>
  </div>;
}
