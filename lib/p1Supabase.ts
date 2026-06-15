import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let publicClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

function getPublicSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
}

function getPublicSupabaseKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ?? process.env.SUPABASE_PUBLISHABLE_KEY
    ?? process.env.SUPABASE_ANON_KEY
    ?? "";
}

function getServiceSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? "";
}

export function hasPublicSupabaseEnv() {
  return Boolean(getPublicSupabaseUrl() && getPublicSupabaseKey());
}

export function hasServiceSupabaseEnv() {
  return Boolean(getPublicSupabaseUrl() && getServiceSupabaseKey());
}

export function getPublicSupabaseClient() {
  const url = getPublicSupabaseUrl();
  const key = getPublicSupabaseKey();

  if (!url || !key) {
    throw new Error("Supabase publico nao configurado.");
  }

  if (!publicClient) {
    publicClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return publicClient;
}

export function getServiceSupabaseClient() {
  const url = getPublicSupabaseUrl();
  const key = getServiceSupabaseKey();

  if (!url || !key) {
    throw new Error("Supabase service role nao configurado.");
  }

  if (!serviceClient) {
    serviceClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serviceClient;
}
