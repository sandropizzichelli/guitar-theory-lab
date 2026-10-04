import {useEffect,useMemo,useRef,useState} from 'react';
import GuitarFretboard from '../../components/guitar/GuitarFretboard';
import {DisplayModeSelector} from '../../legacy-tools/harmonic-intersections/components/DisplayModeSelector';
import {Fretboard,type PitchClassVisualState} from '../../legacy-tools/harmonic-intersections/components/Fretboard';
import {FretboardLegend} from '../../legacy-tools/harmonic-intersections/components/FretboardLegend';
import {FretRangeSelector} from '../../legacy-tools/harmonic-intersections/components/FretRangeSelector';
import {IntervalSelector} from '../../legacy-tools/harmonic-intersections/components/IntervalSelector';
import {PresetResetPanel} from '../../legacy-tools/harmonic-intersections/components/PresetResetPanel';
import {StringSelector} from '../../legacy-tools/harmonic-intersections/components/StringSelector';
import {SystemSelector} from '../../legacy-tools/harmonic-intersections/components/SystemSelector';
import {NoteChips} from '../../legacy-tools/harmonic-intersections/components/NoteChips';
import {VisualizationSelector} from '../../legacy-tools/harmonic-intersections/components/VisualizationSelector';
import {compareMaterials} from '../../legacy-tools/harmonic-intersections/music/intersectionAnalyzer';
import {normalizePitchClass} from '../../legacy-tools/harmonic-intersections/music/pitchClass';
import {combinedDegreeLabel,labelsForPitchClasses} from '../../legacy-tools/harmonic-intersections/music/degreeLabels';
import {SCALES} from '../../legacy-tools/harmonic-intersections/data/scales';
import {catalogData,exactCatalogMatches} from './catalogModel';
import {TUNING,CHROMATIC_NAMES,noteName,physicalNotes,physicalComparison,distinct,exactClasses,catalogDefault,readState,writeSystem,writeView} from './positionModel';
import './interactive.css';
const scaleIds=SCALES.map(s=>s.id);
function storage(){try{return window.localStorage;}catch{return {getItem(){throw new Error('Storage unavailable');},setItem(){throw new Error('Storage unavailable');}};}}
const fretText=(frets:any[])=>frets.map(f=>f===null?'×':f).join(' · ');
const occurrences=(notes:any[])=>notes.map(n=>'corda '+n.stringNumber+', tasto '+n.fret).join('; ');
type Id='A'|'B';
export default function InteractiveExplorer(){
 const [initial]=useState(()=>readState(storage(),scaleIds));
 const [systems,setSystems]=useState({A:initial.A,B:initial.B}),[view,setView]=useState(initial.view);
 const [storageStatus,setStorageStatus]=useState({A:initial.available,B:initial.available,view:initial.available}),[status,setStatus]=useState('');
 const available=Object.values(storageStatus).every(Boolean);
 const [mapOpen,setMapOpen]=useState(initial.A.mode==='catalog'&&initial.B.mode==='catalog');
 const [lookup,setLookup]=useState<Id|null>(null),[matchChoice,setMatchChoice]=useState('');
 const boardRefs=useRef<Record<string,HTMLDivElement|null>>({});
 useEffect(()=>{const ok=writeSystem(storage(),'A',systems.A);setStorageStatus(s=>({...s,A:ok}));},[systems.A]);
 useEffect(()=>{const ok=writeSystem(storage(),'B',systems.B);setStorageStatus(s=>({...s,B:ok}));},[systems.B]);
 useEffect(()=>{const ok=writeView(storage(),view);setStorageStatus(s=>({...s,view:ok}));},[view]);
 const catalogs=useMemo(()=>({A:catalogData(systems.A.catalog,'A'),B:catalogData(systems.B.catalog,'B')}),[systems.A.catalog,systems.B.catalog]);
 const physical=useMemo(()=>({A:physicalNotes(systems.A.manual),B:physicalNotes(systems.B.manual)}),[systems.A.manual,systems.B.manual]);
 const material=(id:Id)=>systems[id].mode==='catalog'?catalogs[id].material:{label:'Posizione '+id,notes:distinct(physical[id].map(n=>n.pc)),root:null};
 const a=material('A'),b=material('B'),comparison=compareMaterials(a.notes,b.notes),common=new Set(comparison.common);
 const manualIds=(['A','B'] as Id[]).filter(id=>systems[id].mode==='manual'),bothManual=manualIds.length===2;
 const editing=manualIds.includes(view.editing)?view.editing:manualIds[0];
 const pitches=physicalComparison(physical.A,physical.B);
 const matches=useMemo(()=>lookup?exactCatalogMatches(distinct(physical[lookup].map(n=>n.pc))):[],[lookup,physical]);
 const mutate=(id:Id,patch:any)=>setSystems(current=>({...current,[id]:{...current[id],...patch}}));
 const activate=(id:Id)=>{setView(v=>({...v,editing:id}));setStatus('Stai modificando '+id+'. L’altro sistema resta invariato.');};
 const mode=(id:Id,value:string)=>{
  mutate(id,{mode:value});setLookup(null);setMatchChoice('');
  if(value==='manual'){activate(id);setMapOpen(false);}
  else if(view.editing===id){const other=id==='A'?'B':'A';if(systems[other].mode==='manual')activate(other);}
 };
 const changeFret=(id:Id,s:number,fret:number|null)=>{const next=[...systems[id].manual];next[6-s]=fret;mutate(id,{manual:next});setLookup(null);setMatchChoice('');setStatus('Posizione '+id+' aggiornata.');};
 const changeCatalog=(id:Id,key:string,value:any)=>{
  const config={...systems[id].catalog,[key]:value};
  if(['root','scaleId','arpeggioType'].includes(key))config.selectedArpeggio=0;
  if(['root','scaleId','pentatonicType'].includes(key))config.selectedPentatonic=0;
  mutate(id,{catalog:config});
 };
 const label=(pc:number,id?:Id)=>{
  if(id&&systems[id].mode==='catalog'){const index=catalogs[id].material.notes.indexOf(pc);if(index>=0)return catalogs[id].material.noteNames[index];}
  return CHROMATIC_NAMES[pc];
 };
 const resultNames=(pcs:number[],kind:'common'|'A'|'B')=>pcs.map(pc=>{
  if(view.displayMode==='degrees'&&!manualIds.length)return kind==='common'?combinedDegreeLabel(pc,catalogs.A.degrees,catalogs.B.degrees,true,true):labelsForPitchClasses([pc],catalogs[kind].degrees)[0];
  return kind==='common'?label(pc,systems.A.mode==='catalog'?'A':systems.B.mode==='catalog'?'B':undefined):label(pc,kind);
 });
 const visualStates:PitchClassVisualState=(()=>{
  const visibleCommon=view.layers.common||(view.layers.notesA&&view.layers.notesB)?new Set(comparison.common):new Set<number>();
  const onlyA=view.layers.notesA?new Set(comparison.a.filter(pc=>!visibleCommon.has(pc))):new Set<number>(),onlyB=view.layers.notesB?new Set(comparison.b.filter(pc=>!visibleCommon.has(pc))):new Set<number>();
  return {common:visibleCommon,onlyA,onlyB,rootsA:new Set(a.root!==null&&(onlyA.has(a.root)||visibleCommon.has(a.root))?[a.root]:[]),rootsB:new Set(b.root!==null&&(onlyB.has(b.root)||visibleCommon.has(b.root))?[b.root]:[])};
 })();
 useEffect(()=>{
  const fit=()=>{
   if(!editing)return;
   const scroll=boardRefs.current[editing]?.querySelector('.guitar-board') as HTMLElement,notes=scroll?.querySelectorAll('.vl-fret.selected');
   if(!scroll||!notes?.length)return;
   const right=Math.max(...Array.from(notes).map(n=>n.getBoundingClientRect().right)),edge=scroll.getBoundingClientRect().right;
   if(right>edge-8)scroll.scrollLeft+=right-edge+8;
  };
  fit();window.addEventListener('resize',fit);
  const observer=new ResizeObserver(fit),host=editing&&boardRefs.current[editing];
  if(host)observer.observe(host);
  return ()=>{window.removeEventListener('resize',fit);observer.disconnect();};
 },[editing]);
 const applyMatch=()=>{
  const match=matches.find(m=>m.id===matchChoice);if(!lookup||!match||!exactClasses(match.notes,physical[lookup].map(n=>n.pc)))return;
  mutate(lookup,{catalog:{...match.config},mode:'catalog'});const other=lookup==='A'?'B':'A';if(systems[other].mode==='manual')activate(other);
  setStatus('Materiale scelto aperto nel catalogo '+lookup+'. Posizione manuale conservata.');setLookup(null);setMatchChoice('');
 };
 const resetCatalog=()=>{
  setSystems(current=>({A:{...current.A,catalog:catalogDefault()},B:{...current.B,catalog:catalogDefault()}}));
  setView(v=>({...v,displayMode:'notes',layers:{notesA:true,notesB:true,common:true},range:{start:0,end:12},strings:[1,2,3,4,5,6]}));
  setStatus('Cataloghi e filtri ripristinati. Posizioni manuali e modalità conservate.');
 };
 return <div className="harmonic-explorer app-shell hi-interactive">
  <div className="hi-systems">{(['A','B'] as Id[]).map(id=>{
   const s=systems[id],data=catalogs[id],notes=physical[id];
   return <section key={id} className={'hi-system hi-'+id.toLowerCase()+' panel'} aria-label={'Sistema '+id}>
    <div className="hi-system-heading"><h2><span className="hi-letter">{id}</span>Sistema {id}</h2><small>{s.mode==='manual'?'Input fisico':'Materiale astratto'}</small></div>
    <div className="hi-source" aria-label={'Sorgente '+id}><button aria-pressed={s.mode==='catalog'} onClick={()=>mode(id,'catalog')}>Dal catalogo</button><button aria-pressed={s.mode==='manual'} onClick={()=>mode(id,'manual')}>Posizione manuale</button></div>
    {s.mode==='catalog'?<><h3 className="hi-catalog-title">{data.material.label}</h3><SystemSelector title={'System '+id} {...s.catalog} scale={data.scale} arpeggios={data.arpeggios} pentatonics={data.pentatonics} displayMode={view.displayMode} degreeLabels={data.degrees}
      onRootChange={v=>changeCatalog(id,'root',v)} onScaleChange={v=>changeCatalog(id,'scaleId',v)} onMaterialModeChange={v=>changeCatalog(id,'materialMode',v)}
      onArpeggioTypeChange={v=>changeCatalog(id,'arpeggioType',v)} onSelectedArpeggioChange={v=>changeCatalog(id,'selectedArpeggio',v)}
      onPentatonicTypeChange={v=>changeCatalog(id,'pentatonicType',v)} onSelectedPentatonicChange={v=>changeCatalog(id,'selectedPentatonic',v)}/></>:
     <><h3>Posizione {id}</h3><p className="hi-frets" aria-label={'Tasti '+id+', corde 6–1'}>{fretText(s.manual)}</p><p className="hi-note-summary">{notes.length?notes.map(n=>noteName(n.midi)).join(' · '):'Tutte le corde mute'}</p>
      <div className="hi-card-foot"><small>{notes.length} note · {distinct(notes.map(n=>n.pc)).length} classi</small><button onClick={()=>activate(id)} aria-expanded={editing===id} aria-controls={'hi-editor-'+id}>{editing===id?'Tastiera '+id+' aperta':'Apri tastiera '+id}</button></div></>}
   </section>;
  })}</div>
  <section className="panel hi-result" aria-label="Confronto delle classi">
   <h2>Comuni · Solo A · Solo B</h2><div className="hi-result-grid"><NoteChips label="A∩B · Comuni" notes={resultNames(comparison.common,'common')} tone="common"/><NoteChips label="A · Solo A" notes={resultNames(comparison.onlyA,'A')} tone="only-a"/><NoteChips label="B · Solo B" notes={resultNames(comparison.onlyB,'B')} tone="only-b"/></div>
   {(!a.notes.length||!b.notes.length)&&<p className="hi-hint">{!a.notes.length&&!b.notes.length?'Nessuna nota nei due input. Inserisci almeno una nota.':!a.notes.length?'A è vuoto. Tutte le classi di B sono esclusive.':'B è vuoto. Tutte le classi di A sono esclusive.'}</p>}
   {!!a.notes.length&&!!b.notes.length&&!comparison.common.length&&<p className="hi-hint">Nessuna classe comune.</p>}
   {systems.A.mode==='catalog'&&systems.A.catalog.materialMode==='scales'&&systems.B.mode==='manual'&&comparison.onlyB.length>0&&<p className="hi-hint">{comparison.onlyB.map(n=>label(n,'B')).join(', ')} della posizione B {comparison.onlyB.length===1?'è fuori':'sono fuori'} dalla scala A.</p>}
   {systems.B.mode==='catalog'&&systems.B.catalog.materialMode==='scales'&&systems.A.mode==='manual'&&comparison.onlyA.length>0&&<p className="hi-hint">{comparison.onlyA.map(n=>label(n,'A')).join(', ')} della posizione A {comparison.onlyA.length===1?'è fuori':'sono fuori'} dalla scala B.</p>}
   <details className="hi-details"><summary>Registro, caselle, raddoppi e conteggi</summary>
    <div className="overlap-summary"><strong>{a.notes.length||b.notes.length?comparison.overlapPercent+'%':'—'}</strong><span>{comparison.common.length} classi comuni su {Math.max(a.notes.length,b.notes.length)}. Denominatore: la maggiore cardinalità, senza raddoppi.</span></div>
    {bothManual?<><p>Altezze coincidenti: {pitches.pitches.length?pitches.pitches.map(n=>noteName(n.midi)).join(', '):'nessuna'}.</p>{pitches.pitches.length>0&&<ul>{pitches.pitches.map(p=><li key={p.midi}>{noteName(p.midi)} — A: {occurrences(p.a)}; B: {occurrences(p.b)}</li>)}</ul>}<p>Caselle coincidenti: {pitches.cells.length?pitches.cells.map(n=>'corda '+n.stringNumber+', tasto '+n.fret+' ('+noteName(n.midi)+')').join('; '):'nessuna'}.</p></>:<p>Coincidenze di registro e caselle non valutabili: un materiale del catalogo non assegna ottave o corde.</p>}
    {manualIds.map(id=>{const repeated=distinct(physical[id].map(n=>n.pc)).filter(pc=>physical[id].filter(n=>n.pc===pc).length>1);return <div key={id}><p>Raddoppi {id}: {repeated.length?repeated.map(pc=>CHROMATIC_NAMES[pc]+': '+physical[id].filter(n=>n.pc===pc).map(n=>noteName(n.midi)+' (corda '+n.stringNumber+')').join(', ')).join('; '):'nessuno'}.</p><p>Ordine sonoro {id}: {physical[id].length?physical[id].map(n=>noteName(n.midi)).join(' · '):'nessuna nota'}.</p></div>;})}
    {!manualIds.length&&<IntervalSelector interval={normalizePitchClass(systems.B.catalog.root-systems.A.catalog.root)}/>}
    <p>Classi comuni non significa stessa ottava, funzione armonica o diteggiatura. Gli input manuali usano nomi cromatici con bemolli, senza fondamentale assegnata. Grafie enarmoniche indicano la stessa classe.</p>{view.displayMode==='degrees'&&manualIds.length>0&&<p>I risultati mostrano nomi: i gradi non sono definiti per le posizioni manuali.</p>}
   </details>
  </section>
  {!!manualIds.length&&<div className={'hi-editors '+(manualIds.length===1?'hi-single':'')}>{manualIds.map(id=><section key={id} id={'hi-editor-'+id} ref={el=>{boardRefs.current[id]=el;}} className={'hi-editor hi-'+id.toLowerCase()+' panel '+(editing===id?'hi-active':'hi-preview')} aria-label={'Editor '+id}>
   <button className="hi-editor-heading" onClick={()=>activate(id)} aria-pressed={editing===id}>{editing===id?'Stai modificando '+id:'Posizione '+id+' · attiva editor'}</button><p className="hi-hint">Un tasto per corda. Tocca di nuovo per silenziare. Scorri per i tasti 0–24.</p>
   <GuitarFretboard tuning={TUNING} frets={systems[id].manual} onChange={(s,f)=>changeFret(id,s,f)} maxFret={24} readOnly={editing!==id} noteLabel={noteName} selectedLabel={noteName} label={'Tastiera '+id+', corde 1–6, scorrimento orizzontale'} cellClassName={(m,s,f,active)=>active&&common.has(m%12)?'hi-common':''} cellDescription={(m,s,f,active)=>active?', '+(common.has(m%12)?'A∩B, classe comune':'solo '+id):''}/>
   <div className="hi-fret-selectors">{systems[id].manual.map((f,i)=><label key={i}>Corda {6-i}<select aria-label={id+', tasto corda '+(6-i)} value={f===null?'mute':f} disabled={editing!==id} onChange={e=>changeFret(id,6-i,e.target.value==='mute'?null:Number(e.target.value))}><option value="mute">×</option>{Array.from({length:25},(_,n)=><option key={n} value={n}>{n}</option>)}</select></label>)}</div>
   <div className="hi-editor-actions"><button disabled={editing!==id} onClick={()=>{mutate(id,{manual:Array(6).fill(null)});setLookup(null);setStatus('Posizione '+id+' svuotata.');}}>Svuota posizione {id}</button><button disabled={editing!==id||!physical[id].length} onClick={()=>{setLookup(id);setMatchChoice('');}}>Cerca nel catalogo {id}</button></div><p className="hi-board-legend">{id} · nota selezionata; A∩B · classe comune, doppio bordo.</p>
  </section>)}</div>}
  {lookup&&<section className="panel hi-matches" aria-label={'Corrispondenze '+lookup}><h2>Corrispondenze esatte · {lookup}</h2><p className="hi-hint">Uguaglianza delle classi, senza aggiunte o trasposizioni. La scelta non assegna una funzione alla posizione.</p>{matches.length?<><label>Materiale e provenienza<select value={matchChoice} onChange={e=>setMatchChoice(e.target.value)} aria-label={'Materiale corrispondente '+lookup}><option value="">Scegli esplicitamente un materiale</option>{matches.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}</select></label><button disabled={!matchChoice} onClick={applyMatch}>Apri materiale nel catalogo {lookup}</button></>:<p>Nessuna corrispondenza esatta nel catalogo attuale.</p>}<button onClick={()=>{setLookup(null);setMatchChoice('');}}>Chiudi corrispondenze</button></section>}
  <details className="panel hi-map" open={mapOpen} onToggle={e=>setMapOpen(e.currentTarget.open)}><summary>Mappa delle classi · occorrenze 0–12</summary><p className="hi-hint">Questa mappa mostra occorrenze possibili, non le note suonate. I filtri non modificano gli input 0–24.</p>
   <div className="visualization-controls"><DisplayModeSelector mode={view.displayMode} onChange={v=>setView(s=>({...s,displayMode:v}))}/><VisualizationSelector layers={view.layers} onToggle={k=>setView(v=>({...v,layers:{...v.layers,[k]:!v.layers[k]}}))}/><FretRangeSelector range={view.range} onChange={range=>setView(v=>({...v,range}))}/><StringSelector activeStrings={new Set(view.strings)} onToggle={n=>setView(v=>({...v,strings:v.strings.includes(n)?v.strings.filter(s=>s!==n):[...v.strings,n]}))} onSelectAll={()=>setView(v=>({...v,strings:[1,2,3,4,5,6]}))}/></div>
   <PresetResetPanel onReset={resetCatalog}/><div className="fretboard-block"><FretboardLegend/><Fretboard states={visualStates} spelling="flats" displayMode={manualIds.length?'notes':view.displayMode} degreeLabelsA={catalogs.A.degrees} degreeLabelsB={catalogs.B.degrees} fretRange={view.range} activeStrings={new Set(view.strings)}/></div>{manualIds.length>0&&<p className="hi-hint">Input manuale senza tonica: la mappa usa nomi di note. Le fondamentali evidenziate appartengono soltanto ai materiali del catalogo.</p>}
  </details>
  <p className="hi-status" role="status" aria-live="polite">{status}</p>{!available&&<p className="hi-storage-warning">Salvataggio locale non disponibile. Puoi usare il tool; lo stato potrebbe non essere conservato dopo il ricaricamento.</p>}
  <details className="hi-details hi-limits"><summary>Regole e limiti</summary><p>Accordatura standard E2–A2–D3–G3–B3–E4, una nota per corda, input 0–24. Le posizioni sono alternative, non una diteggiatura simultanea. Nessuna verifica ergonomica o generazione dal catalogo. La mappa mantiene il registro 0–12. Il salvataggio è locale al browser e all’origine, senza account o sincronizzazione. I nomi armonici appartengono al catalogo; l’input conserva soltanto i dati fisici. Il confronto usa gli insiemi distinti modulo 12.</p></details>
 </div>;
}
