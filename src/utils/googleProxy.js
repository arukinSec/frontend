import { supabase } from '../supabaseClient';

export async function googleProxyFetch(memberId, url, options = {}) {
  const { data, error } = await supabase.functions.invoke('google-proxy', {
    body: { url, memberId, method: options.method || 'GET', body: options.body || null }
  });

  if (error) throw error;
  if (!data?.__proxy) throw new Error('Unexpected proxy response');
  if (!data.ok) {
    const err = new Error(data.error || `Google API returned ${data.status}`);
    err.status = data.status;
    throw err;
  }

  // If the proxy base64-encoded a binary file, return it as a Blob instead of raw string
  if (data.isBase64) {
    const binaryString = atob(data.body);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type: options.headers?.['Content-Type'] || 'application/octet-stream' });
  }

  const contentType = options.headers?.['Content-Type'] || 'application/json';
  if (contentType.includes('application/json')) {
    try { return JSON.parse(data.body); } catch { return data.body; }
  }
  return data.body;
}
