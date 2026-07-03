import localforage from 'localforage';
import { supabase } from '../supabaseClient';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function getKey() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || '';
  const keyData = await crypto.subtle.digest('SHA-256', encoder.encode(token));
  return crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export async function getEncryptedItem(key) {
  const encrypted = await localforage.getItem(key);
  if (!encrypted) return null;
  try {
    const cryptoKey = await getKey();
    const iv = encrypted.slice(0, 12);
    const data = encrypted.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, data);
    return JSON.parse(decoder.decode(decrypted));
  } catch {
    return null;
  }
}

export async function setEncryptedItem(key, value) {
  const cryptoKey = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(JSON.stringify(value));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, encoded);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  await localforage.setItem(key, combined);
}

export async function removeEncryptedItem(key) {
  await localforage.removeItem(key);
}
