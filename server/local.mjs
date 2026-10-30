import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';
import {handle} from './api.mjs';
import {localDB} from './sqlite.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));const db=localDB(process.env.LANPARTY_DB||':memory:');const port=Number(process.env.PORT)||8000;
createServer(async(req,res)=>{try{if(req.url.startsWith('/api/room')){let body='';for await(const chunk of req)body+=chunk;const request=new Request(`http://127.0.0.1:${port}${req.url}`,{method:req.method,headers:req.headers,...(req.method==='POST'?{body}:{})});const response=await handle(request,db);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;}
const path=decodeURIComponent(new URL(req.url,'http://local').pathname);const full=resolve(root,'.'+(path==='/'?'/index.html':path));if(!full.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(403).end();return;}const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.mjs':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.md':'text/plain'};let contents=await readFile(full);if(full.endsWith('settings.js'))contents=Buffer.from("window.LANPARTY_API='/api/room';");res.writeHead(200,{'Content-Type':mime[extname(full)]||'application/octet-stream','Cache-Control':'no-store'});res.end(contents);}catch{res.writeHead(404).end('Not found');}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
