import {useRef} from 'react';
import GuitarFretboard from '../../components/guitar/GuitarFretboard.jsx';
import {INPUT_TUNING,MAX_INPUT_FRET,pitchName,analyzePosition} from './positionAnalysis.js';
export default function ManualPosition({frets,onChange,onOpen,titleRef}){
 const result=analyzePosition(frets),firstSelect=useRef(null);
 function edit(stringNumber,fret){onChange(frets.map((value,i)=>i===6-stringNumber?fret:value));}
 return <section className="sce-manual" aria-label="Posizione manuale" data-testid="set-manual">
  <div className="sce-position-header"><div><p className="sce-eyebrow">POSIZIONE MANUALE</p><h2 ref={titleRef} tabIndex={-1} data-testid="set-input-frets">{frets.map(f=>f??'×').join(' · ')}</h2></div><button className="sce-action" onClick={()=>{onChange(Array(6).fill(null));firstSelect.current?.focus();}}>Svuota posizione</button></div>
  <div className="sce-fret-inputs">{[6,5,4,3,2,1].map((s,i)=><label key={s}><span>Corda {s}</span><select ref={i===0?firstSelect:null} aria-label={`Tasto corda ${s}`} value={frets[i]??'x'} onChange={e=>edit(s,e.target.value==='x'?null:Number(e.target.value))}><option value="x">×</option>{Array.from({length:MAX_INPUT_FRET+1},(_,f)=><option key={f}>{f}</option>)}</select></label>)}</div>
  <GuitarFretboard tuning={INPUT_TUNING} frets={frets} onChange={edit} maxFret={MAX_INPUT_FRET} noteLabel={pitchName}/>
  <p className="sce-help">Scorri la tastiera. Una nota per corda · 0–24 tasti · C4 = MIDI 60.</p>
  <div className="sce-notes" data-testid="set-input-pitches" data-pitches={result.notes.map(n=>n.midi).join(',')} data-strings={result.notes.map(n=>n.stringNumber).join(',')}>{result.notes.map(n=><span key={n.stringNumber}><strong>{pitchName(n.midi)}</strong><small>corda {n.stringNumber} · tasto {n.fret}</small></span>)}</div>
  <p data-testid="set-input-counts"><strong>{result.notes.length} {result.notes.length===1?'nota suonata':'note suonate'}</strong> · {result.cardinality} {result.cardinality===1?'classe distinta':'classi distinte'}{result.duplicates.length>0&&' · raddoppi presenti'}</p>
  {result.notes.length>0&&<div className="sce-result" data-testid="set-input-analysis" data-forte={result.forte??''} data-prime={result.prime.join(',')} data-vector={result.vector.join(',')}>
   <div><span>Set di classi · C = 0</span><strong>{`{${result.classes.join(', ')}}`}</strong></div><div><span>Set class</span><strong>{result.forte??'Fuori catalogo'}</strong></div><div><span>Prime form</span><strong>{`(${result.prime.join(', ')})`}</strong></div><div><span>Vettore · ic1–ic6</span><strong>{`〈${result.vector.join(' ')}〉`}</strong></div>
  </div>}
  {result.limit&&<p role="status">{result.limit} {result.notes.length>0&&'La posizione non viene adattata.'}</p>}
  {frets.some(f=>f>12)&&<p className="sce-help">Posizione oltre il registro di Esplora (0–12): puoi aprire la set class nel catalogo; la posizione fisica resta invariata.</p>}
  <button className="sce-action sce-primary" disabled={!result.forte} onClick={()=>onOpen(result.forte)}>Apri questa set class in Esplora</button>
  <details className="sce-details"><summary>Calcolo, raddoppi e limiti</summary>
   {result.notes.length>0&&<><p>Normal order: [{result.normal.join(', ')}]. Disposizione diretta normalizzata: ({result.direct.join(', ')}); invertita: ({result.inverted.join(', ')}). Prime form della classe Tn/TnI, secondo il catalogo Forte del progetto. Non è l’ordine delle note della posizione e non cambia i tasti.</p><p>Il vettore conta {result.cardinality*(result.cardinality-1)/2} coppie di classi distinte. Raddoppi e ottave non creano nuove coppie.</p><ul>{result.notes.map(n=><li key={n.stringNumber}>{pitchName(n.midi)} · MIDI {n.midi} · classe {n.pc} · corda {n.stringNumber}, tasto {n.fret}</li>)}</ul>{result.duplicates.map(d=><p key={d.pc}>Classe {d.pc} ripetuta: {d.occurrences.map(n=>`${pitchName(n.midi)} sulla corda ${n.stringNumber}`).join(' · ')}.</p>)}</>}
   <p>Catalogo di 129 classi a cardinalità 3–6, verificato sui 2.431 insiemi. Una o due classi restano analizzabili senza numero Forte nel catalogo corrente. Sei corde non consentono sette classi simultanee. Spelling cromatico: C, C♯, D, E♭, E, F, F♯, G, A♭, A, B♭, B. È una convenzione neutra, senza fondamentale armonica. Una set class non certifica una diteggiatura.</p><p>L’input viene salvato su questo browser, senza account; «Svuota posizione» cancella la posizione salvata. Esplora mantiene mappe e ricerca 0–12. Anche oltre il tasto 12, «Apri» seleziona il rappresentante della classe nel catalogo, senza trasferire o modificare la posizione fisica. Esplora e input conservano stati separati.</p><a href="https://openmusictheory.github.io/setClassAndPrimeForm1.html" target="_blank" rel="noreferrer">Open Music Theory · set class e prime form</a><br/><a href="https://openmusictheory.github.io/setClassAndPrimeForm2.html" target="_blank" rel="noreferrer">Open Music Theory · vettori intervallari</a>
  </details>
 </section>;
}
