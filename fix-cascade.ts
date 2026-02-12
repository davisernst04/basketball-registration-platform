import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = `postgresql://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.tlhefytzfyjyjohajcvc.supabase.co:5432/postgres`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully.');

    console.log('Applying fix for cascading deletes on profiles table...');
    await client.query(`
      ALTER TABLE "public"."profiles"
      DROP CONSTRAINT IF EXISTS "profiles_id_fkey";

      ALTER TABLE "public"."profiles"
      ADD CONSTRAINT "profiles_id_fkey"
      FOREIGN KEY ("id")
      REFERENCES "auth"."users"("id")
      ON DELETE CASCADE;
    `);
    console.log('Profiles fix applied.');

    console.log('Ensuring cascading deletes on registration table...');
    await client.query(`
      ALTER TABLE "public"."registration"
      DROP CONSTRAINT IF EXISTS "registration_user_id_fkey";

      ALTER TABLE "public"."registration"
      ADD CONSTRAINT "registration_user_id_fkey"
      FOREIGN KEY ("user_id")
      REFERENCES "auth"."users"("id")
      ON DELETE CASCADE;
    `);
    console.log('Registration fix applied.');

  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

main();
