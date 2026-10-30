import {DatabaseSync} from 'node:sqlite';
export function localDB(filename=':memory:'){
 const sql=new DatabaseSync(filename);sql.exec('CREATE TABLE IF NOT EXISTS rooms (code TEXT PRIMARY KEY, state TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0, expires INTEGER NOT NULL)');
 return {sql,prepare(query){let args=[];const stmt=sql.prepare(query);const wrapper={bind(...v){args=v;return wrapper;},async first(){return stmt.get(...args)||null;},async run(){const r=stmt.run(...args);return {meta:{changes:Number(r.changes)}};},async all(){return{results:stmt.all(...args)}}};return wrapper;}};
}
