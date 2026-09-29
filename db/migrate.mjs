import { neon } from '@neondatabase/serverless';
import { readFile } from 'node:fs/promises';
if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL. Add it to .env.local or your shell.'); process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
const statements = schema.split(/;\s*(?:\n|$)/).map(s => s.trim()).filter(Boolean);
for (const statement of statements) await sql.query(statement);
console.log(`Folio database ready (${statements.length} statements).`);
