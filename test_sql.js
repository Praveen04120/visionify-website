import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSQL() {
  const query = `
    SELECT 1 as test;
  `;
  
  // Method 1: Try RPC 'exec_sql' which is sometimes available
  const res1 = await supabase.rpc('exec_sql', { sql: query });
  console.log('RPC exec_sql result:', res1);
  
  // Method 2: Try calling pgmeta directly using fetch
  const pgmetaUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/pgmeta/v1/query`;
  const res2 = await fetch(pgmetaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apiKey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({ query })
  });
  
  console.log('pgmeta HTTP status:', res2.status);
  try {
    console.log('pgmeta response:', await res2.json());
  } catch(e) {
    console.log('pgmeta response non-json:', await res2.text());
  }
}

testSQL();
