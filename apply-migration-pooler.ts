import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

if (!process.env.SUPABASE_DB_PASSWORD) {
  console.error("Error: SUPABASE_DB_PASSWORD is not set in .env.local");
  process.exit(1);
}

const PROJECT_REF = 'tlhefytzfyjyjohajcvc';
const REGION_POOLER = 'aws-0-us-east-1.pooler.supabase.com';

// Try connecting via Supavisor (Transaction Mode)
// User format: [db_user].[project_ref]
const connectionString = `postgresql://postgres.${PROJECT_REF}:${process.env.SUPABASE_DB_PASSWORD}@${REGION_POOLER}:6543/postgres`;

async function main() {
  console.log(`Attempting connection to ${REGION_POOLER} (Transaction Mode)...`);
  
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected successfully via Pooler!');

    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260213120000_ensure_user_trigger.sql');
    console.log(`Reading migration: ${migrationPath}`);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration...');
    await client.query(sql);
    console.log('Migration applied successfully!');
    console.log('The trigger "on_auth_user_created" has been created/updated.');

  } catch (err) {
    console.error('Connection failed.');
    console.error(err);
    console.log('\nNote: If this failed, the project might not be in us-east-1.');
  } finally {
    await client.end();
  }
}

main();
