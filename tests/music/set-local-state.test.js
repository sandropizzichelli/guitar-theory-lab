import test from 'node:test';
import assert from 'node:assert/strict';
import {readLocalState,writeLocalState,POSITION_STORAGE_KEY,MODE_STORAGE_KEY} from '../../src/tools/set-class-explorer/localState.js';
const storage=()=>{const data=new Map();return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
test('Recupero e cancellazione; modalità e catalogo separati',()=>{
 const s=storage();s.setItem('catalog','4-20');const state={frets:[null,15,14,12,13,24],mode:'input'};writeLocalState(s,state);assert.deepEqual(readLocalState(s),state);writeLocalState(s,{frets:Array(6).fill(null),mode:'input'});assert.equal(s.getItem(POSITION_STORAGE_KEY),null);assert.equal(s.getItem(MODE_STORAGE_KEY),'input');assert.equal(s.getItem('catalog'),'4-20');
});
test('Dati mancanti, JSON corrotto, schema e tasti non validi, storage bloccato',()=>{
 const s=storage();for(const value of ['{','null','[]',JSON.stringify({version:2,frets:[0,0,0,0,0,0]}),...[[0,0],['3',0,0,0,0,0],[25,0,0,0,0,0],[-1,0,0,0,0,0],[1.5,0,0,0,0,0],{}].map(frets=>JSON.stringify({version:1,frets}))]){s.setItem(POSITION_STORAGE_KEY,value);s.setItem(MODE_STORAGE_KEY,'bad');assert.deepEqual(readLocalState(s),{frets:Array(6).fill(null),mode:'explore'});}
 const blocked={getItem(){throw new Error();},setItem(){throw new Error();},removeItem(){throw new Error();}};assert.deepEqual(readLocalState(blocked),{frets:Array(6).fill(null),mode:'explore'});assert.doesNotThrow(()=>writeLocalState(blocked,{frets:[0,0,0,0,0,0],mode:'input'}));
});
