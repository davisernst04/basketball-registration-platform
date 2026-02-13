import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as dns from 'dns';

// Force IPv4 for DNS lookups to avoid ENETUNREACH on some IPv6-enabled networks
dns.setDefaultResultOrder('ipv4first');

dotenv.config({ path: '.env.local' });

// Ensure we have the password
if (!process.env.SUPABASE_DB_PASSWORD) {
  console.error("Error: SUPABASE_DB_PASSWORD is not set in .env.local");
  process.exit(1);
}

const connectionString = `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.tlhefytzfyjyjohajcvc.supabase.co:5432/postgres`;

async function main() {
  // Resolve hostname to IPv4 manually
  const hostname = 'db.tlhefytzfyjyjohajcvc.supabase.co';
  console.log(`Resolving IP for ${hostname}...`);
  
  let ip: string;
  try {
    const addresses = await dns.promises.resolve4(hostname);
    if (!addresses || addresses.length === 0) {
      throw new Error('No IPv4 addresses found');
    }
    ip = addresses[0];
    console.log(`Resolved to ${ip}`);
  } catch (e) {
    console.error('DNS resolution failed:', e);
    return;
  }

  // Use the resolved IP in the connection string
  // Note: We might need to keep the original hostname for SSL verification if we were using 'verify-full', 
  // but for 'rejectUnauthorized: false' (which is common for these quick fixes) IP is fine.
  // However, Supabase often requires SNI. Let's see.
  // Actually, 'pg' allows passing 'host' in the config object.
  
  const client = new Client({
    host: ip,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.SUPABASE_DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
      servername: hostname // SNI support
    },
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('Connecting to remote database...');
    await client.connect();
    console.log('Connected successfully.');

    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260213120000_ensure_user_trigger.sql');
    console.log(`Reading migration file: ${migrationPath}`);
    
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration...');
    await client.query(sql);
    console.log('Migration applied successfully!');
    console.log('The trigger "on_auth_user_created" has been created/updated.');

  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

main();
