import {beginAdventure,adventureTick,adventureAction,adventureView,advanceAdventure} from './kruger-story.mjs';
import {beginRestoration,restorationTick,sequenceInput} from './restoration.mjs';
import {DEFAULT_PACK,GAMES,CHAPTERS,COLORS,validatePack} from './content.mjs';
import {MAP,distance,walkable,npcPositions} from './map.mjs';
const guessNorm=s=>norm(String(s).replace(/^(the|an|a|de|het|een)\s+/i,''));
const norm=s=>String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g,'');
const fail=s=>{throw Error(s)};
export const token=()=>crypto.randomUUID()+crypto.randomUUID();
export async function hash(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function createRoom(code,hostHash,now=Date.now(),practice=false){return {code,hostHash,created:now,expires:now+6*3600000,practice,players:[],pack:structuredClone(DEFAULT_PACK),game:null,history:[],revision:0};}
export function joinRoom(r,name,tokenHash,now=Date.now()){
 if(r.players.some(p=>p.tokenHash===tokenHash))return;
 if(r.game&&r.game.phase!=='results')fail('A game is in progress. Join when the host returns to the arcade.');
 name=String(name||'').trim().slice(0,24);if(!name)fail('Choose a player name.');
 if(r.players.length>=10)fail('This room already has ten players.');
 if(r.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))fail('That name is taken. Try a nickname.');
 r.players.push({id:crypto.randomUUID(),tokenHash,name,color:COLORS[r.players.length],seen:now,score:0,x:455+r.players.length*7,y:520,moveAt:now,seq:-1});
}
function beginQuestion(r,now){const g=r.game;g.phase='answer';g.answers={};g.deadline=now+30000;}
function beginBluff(r,now){const g=r.game;g.phase='write';g.bluffs={};g.votes={};g.options=[];g.deadline=now+60000;}
function setupVote(r,now){const g=r.game,c=r.pack.characters[g.index];const rows=[{id:crypto.randomUUID(),text:c.truth,owner:null}];for(const p of r.players){const text=g.bluffs[p.id];if(text&&!rows.some(o=>norm(o.text)===norm(text)))rows.push({id:crypto.randomUUID(),text,owner:p.id});}
 g.options=rows.map(o=>({...o,sort:Math.random()})).sort((a,b)=>a.sort-b.sort).map(({sort,...o})=>o);g.phase='vote';g.deadline=now+35000;
}
function scoreBluff(r){const g=r.game,truth=g.options.find(o=>!o.owner);for(const p of r.players){const selected=g.options.find(o=>o.id===g.votes[p.id]);if(selected?.id===truth?.id)p.score+=200;else if(selected?.owner){const owner=r.players.find(p=>p.id===selected.owner);if(owner&&owner.id!==p.id)owner.score+=100;}}g.phase='reveal';g.deadline=null;}
function startSketch(r,now){const g=r.game;g.phase='draw';g.drawings={};g.guesses={};g.prompts=Object.fromEntries(r.players.map((p,i)=>[p.id,r.pack.sketch[(g.index*r.players.length+i)%r.pack.sketch.length]]));g.artist=0;g.deadline=now+60000;}
function beginGuess(r,now){const g=r.game;g.phase='guess';g.guesses={};g.correctGuessers=[];g.deadline=now+35000;}
function startChapter(r,now){const g=r.game;g.phase='chapter';g.deadline=null;beginAdventure(r);for(const [i,p]of r.players.entries()){p.x=434+(i%4)*9;p.y=548+Math.floor(i/4)*11;p.carry=null;p.moveAt=now;p.facing='down';}g.log=[];}
function end(r,now){const g=r.game;g.phase='results';g.deadline=null;g.finished=now;r.history.push({type:g.type,at:now,winners:winners(r),scores:r.players.map(p=>({name:p.name,score:p.score}))});r.history=r.history.slice(-20);}
export function winners(r){const max=Math.max(0,...r.players.map(p=>p.score));return r.players.filter(p=>p.score===max).map(p=>p.name);}
export function tick(r,now=Date.now()){
 const g=r.game;if(!g||g.phase==='results')return false;let changed=false;if(g.type==='restore'&&g.phase==='restore'&&g.restoreMode!=='sequence'){beginRestoration(r,now);changed=true;}if(g.type==='restore'&&g.phase==='restore'&&now<g.deadline)changed=restorationTick(r,now)||changed;
 if(g.type==='kruger'&&g.phase==='chapter'){if(g.krugerMode!=='rpg')beginAdventure(r);changed=adventureTick(r,now)||changed;}
 if(g.deadline&&now>=g.deadline){changed=true;if(g.type==='quiz'){for(const p of r.players)if(g.answers[p.id]===r.pack.quiz[g.index].correct)p.score+=100;g.phase='reveal';g.deadline=null;}
 else if(g.type==='bluff'){if(g.phase==='write')setupVote(r,now);else if(g.phase==='vote')scoreBluff(r);}
 else if(g.type==='sketch'){if(g.phase==='draw')beginGuess(r,now);else {g.phase='reveal';g.deadline=null;}}
 else if(g.type==='restore')end(r,now);
 else if(g.type==='kruger'){g.phase='chapter-end';g.deadline=null;for(const p of r.players)p.carry=null;}}
 return changed;
}
export function hostAction(r,a,now=Date.now()){
 if(a.type==='pack'){if(r.game&&r.game.phase!=='results')fail('Return to the arcade before replacing content.');r.pack=validatePack(a.pack);return;}
 if(a.type==='kick'){if(r.game&&r.game.phase!=='results')fail('Remove players between games.');r.players=r.players.filter(p=>p.id!==a.player);return;}
 if(a.type==='menu'){r.game=null;return;}
 if(a.type==='start'){
  if(!GAMES[a.game])fail('Choose a game.');if(r.game&&r.game.phase!=='results')fail('Return to the arcade before starting another game.');if(r.players.length<(r.practice?1:3))fail('Wait for at least three players, or create a practice room.');
  for(const p of r.players){p.score=0;p.task=0;p.gesture=null;p.seq=-1;}
  const duration=Math.max(30,Math.min(360,Number(a.duration)||300));
  r.game={type:a.game,phase:'',index:0,chapter:0,started:now,duration,log:[]};
  if(a.game==='quiz')beginQuestion(r,now);if(a.game==='bluff')beginBluff(r,now);if(a.game==='kruger')startChapter(r,now);if(a.game==='sketch')startSketch(r,now);if(a.game==='restore'){r.game.phase='restore';r.game.deadline=now+duration*1000;r.game.progress=0;r.game.target=r.players.length*25;for(const p of r.players)p.challengeAt=now;beginRestoration(r,now);}
  return;
 }
 const g=r.game;if(!g)fail('Select a game first.');
 if(a.type==='finish'){end(r,now);return;}
 if(a.type==='rpg-continue'&&g.type==='kruger'&&g.phase==='chapter'){advanceAdventure(r,now);return;}
 if(a.type==='advance'){
  if(g.type==='quiz'){if(g.phase==='answer'){g.deadline=now;tick(r,now);}else if(g.phase==='reveal'){if(++g.index>=r.pack.quiz.length)end(r,now);else beginQuestion(r,now);}}
  else if(g.type==='bluff'){if(g.phase==='write')setupVote(r,now);else if(g.phase==='vote')scoreBluff(r);else if(g.phase==='reveal'){if(++g.index>=r.pack.characters.length)end(r,now);else beginBluff(r,now);}}
  else if(g.type==='sketch'){if(g.phase==='draw')beginGuess(r,now);else if(g.phase==='guess'){g.phase='reveal';g.deadline=null;}else if(g.phase==='reveal'){if(++g.artist>=r.players.length)end(r,now);else beginGuess(r,now);}}
  else if(g.type==='kruger'){if(g.phase==='chapter'){g.phase='chapter-end';g.deadline=null;}else if(g.phase==='chapter-end'){if(++g.chapter>=4)end(r,now);else startChapter(r,now);}}
  else if(g.type==='restore')end(r,now);
 }
 if(a.type==='award'&&g.type==='sketch'&&g.phase==='reveal'){const p=r.players.find(p=>p.id===a.player);if(!p)fail('Unknown player.');g.manual??={};const key=g.artist+':'+p.id;if(!g.manual[key]&&!g.correctGuessers.includes(p.id)&&p.id!==r.players[g.artist].id){p.score+=100;r.players[g.artist].score+=Math.round(100/Math.max(1,r.players.length-1));g.manual[key]=true;}}
}
export function playerAction(r,p,a,now=Date.now()){
 p.seen=now;const g=r.game;if(a.type==='presence')return;if(g?.type==='kruger'&&a.type.startsWith('dialogue-')&&g.phase!=='chapter')return;if(!g||g.phase==='results')fail('Wait for the host to start a game.');
 if(a.type==='answer'&&g.type==='quiz'&&g.phase==='answer'){if(p.id in g.answers)fail('Your answer is already locked.');if(!Number.isInteger(a.answer)||a.answer<0||a.answer>3)fail('Choose an answer.');g.answers[p.id]=a.answer;return;}
 if(a.type==='bluff'&&g.type==='bluff'&&g.phase==='write'){const text=String(a.text||'').trim().slice(0,140);if(!text)fail('Write an answer first.');if(norm(text)===norm(r.pack.characters[g.index].truth))fail('That matches the real answer. Invent a different ending.');g.bluffs[p.id]=text;return;}
 if(a.type==='vote'&&g.type==='bluff'&&g.phase==='vote'){if(p.id in g.votes)fail('Your vote is already locked.');const o=g.options.find(o=>o.id===a.option);if(!o||o.owner===p.id)fail('Choose someone else’s answer.');g.votes[p.id]=o.id;return;}
 if(a.type==='drawing'&&g.type==='sketch'&&g.phase==='draw'){
  if(!Array.isArray(a.strokes)||a.strokes.length>180)fail('Drawing too large.');
  for(const s of a.strokes)if(!Array.isArray(s)||s.length>400||s.some(p=>!Array.isArray(p)||p.length!==2||p.some(v=>!Number.isFinite(v)||v<0||v>1)))fail('Invalid drawing.');
  if(JSON.stringify(a.strokes).length>40000)fail('Drawing too detailed.');g.drawings[p.id]=a.strokes;return;
 }
 if(a.type==='guess'&&g.type==='sketch'&&g.phase==='guess'){
  const artist=r.players[g.artist];if(p.id===artist.id)fail('You drew this one!');g.attempts??={};const key=g.artist+':'+p.id;g.attempts[key]=(g.attempts[key]||0)+1;if(g.attempts[key]>8)fail('Eight guesses used. Wait for the reveal.');
  const text=String(a.text||'').trim().slice(0,120);g.guesses[p.id]=text;if(guessNorm(text)===guessNorm(g.prompts[artist.id])&&!g.correctGuessers.includes(p.id)){g.correctGuessers.push(p.id);p.score+=100;artist.score+=Math.round(100/Math.max(1,r.players.length-1));}return;
 }
 if(a.type==='restore-sequence'&&g.type==='restore'&&g.phase==='restore'){sequenceInput(r,p,a,now);return;}
 if(g.type==='kruger'&&g.phase==='chapter'){
  if(a.type==='move'){
   if(g.scene)return;
   if(!Number.isInteger(a.seq)||a.seq<=p.seq)return;const target={x:Number(a.x),y:Number(a.y)};if(!Number.isFinite(target.x)||!Number.isFinite(target.y))return;
   const max=Math.min(95,Math.max(5,(now-p.moveAt)/1000*150));const d=distance(p,target);const ratio=d>max?max/d:1;const next={x:p.x+(target.x-p.x)*ratio,y:p.y+(target.y-p.y)*ratio};if(walkable(next)){const dx=next.x-p.x,dy=next.y-p.y;if(Math.abs(dx)+Math.abs(dy)>1)p.facing=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');p.x=next.x;p.y=next.y;}p.moveAt=now;p.seq=a.seq;return;
  }
  if(adventureAction(r,p,a,now))return;
 }
 fail('That action is unavailable in this phase.');
}
export function view(r,identity,now=Date.now()){
 const host=identity===r.hostHash,me=r.players.find(p=>p.tokenHash===identity);if(!host&&!me)fail('Rejoin this room to continue.');
 const g=r.game;const out={code:r.code,revision:r.revision,serverNow:now,expires:r.expires,practice:r.practice,sample:r.pack.sample,title:r.pack.title,me:me?.id||null,host,players:r.players.map(({tokenHash,gesture,seq,...p})=>({...p,online:now-p.seen<20000})),history:r.history,game:null};
 if(!g)return out;
 const base={type:g.type,phase:g.phase,index:g.index,chapter:g.chapter,deadline:g.deadline,started:g.started};
 if(g.type==='quiz'){const q=r.pack.quiz[g.index];Object.assign(base,{total:r.pack.quiz.length,question:q?.question,answers:q?.answers,answered:Object.keys(g.answers||{}),myAnswer:g.answers?.[me?.id]});if(['reveal','results'].includes(g.phase))Object.assign(base,{correct:q?.correct,story:q?.story});}
 if(g.type==='bluff'){const c=r.pack.characters[g.index];Object.assign(base,{total:r.pack.characters.length,character:{name:c?.name,description:c?.description,prompt:c?.prompt},submitted:Object.keys(g.bluffs||{}),myBluff:g.bluffs?.[me?.id],voted:Object.keys(g.votes||{}),myVote:g.votes?.[me?.id]});if(g.phase!=='write')base.options=g.options.map(o=>({id:o.id,text:o.text,mine:o.owner===me?.id,...(['reveal','results'].includes(g.phase)?{owner:o.owner,truth:!o.owner}:{} )}));if(['reveal','results'].includes(g.phase))Object.assign(base,{truth:c?.truth,story:c?.story,votes:g.votes});}
 if(g.type==='restore')Object.assign(base,{restoreMode:g.restoreMode,progress:g.progress,target:g.target,sequencePhase:g.sequencePhase,sequenceRound:g.sequenceRound,sequence:g.sequencePhase==='watch'?g.sequence:undefined,sequenceLength:g.sequence?.length,sequenceAt:g.sequenceAt,inputAt:g.inputAt,inputDeadline:g.inputDeadline,celebrateUntil:g.celebrateUntil,event:g.event,restoredPatches:g.restoredPatches});
 if(g.type==='sketch'){const artist=r.players[g.artist];Object.assign(base,{submitted:Object.keys(g.drawings||{}),myPrompt:g.phase==='draw'?g.prompts?.[me?.id]:undefined,artist:artist?.id,drawing:g.phase!=='draw'?g.drawings?.[artist?.id]:undefined,correctGuessers:g.correctGuessers||[],myGuess:g.guesses?.[me?.id]});if(['reveal','results'].includes(g.phase))base.prompt=g.prompts?.[artist?.id];if(host&&g.phase==='reveal')base.guesses=g.guesses;}
 if(g.type==='kruger')Object.assign(base,{...adventureView(r,me),tasks:[],visitors:[],log:g.log,chapterInfo:CHAPTERS[g.chapter]});
 if(g.phase==='results')base.winners=winners(r);
 out.game=base;return out;
}
