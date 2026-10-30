import {walkable,distance} from './map.mjs';
const STEP=5,LEFT=240,TOP=130,RIGHT=700,BOTTOM=750;
const key=(x,y)=>x+','+y;
function snap(p){return{x:Math.round(p.x/STEP)*STEP,y:Math.round(p.y/STEP)*STEP};}
export function reachablePoint(p,radius=38){const center=snap(p);if(walkable(center))return center;for(let r=STEP;r<=radius;r+=STEP)for(let i=0;i<16;i++){const a=i/16*Math.PI*2,point=snap({x:p.x+Math.cos(a)*r,y:p.y+Math.sin(a)*r});if(walkable(point))return point;}return null;}
export function findPath(from,to){const start=reachablePoint(from),goal=reachablePoint(to);if(!start||!goal)return[];if(distance(start,goal)<STEP)return[goal];const heap=[];const push=n=>{heap.push(n);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p].f<=n.f)break;heap[i]=heap[p];i=p;}heap[i]=n;};const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let c=i*2+1;if(c>=heap.length)break;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;}heap[i]=last;}return top;};
const costs=new Map([[key(start.x,start.y),0]]),parents=new Map(),closed=new Set();push({...start,g:0,f:distance(start,goal)});let count=0;
while(heap.length&&count++<22000){const n=pop(),id=key(n.x,n.y);if(closed.has(id))continue;closed.add(id);if(distance(n,goal)<STEP){const path=[goal];let k=id;while(k!==key(start.x,start.y)){const [x,y]=k.split(',').map(Number);path.push({x,y});k=parents.get(k);if(!k)return[];}return path.reverse();}
for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const next={x:n.x+dx*STEP,y:n.y+dy*STEP};if(next.x<LEFT||next.x>RIGHT||next.y<TOP||next.y>BOTTOM||!walkable(next))continue;if(dx&&dy&&(!walkable({x:next.x,y:n.y})||!walkable({x:n.x,y:next.y})))continue;const nid=key(next.x,next.y),g=n.g+STEP*Math.hypot(dx,dy);if(g>=(costs.get(nid)??Infinity))continue;costs.set(nid,g);parents.set(nid,id);push({...next,g,f:g+distance(next,goal)});}}
return[];}
