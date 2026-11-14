// Descarrega totes les imatges del cub a  ./dataset/A1/, ./dataset/A2/ ...
// Només descarrega el que falta, així es pot executar tantes vegades com calgui. Cal Node 18 o superior; sense dependències.
//
// Ús (PowerShell):
//   $env:SUPABASE_URL = "https://xxxx.supabase.co"
//   $env:SUPABASE_SERVICE_KEY = "<clau service_role>"     # secreta: no la pugis mai a GitHub
//   node descarregar.mjs [carpeta_desti]
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const URL_ = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_KEY || '';
const BUCKET = process.env.SUPABASE_BUCKET || 'imatges';
const DEST = process.argv[2] || 'dataset';
if (!URL_ || !KEY) { console.error('Falten les variables SUPABASE_URL i SUPABASE_SERVICE_KEY.'); process.exit(1); }
const HDR = { apikey: KEY, Authorization: 'Bearer ' + KEY };

async function llista(prefix) {
  const out = [];
  for (let offset = 0; ; offset += 1000) {
    const r = await fetch(`${URL_}/storage/v1/object/list/${BUCKET}`, {
      method: 'POST', headers: { ...HDR, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix, limit: 1000, offset })
    });
    if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
    const lot = await r.json(); out.push(...lot);
    if (lot.length < 1000) return out;
  }
}
const existeix = p => access(p).then(() => true, () => false);

let total = 0, nous = 0;
for (const carpeta of await llista('')) {
  if (carpeta.id !== null) continue;                      // les entrades sense id són carpetes
  await mkdir(join(DEST, carpeta.name), { recursive: true });
  for (const f of await llista(carpeta.name + '/')) {
    if (f.id === null) continue;
    total++;
    const desti = join(DEST, carpeta.name, f.name);
    if (await existeix(desti)) continue;
    const r = await fetch(`${URL_}/storage/v1/object/${BUCKET}/${carpeta.name}/${f.name}`, { headers: HDR });
    if (!r.ok) throw new Error(`${r.status} ${desti}`);
    await writeFile(desti, Buffer.from(await r.arrayBuffer()));
    nous++;
  }
  console.log(carpeta.name, 'ok');
}
console.log(`${total} imatges al servidor, ${nous} de noves descarregades a '${DEST}'.`);
