// Shared restoration board. Score, resources, growth and hazards are server-owned.
export const RESTORE_COLS=12,RESTORE_ROWS=8;
export const RESTORE_TOOLS={clean:{label:'Clear',cost:1},plant:{label:'Plant',cost:2},water:{label:'Water',cost:1},coral:{label:'Coral',cost:2},protect:{label:'Rescue',cost:1}};
export function restoreBoard(now){const cells=[];for(let y=0;y<RESTORE_ROWS;y++)for(let x=0;x<RESTORE_COLS;x++){const reef=x>=7;const blocked=(x*13+y*7)%17===0;cells.push({id:y*RESTORE_COLS+x,x,y,zone:reef?'reef':'forest',type:blocked?'rock':(x*3+y*5)%7<2?'litter':reef?'sand':'soil',stage:0,owner:null,at:now});}return cells;}
export function beginRestoration(room,now){const g=room.game;g.cells=restoreBoard(now);g.progress=0;g.target=Math.ceil(g.cells.filter(c=>c.type!=='rock').length*.6);g.nextEvent=now+13000;g.eventCount=0;g.event={name:'A fresh start',text:'Clear litter, plant trees and place coral. Water seedlings so they grow.',at:now};g.popups=[];for(const p of room.players){p.energy=10;p.energyAt=now;p.combo=0;p.bestCombo=0;p.lastRestore=0;p.rushUntil=0;}}
export function energy(p,now){return Math.min(10,p.energy+Math.max(0,now-p.energyAt)/1000*1.5);}
export function restorationTick(room,now){const g=room.game;let changed=false;
 for(const c of g.cells){if(c.type==='seedling'&&c.watered&&now>=c.growAt){c.type=c.zone==='reef'?'coral':'tree';c.stage=1;const owner=room.players.find(p=>p.id===c.owner);if(owner)owner.score+=45;g.popups.push({id:Math.random(),x:c.x,y:c.y,text:'+45 GROWN',at:now});changed=true;}
 if(c.type==='fire'&&now-c.at>11000){c.type=c.zone==='reef'?'sand':'soil';c.owner=null;c.stage=0;c.watered=false;g.event={name:'Habitat lost',text:'A hazard was left too long. Replant this patch!',at:now};changed=true;}}
 if(now>=g.nextEvent){const choices=g.cells.filter(c=>['tree','coral','seedling'].includes(c.type));const event=g.eventCount%3;const indices=[];if(event===0){for(let i=0;i<Math.min(4,choices.length);i++){const c=choices[(g.eventCount*7+i*13)%choices.length];c.type='fire';c.at=now;indices.push(c.id);}g.event={name:'HEATWAVE',text:indices.length?'Rescue the glowing red patches before they burn out!':'The first heatwave passed. Get some habitats growing before the next one.',at:now};}
 else if(event===1){const empty=g.cells.filter(c=>['soil','sand'].includes(c.type));for(let i=0;i<Math.min(6,empty.length);i++){const c=empty[(g.eventCount*3+i*7)%empty.length];c.type='litter';c.at=now;}g.event={name:'LITTER TIDE',text:'New litter washed in. Sweep it up to reopen planting space.',at:now};}
 else{const c=g.cells.find(c=>['soil','sand'].includes(c.type));if(c){c.type='gold';c.at=now;}g.event={name:'GOLDEN SEED',text:'Find the golden seed. Any tool collects it for 100 points and a rush boost.',at:now};}
 g.eventCount++;g.nextEvent=now+16000;changed=true;}
 const progress=g.cells.filter(c=>['tree','coral'].includes(c.type)).length;if(progress!==g.progress){g.progress=progress;changed=true;}g.popups=g.popups.filter(p=>now-p.at<1600).slice(-18);return changed;
}
export function restoreHits(room,p,hits,now){const g=room.game;if(!Array.isArray(hits)||!hits.length||hits.length>8)throw Error('Choose up to eight patches at a time.');let applied=0;const used=new Set();
 for(const hit of hits){if(!Number.isInteger(hit.cell)||used.has(hit.cell))continue;used.add(hit.cell);const c=g.cells[hit.cell],tool=RESTORE_TOOLS[hit.tool];if(!c||!tool)continue;
 let gain=0,next=null,cost=tool.cost;
 if(c.type==='gold'){next=c.zone==='reef'?'sand':'soil';gain=100;cost=0;p.rushUntil=now+5500;}
 else if(hit.tool==='clean'&&c.type==='litter'){next=c.zone==='reef'?'sand':'soil';gain=15;}
 else if(hit.tool==='plant'&&c.type==='soil'){next='seedling';gain=20;}
 else if(hit.tool==='coral'&&c.type==='sand'){next='seedling';gain=25;}
 else if(hit.tool==='water'&&c.type==='seedling'&&!c.watered){next='seedling';gain=25;}
 else if(hit.tool==='protect'&&c.type==='fire'){next=c.zone==='reef'?'coral':'tree';gain=65;}
 else continue;
 const available=energy(p,now);if(p.rushUntil>now)cost=0;if(available<cost)continue;p.energy=available-cost;p.energyAt=now;
 p.combo=now-p.lastRestore<2200?p.combo+1:1;p.bestCombo=Math.max(p.bestCombo,p.combo);p.lastRestore=now;if(p.combo>0&&p.combo%7===0)p.rushUntil=now+4500;
 const multiplier=Math.min(3,1+Math.floor(p.combo/4)*.5);const points=Math.round(gain*multiplier);p.score+=points;
 const oldType=c.type;c.type=next;c.at=now;if(next==='seedling'&&oldType!=='seedling'){c.owner=p.id;c.watered=c.zone==='reef';c.growAt=c.zone==='reef'?now+6500:null;}if(hit.tool==='water'){c.watered=true;c.growAt=now+4500;}if(hit.tool==='protect'){c.watered=true;c.stage=1;}
 g.popups.push({id:Math.random(),x:c.x,y:c.y,text:'+'+points,at:now,color:p.color});applied++;
 }
 if(!applied)throw Error(energy(p,now)<1?'Energy recharging. Choose your next patch.':'Choose the matching tool: clear litter, plant soil, water seedlings, coral on sand, rescue red hazards.');
 g.progress=g.cells.filter(c=>['tree','coral'].includes(c.type)).length;return applied;
}
