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
const REGIONS = [
  'aws-0-us-east-1',
  'aws-0-us-west-1',
  'aws-0-eu-central-1',
  'aws-0-ap-southeast-1',
  'aws-0-sa-east-1', // Sao Paulo
  'aws-0-eu-west-2', // London
];

async function tryRegion(region: string): Promise<boolean> {
  const host = `${region}.pooler.supabase.com`;
  console.log(`
Attempting connection to ${host}...`);
  
  const connectionString = `postgresql://postgres.${PROJECT_REF}:${process.env.SUPABASE_DB_PASSWORD}@${host}:6543/postgres`;
  
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 5000, // Short timeout for faster scanning
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`✅ SUCCESS! Connected to ${region}`);
    
    // Apply migration
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260213120000_ensure_user_trigger.sql');
    console.log(`Reading migration: ${migrationPath}`);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration...');
    await client.query(sql);
    console.log('Migration applied successfully!');
    console.log('The trigger "on_auth_user_created" has been created/updated.');
    
    await client.end();
    return true;
  } catch (err: any) {
    await client.end();
    if (err.code === 'XX000' && err.message.includes('Tenant or user not found')) {
      console.log(`❌ Project not found in ${region}`);
      return false;
    } else if (err.code === 'ENOTFOUND') {
        console.log(`❌ Host not found: ${host}`);
        return false;
    }
    
    console.error('❌ Connection failed with unexpected error:', err.message);
    // If it's a cert error or timeout, we might still want to continue, but usually Tenant error is the indicator
    return false; 
  }
}

async function main() {
  for (const region of REGIONS) {
    const success = await tryRegion(region);
    if (success) {
      console.log('\nMigration complete. Exiting.');
      process.exit(0);
    }
  }
  
  console.error('\nCould not find project in any common region.');
  process.exit(1);
}

main();
