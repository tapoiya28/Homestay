const { createClient } = require('@supabase/supabase-js');

class SupabaseClient {
    constructor() {
        if (SupabaseClient.instance) {
            return SupabaseClient.instance;
        }

        const supabaseUrl = process.env.SUPABASE_URL;

        // Prefer server-side keys for backend usage.
        // - SUPABASE_SERVICE_ROLE_KEY: bypasses RLS (keep server-side only)
        // - SUPABASE_ANON_KEY: subject to RLS policies
        // Fallback to legacy SUPABASE_KEY for backward compatibility.
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        const keyType = (() => {
            if (!supabaseKey) return 'missing';
            if (supabaseKey.split('.').length === 3) return 'jwt';
            if (supabaseKey.startsWith('sb_publishable_')) return 'publishable';
            return 'unknown';
        })();

        if (!supabaseUrl || !supabaseKey) {
            throw new Error(
                'SUPABASE_URL and a Supabase API key must be set in the .env file. '
                + 'Use SUPABASE_SERVICE_ROLE_KEY (recommended for backend) or SUPABASE_ANON_KEY (RLS applies). '
                + 'Legacy: SUPABASE_KEY.'
            );
        }

        // Not throwing here to keep dev experience smooth, but this is a common root cause
        // for "data = []" when RLS is enabled.
        if (keyType !== 'jwt') {
            console.warn(
                '[supabase] The configured key is not a JWT (type=' + keyType + '). '
                + 'If your tables have RLS enabled, you may see empty results. '
                + 'For backend usage, set SUPABASE_SERVICE_ROLE_KEY in .env.'
            );
        }

        this.client = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false
            }
        });
        SupabaseClient.instance = this;
    }

    getClient() {
        return this.client;
    }
}

module.exports = new SupabaseClient();
