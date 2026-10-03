import {useEffect,useRef,useState} from 'react';
import '../../legacy-tools/set-visualizer/index.css';
import SetVisualizer from '../../legacy-tools/set-visualizer/SetVisualizer.jsx';
import ManualPosition from './ManualPosition.jsx';
import {SetInteractionContext} from './InteractionContext.jsx';
import {fretsFromVoicing} from './positionAnalysis.js';
import {browserLocalState,saveBrowserLocalState} from './localState.js';
import './styles.css';
export default function SetClassExplorerTool(){
 const [initial]=useState(browserLocalState);
 const [mode,setMode]=useState(initial.mode),[frets,setFrets]=useState(initial.frets),[request,setRequest]=useState(null);
 useEffect(()=>saveBrowserLocalState({frets,mode}),[frets,mode]);
 const title=useRef(null),exploreTab=useRef(null),sequence=useRef(0);
 useEffect(()=>{if(mode==='input')title.current?.focus();},[mode]);
 function transfer(voicing){const next=fretsFromVoicing(voicing);if(next){setFrets(next);setMode('input');}}
 function openClass(forte){setRequest({forte,sequence:++sequence.current});setMode('explore');exploreTab.current?.focus();}
 return <div className="sce-app">
  <div onKeyDown={e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?'explore':e.key==='End'?'input':mode==='input'?'explore':'input';setMode(next);if(next==='explore')exploreTab.current?.focus();}}} className="sce-mode-tabs" role="tablist" aria-label="Modalità Set-class Explorer"><button className="sce-action" ref={exploreTab} role="tab" id="sce-explore-tab" aria-selected={mode==='explore'} aria-controls="sce-explore" onClick={()=>setMode('explore')}>Esplora</button><button className="sce-action" role="tab" id="sce-input-tab" aria-selected={mode==='input'} aria-controls="sce-input" onClick={()=>setMode('input')}>Inserisci una posizione</button></div>
  <SetInteractionContext.Provider value={{onTransfer:transfer}}><div id="sce-explore" className="sce-explore" role="tabpanel" aria-labelledby="sce-explore-tab" hidden={mode!=='explore'}><p className="sce-explore-limit">Esplora · mappe e ricerca sui tasti 0–12. L’input manuale separato arriva al tasto 24.</p><SetVisualizer catalogRequest={request} onCatalogApplied={()=>setRequest(null)}/></div></SetInteractionContext.Provider>
  <div id="sce-input" role="tabpanel" aria-labelledby="sce-input-tab" hidden={mode!=='input'}><ManualPosition frets={frets} onChange={setFrets} onOpen={openClass} titleRef={title}/></div>
 </div>;
}
