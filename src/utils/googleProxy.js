import { supabase } from '../supabaseClient';

export async function googleProxyFetch(memberId, url, options = {}) {
  const { data, error } = await supabase.functions.invoke('google-proxy', {
    body: { url, memberId, method: options.method || 'GET', body: options.body || null }
  });

  if (error) throw new Error(error.message || 'Google proxy request failed');
  if (data?.error) throw new Error(data.error);

  return data;
}

export async function googleProxyFetchRaw(memberId, url, options = {}) {
  const { data, error: invokeError } = await supabase.functions.invoke('google-proxy', {
    body: { url, memberId, method: options.method || 'GET', body: options.body || null }
  });

  if (invokeError) throw new Error(invokeError.message || 'Google proxy request failed');
  if (data?.error) throw new Error(data.error);

  return data;
}
