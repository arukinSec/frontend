import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useAuditor() {
  const [auditor, setAuditor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('managers')
        .select('id, email, tier, additional_slots, billing_cycle, onboarded')
        .eq('email', user.email)
        .single();

      if (!cancelled) {
        setAuditor(data || null);
        setLoading(false);
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { auditor, loading };
}
