/* ============================================================
   DAULATRAM'S — Supabase auth wrapper
   Exposes window.dr.auth
   ============================================================ */
(function(){
  const URL_  = "https://wozuighsrqxidiqdicfn.supabase.co";
  const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvenVpZ2hzcnF4aWRpcWRpY2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNjk2NzksImV4cCI6MjA5NjY0NTY3OX0.CyJqDdg-GWCfTPgejl54t7FsKcMCISyht9i2_-stmW0";

  function ready(){
    if (!window.supabase || !window.supabase.createClient){
      console.warn("[dr.auth] supabase-js not loaded yet"); return null;
    }
    if (!window.__drSb) {
      window.__drSb = window.supabase.createClient(URL_, ANON, {
        auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage, storageKey: "dr-auth" }
      });
    }
    return window.__drSb;
  }

  const listeners = new Set();
  function emit(){ listeners.forEach(fn => { try{ fn(window.dr.auth.user); }catch(e){} }); }

  window.dr = window.dr || {};
  window.dr.auth = {
    user: null,
    client(){ return ready(); },
    onChange(fn){ listeners.add(fn); fn(this.user); return () => listeners.delete(fn); },
    async init(){
      const sb = ready(); if (!sb) return null;
      const { data } = await sb.auth.getSession();
      this.user = data.session ? data.session.user : null;
      sb.auth.onAuthStateChange(async (event, session) => {
        this.user = session ? session.user : null;
        emit();
        if (event === "SIGNED_IN" && window.dr && window.dr.store) {
          try { await window.dr.store.syncWishlistFromServer(); } catch(e){}
        }
      });
      emit();
      return this.user;
    },
    async signInPassword(email, password){
      const sb = ready(); return await sb.auth.signInWithPassword({ email, password });
    },
    async signUp(email, password, fullName){
      const sb = ready();
      return await sb.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/site/auth.html", data: { full_name: fullName || "" } }
      });
    },
    async signInWithGoogle(){
      const sb = ready();
      return await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/site/account.html" } });
    },
    async resetPassword(email){
      const sb = ready();
      return await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/site/auth.html?mode=reset" });
    },
    async updatePassword(newPassword){
      const sb = ready(); return await sb.auth.updateUser({ password: newPassword });
    },
    async signOut(){
      const sb = ready(); await sb.auth.signOut();
      this.user = null; emit();
    }
  };

  // Auto-init
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => window.dr.auth.init());
  else window.dr.auth.init();
})();
