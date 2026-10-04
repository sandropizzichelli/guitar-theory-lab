import './GuitarFretboard.css';

// Presentation only: adapters supply tuning, names, selections and edit/inspect callbacks.
export function FretboardCell({children,...props}) {
 return <button type="button" {...props}>{children}</button>;
}
export default function GuitarFretboard({tuning,frets,onChange,maxFret=24,noteLabel,selectedLabel=noteLabel,reserved=null,readOnly=false,cellClassName=()=>'',cellDescription=()=>'',label='Tastiera scorrevole, corde dalla prima alla sesta'}){
 return <div className="guitar-board vl-board-scroll" tabIndex={0} aria-label={label} style={{'--guitar-fret-count':maxFret+1}}>
  <div className="vl-board"><div className="vl-fret-numbers"><span>Corda</span><span>Muta</span>{Array.from({length:maxFret+1},(_,f)=><span key={f}>{f}</span>)}</div>
   {tuning.map(string=>{
    const added=reserved?.stringNumber===string.stringNumber;
    const selectedFret=added?reserved.fret:frets[6-string.stringNumber];
    return <div className="vl-string" key={string.stringNumber}>
     <span className="vl-string-label">{string.stringNumber} <small>{noteLabel(string.midi,string.stringNumber,null,false)}</small></span>
     <FretboardCell className={`vl-mute ${selectedFret===null?'active':''}`} aria-label={`Corda ${string.stringNumber} muta`} aria-pressed={selectedFret===null} disabled={added||readOnly} onClick={()=>onChange(string.stringNumber,null)}>×</FretboardCell>
     {Array.from({length:maxFret+1},(_,fret)=>{
      const active=selectedFret===fret;
      const name=noteLabel(string.midi+fret,string.stringNumber,fret,active);
      const midi=string.midi+fret;
      return <FretboardCell key={fret} className={`vl-fret ${active?'selected':''} ${added&&active?'vl-bass-dot':''} ${[3,5,7,9,12,15,17,19,21,24].includes(fret)?'vl-marker':''} ${cellClassName(midi,string.stringNumber,fret,active)}`} aria-label={`Corda ${string.stringNumber}, tasto ${fret}, ${name}${cellDescription(midi,string.stringNumber,fret,active)}`} aria-pressed={active} disabled={added||readOnly} onClick={()=>onChange(string.stringNumber,active?null:fret)}><span>{active?(added?reserved.label:selectedLabel(midi,string.stringNumber,fret,active)):fret===0?'○':''}</span></FretboardCell>;
     })}
    </div>;
   })}
  </div>
 </div>;
}
