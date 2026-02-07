/**
 * Quick script to list Supabase users
 * Run with: npx ts-node scripts/list-users.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gdpkvnfmqezniilweefh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcGt2bmZtcWV6bmlpbHdlZWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzcwMjIsImV4cCI6MjA4NjA1MzAyMn0.3Dn8RwINZqfemyGqgt7E5prlx1yEpITp9TbeUhqAjFc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listUsers() {
  // Note: This only works with service_role key, not anon key
  // For now, just check current session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (session?.user) {
    console.log("Current logged in user:");
    console.log("- ID:", session.user.id);
    console.log("- Email:", session.user.email);
    console.log("- Name:", session.user.user_metadata?.full_name);
    console.log("- Created:", session.user.created_at);
  } else {
    console.log("No user currently logged in");
    console.log("To see all users, go to Supabase Dashboard > Authentication > Users");
  }
}

listUsers();
