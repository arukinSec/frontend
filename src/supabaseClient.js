import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const unavailableBackendError = new Error(
  'Backend environment variables are not configured for this preview.'
);

function createUnavailableQuery() {
  const result = { data: null, error: unavailableBackendError };
  const query = {
    select: () => query,
    insert: () => query,
    upsert: () => query,
    update: () => query,
    delete: () => query,
    eq: () => query,
    neq: () => query,
    ilike: () => query,
    order: () => query,
    limit: () => query,
    single: async () => result,
    maybeSingle: async () => result,
    then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
    catch: (reject) => Promise.resolve(result).catch(reject),
    finally: (callback) => Promise.resolve(result).finally(callback),
  };

  return query;
}

const unavailableClient = {
  supabaseUrl: '',
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: unavailableBackendError }),
    signInWithOAuth: async () => ({ data: null, error: unavailableBackendError }),
    signInWithPassword: async () => ({ data: null, error: unavailableBackendError }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  from: () => createUnavailableQuery(),
  rpc: async () => ({ data: null, error: unavailableBackendError }),
  functions: {
    invoke: async () => ({ data: null, error: unavailableBackendError }),
  },
};

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : unavailableClient;
