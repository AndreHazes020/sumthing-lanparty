import {env} from 'cloudflare:workers';
import {handle} from '../../../game-server/api.mjs';
export const dynamic='force-dynamic';
export async function POST(request:Request){return handle(request,env.DB);}
export async function OPTIONS(request:Request){return handle(request,env.DB);}
