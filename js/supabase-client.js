const SUPABASE_URL =
  "https://kfuktclgvygszzisjwbj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_16pZ2rSr4eV_X_0USiZ06w_dsD9-ntm";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
