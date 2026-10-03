import {useState} from 'react';
import {BASS_NOTES} from './bass.js';
import {noteName} from './music.js';
import {FAMILIES,analyzeModes,soundRecords} from './modal.js';
const list=notes=>notes.map(n=>`${n.name} (${n.degree})`).join(' · ')||'Nessuna';
function Results({analysis,center,testId}){
 const [view,setView]=useState('complete');
 const rows=analysis[view];
 const originalClasses=[...new Set(analysis.records.filter(n=>n.provenance==='position').map(n=>((n.midi%12)+12)%12))].sort((a,b)=>a-b).join(',');
 return <div data-testid={testId} data-complete={analysis.complete.map(r=>r.id).join(',')}>
  <div className="vl-modal-views" role="group" aria-label="Vista modale"><button aria-pressed={view==='complete'} onClick={()=>setView('complete')}>Compatibili ({analysis.complete.length})</button><button aria-pressed={view==='partial'} onClick={()=>setView('partial')}>Affinità parziali ({analysis.partial.length})</button></div>
  <p className="vl-help">{view==='complete'?'Compatibilità completa: ogni classe sonora appartiene alla scala. Non richiede tutti i sette gradi suonati.':'Queste scale non contengono tutte le note sonore. Le note fuori scala sono indicate con nomi cromatici; non indicano errori nella formula armonica.'}</p>
  {!rows.length&&<p role="status">{view==='complete'?'Nessuna compatibilità completa nelle famiglie selezionate.':'Nessuna affinità parziale nelle famiglie selezionate.'}</p>}
  <div className="vl-modal-results">{rows.map(row=><details key={row.id} data-mode={row.id}>
   <summary><strong>{center} · {row.name}</strong><small>{row.familyLabel} {row.number} · {row.shared}/7 classi presenti</small>{view==='partial'&&<span>Fuori scala: {row.outside.map(n=>noteName(n+60).replace(/\d+$/,'')).join(' · ')}</span>}</summary>
   <div className="vl-modal-detail"><p>Formula: {row.degrees.join(' · ')}<br/>Scala: {row.scale.map(n=>n.name).join(' · ')}<br/>Scala madre: {row.scale[(7-['I','II','III','IV','V','VI','VII'].indexOf(row.number))%7].name} · {row.familyLabel.toLowerCase()}{row.alias&&<><br/>Alias: {row.alias}</>}</p>
    <ul>{row.present.map((n,i)=><li key={i}>{n.spelling?.label??noteName(n.record.midi)} · {n.spelling?.degree??'fuori scala'} · {n.record.provenance==='bass'?'basso aggiunto':n.record.voice?`voce ${n.record.voice}`:`nota ${n.record.noteNumber}`}{n.record.stringNumber&&` · corda ${n.record.stringNumber}, tasto ${n.record.fret}`} · MIDI {n.record.midi}</li>)}</ul>
    {row.id==='HM-IV'&&originalClasses==='0,3,6,10'&&center==='C'&&<p>G♭ e F♯ sono la stessa altezza: ♭5 in una lettura armonica Cø7, ♯4 nel modo. È compatibilità delle note, non conferma della funzione dell’accordo.</p>}
    <p>Caratteristiche presenti: {list(row.characteristicsPresent)}<br/>Caratteristiche assenti: {list(row.characteristicsAbsent)}</p>
    {view==='complete'&&<p>Note discriminanti assenti: {list(row.discriminantsAbsent)}. {analysis.complete.length>1?'Queste note della scala distinguerebbero almeno una delle altre compatibilità; non sono aggiunte alla posizione.':'Il risultato nel catalogo non dimostra un modo unico o una funzione.'}</p>}
    <a href={row.source.url} target="_blank" rel="noreferrer">{row.source.title}</a><p className="vl-help">{row.family==='major'?'Legenda caratteristica dalla fonte didattica.':'Legenda caratteristica: selezione editoriale di Guitar Theory Lab sulle formule documentate.'} Discriminanti: confronto delle classi tra le compatibilità complete.</p>
   </div>
  </details>)}</div>
 </div>;
}
export default function ModalPanel({notes,bass,center,onCenter,families,onFamilies}){
 const analysis=analyzeModes(soundRecords(notes,bass),center,families);
 return <details className="vl-explore vl-modal" data-testid="modal-panel"><summary>Compatibilità modali{center&&` · centro ${center}`}</summary>
  <label className="vl-field"><span>Centro modale</span><select value={center} onChange={e=>onCenter(e.target.value)}><option value="">Scegli un centro</option>{[...BASS_NOTES.map(n=>n[0]),'C♭','B♯'].map(n=><option key={n}>{n}</option>)}</select></label>
  <fieldset className="vl-modal-families"><legend>Famiglie analizzate</legend>{FAMILIES.map(f=><label key={f.id}><input type="checkbox" checked={families.includes(f.id)} onChange={e=>onFamilies(e.target.checked?[...families,f.id]:families.filter(id=>id!==f.id))}/>{f.label}</label>)}</fieldset>
  {!center?<p>Scegli esplicitamente un centro: nessun modo viene selezionato automaticamente.</p>:<><p className="vl-help">{analysis.records.length} altezze reali · {analysis.classes.length} classi sonore · centro {analysis.centerPresent?'presente':'non suonato'}. {bass?'Basso aggiunto incluso.':'Nessun basso aggiunto.'} Centro e fondamentale sono indipendenti.</p><Results analysis={analysis} center={center} testId="modal-results"/></>}
  <details className="vl-procedure-details"><summary>Metodo, nomenclatura e limiti</summary><p>21 formule. Minore melodica nella forma ascendente anche nell’esplorazione discendente, secondo la convenzione jazz. Compatibilità per inclusione delle classi temperate, senza deduzione della funzione armonica o graduatoria di modi. Lo spelling modale è separato da quello armonico; ottave, corde e tasti restano invariati.</p><p>Caratteristiche didattiche ed editoriali non sono prove di un centro. Le discriminanti confrontano le scale compatibili. Non vengono aggiunte note mancanti. Esclusi altre famiglie, analisi del contesto e riproduzione audio.</p><a href="https://openmusictheory.github.io/scales.html" target="_blank" rel="noreferrer">Open Music Theory · scale e gradi</a></details>
 </details>;
}
export function ModalComparison({original,candidate,bass,center,families}){
 const a=analyzeModes(soundRecords(original,bass),center,families);
 const b=analyzeModes(soundRecords(candidate,bass),center,families);
 const identical=a.classes.join(',')===b.classes.join(',');
 const samePitches=a.records.map(n=>n.midi).join(',')===b.records.map(n=>n.midi).join(',');
 return <details className="vl-procedure-details" data-testid="modal-comparison"><summary>Compatibilità modali · originale / candidata</summary>{!center?<p>Scegli il centro nel pannello «Compatibilità modali».</p>:<><p>Centro {center} · {identical?(samePitches?'Compatibilità identiche; stesse altezze.':'Compatibilità identiche; disposizione diversa.'):'Insiemi sonori diversi.'} {bass?'Basso conservato incluso.':'Nessun basso aggiunto.'} Validità fisica verificata separatamente.</p><details><summary>Originale · {a.complete.length} compatibili</summary><Results analysis={a} center={center} testId="modal-original-results"/></details><details><summary>Candidata teorica · {b.complete.length} compatibili</summary><Results analysis={b} center={center} testId="modal-candidate-results"/></details></>}</details>;
}
