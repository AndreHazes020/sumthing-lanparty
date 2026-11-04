import {createRoom,joinRoom,hostAction,playerAction,tick,view,token,hash} from './engine.mjs';
const ALLOWED=['https://andrehazes020.github.io','https://sumthing-lanparty.guido677492.chatgpt.site','https://sumthing-lanparty.foggyoak18.chatgpt.site'];
export async function handle(request,db){
 const origin=request.headers.get('origin');const local=origin&&/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin'};if(ALLOWED.includes(origin)||local){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Headers']='Content-Type';headers['Access-Control-Allow-Methods']='POST, OPTIONS';}
 const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers});
 if(origin&&!ALLOWED.includes(origin)&&!local)return reply({error:'This origin is not allowed.'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(request.method!=='POST')return reply({error:'Use POST.'},405);
 try{
  const text=await request.text();if(text.length>150000)return reply({error:'Request too large.'},413);const body=JSON.parse(text);const now=Date.now();
  if(body.op==='create'){
   await db.prepare('DELETE FROM rooms WHERE expires < ?').bind(now).run();
   const count=await db.prepare('SELECT COUNT(*) AS n FROM rooms').first();if(count.n>=500)throw Error('The arcade is busy. Please try later.');
   const secret=token(),hostHash=await hash(secret);let code;for(let i=0;i<5;i++){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const bytes=crypto.getRandomValues(new Uint8Array(6));code=[...bytes].map(n=>chars[n%chars.length]).join('');const room=createRoom(code,hostHash,now,body.practice===true);try{await db.prepare('INSERT INTO rooms (code, state, revision, expires) VALUES (?, ?, 0, ?)').bind(code,JSON.stringify(room),room.expires).run();return reply({token:secret,...view(room,hostHash,now)});}catch(e){if(!String(e).includes('UNIQUE'))throw e;}}
   throw Error('Could not create a room. Try again.');
  }
  const code=String(body.code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length!==6)throw Error('Enter the six-character room code.');
  const secret=body.op==='join'?token():String(body.token||'');if(secret.length<30)throw Error('Your session is missing. Rejoin the room.');const identity=await hash(secret);
  for(let attempt=0;attempt<20;attempt++){
   const row=await db.prepare('SELECT state, revision FROM rooms WHERE code = ? AND expires > ?').bind(code,now).first();if(!row)return reply({error:'Room not found or expired. Ask the host for a new code.'},404);
   const room=JSON.parse(row.state);let changed=tick(room,now);const host=identity===room.hostHash;const player=room.players.find(p=>p.tokenHash===identity);
   if(body.op==='join'){joinRoom(room,body.name,identity,now);changed=true;}
   else if(!host&&!player)return reply({error:'Your session is missing. Rejoin the room.'},401);
   else if(body.op==='host'){if(!host)return reply({error:'Only the host can do that.'},403);hostAction(room,body.action||{},now);changed=true;}
   else if(body.op==='player'){if(!player)return reply({error:'Join as a player to play.'},403);playerAction(room,player,body.action||{},now);changed=true;}
   else if(body.op!=='state')throw Error('Unknown operation.');
   if(player&&now-player.seen>10000){player.seen=now;changed=true;}
   if(changed){room.revision=row.revision+1;const res=await db.prepare('UPDATE rooms SET state = ?, revision = ? WHERE code = ? AND revision = ?').bind(JSON.stringify(room),room.revision,code,row.revision).run();if(!res.meta.changes)continue;}
   return reply({...view(room,identity,now),...(body.op==='join'?{token:secret}:{})});
  }
  return reply({error:'The room is busy. Please try that action again.'},409);
 }catch(e){return reply({error:String(e.message||e).slice(0,250)},400);}
}
