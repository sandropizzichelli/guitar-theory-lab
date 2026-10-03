import {isValidInputFrets} from './positionAnalysis.js';

export const POSITION_STORAGE_KEY='gtl.set-class.position.v1';
export const MODE_STORAGE_KEY='gtl.set-class.mode.v1';
const empty=()=>Array(6).fill(null);

// Storage is optional: blocked access, malformed JSON and old schemas are harmless.
export function readLocalState(storage){
 let frets=empty(),mode='explore';
 try {
  const saved=JSON.parse(storage.getItem(POSITION_STORAGE_KEY));
  if(saved?.version===1&&isValidInputFrets(saved.frets))frets=[...saved.frets];
 }catch{}
 try {
  const saved=storage.getItem(MODE_STORAGE_KEY);
  if(saved==='input'||saved==='explore')mode=saved;
 }catch{}
 return {frets,mode};
}
export function writeLocalState(storage,{frets,mode}){
 try {
  if(isValidInputFrets(frets)){
   if(frets.every(f=>f===null))storage.removeItem(POSITION_STORAGE_KEY);
   else storage.setItem(POSITION_STORAGE_KEY,JSON.stringify({version:1,frets}));
  }
  if(mode==='input'||mode==='explore')storage.setItem(MODE_STORAGE_KEY,mode);
 }catch{}
}
export function browserLocalState(){
 try{return readLocalState(window.localStorage);}catch{return {frets:empty(),mode:'explore'};}
}
export function saveBrowserLocalState(state){
 try{writeLocalState(window.localStorage,state);}catch{}
}
