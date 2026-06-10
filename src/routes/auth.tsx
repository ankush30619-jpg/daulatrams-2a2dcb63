import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const search = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — Daulatram's" },
      { name: "description", content: "Sign in to your Daulatram's account to view orders, addresses, and more." },
    ],
  }),
  component: AuthPage,
});

const LOGO = "/__l5e/assets-v1/8b91c49d-e362-4b9e-8d22-d4250fc957c2/daulatrams-logo.png";

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) navigate({ to: redirect || "/profile" });
    });
    return () => { active = false; };
  }, [navigate, redirect]);

  const target = redirect || "/profile";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null); setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin + "/profile",
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        setInfo("Almost there — check your email to confirm your account, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: target });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null); setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + target,
      });
      if (result.error) throw result.error;
      if (!result.redirected) navigate({ to: target });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <style>{authStyles}</style>
      <div className="auth-card">
        <Link to="/" className="auth-logo-wrap"><img src={LOGO} alt="Daulatram's" /></Link>
        <h1>{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="auth-sub">
          {mode === "signin"
            ? "Sign in to view your orders, saved addresses, and more."
            : "Join the Daulatram's family — three generations of Ayurvedic wisdom."}
        </p>

        <button type="button" className="btn-google" onClick={onGoogle} disabled={loading}>
          <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1A6.62 6.62 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Continue with Google
        </button>

        <div className="divider"><span>or</span></div>

        <form onSubmit={onSubmit} className="auth-form">
          {mode === "signup" && (
            <label>Full name
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Rohit Sharma" />
            </label>
          )}
          <label>Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label>Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          </label>

          {error && <div className="msg msg-err">{error}</div>}
          {info && <div className="msg msg-info">{info}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "signin" ? (
            <>New here? <button type="button" onClick={() => { setMode("signup"); setError(null); setInfo(null); }}>Create an account</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={() => { setMode("signin"); setError(null); setInfo(null); }}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}

const authStyles = `
:root { --dgreen:#0B5132; --orange:#F5921D; --cream:#FAF6EF; --cream-deep:#F3ECDE; --charcoal:#1d1d1d; --text-medium:#4a4a4a; }
.auth-page { min-height: 100vh; display: grid; place-items: center; padding: 32px 16px;
  background: linear-gradient(135deg, #fdf9f0 0%, #f4ecd6 50%, #e8dec0 100%);
  font-family: 'DM Sans', system-ui, sans-serif; color: var(--charcoal); }
.auth-card { width: 100%; max-width: 460px; background: #fff; padding: 40px 38px;
  border-radius: 22px; box-shadow: 0 30px 60px -25px rgba(11,81,50,0.25), 0 8px 20px -8px rgba(11,81,50,0.12); }
.auth-logo-wrap { display:block; text-align:center; margin-bottom: 18px; }
.auth-logo-wrap img { height: 56px; }
.auth-card h1 { font-family: 'Cormorant Garamond', serif; font-weight: 700; font-size: 32px; color: var(--dgreen); text-align: center; margin: 0 0 6px; }
.auth-sub { text-align: center; font-size: 14px; color: var(--text-medium); margin: 0 0 24px; line-height: 1.5; }
.btn-google { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding: 12px 18px;
  border-radius: 12px; border: 1.5px solid #e2e2e2; background:#fff; font-weight:600; font-size:14.5px; cursor:pointer;
  transition: border-color .2s, background .2s, transform .15s; }
.btn-google:hover:not(:disabled) { border-color: var(--dgreen); background:#fafdfb; }
.btn-google:disabled { opacity:.6; cursor: not-allowed; }
.divider { position:relative; text-align:center; margin: 22px 0 18px; color:#aaa; font-size:12px; letter-spacing:.18em; text-transform: uppercase; }
.divider::before, .divider::after { content:""; position:absolute; top:50%; width:42%; height:1px; background:#eee; }
.divider::before { left:0; } .divider::after { right:0; }
.divider span { background:#fff; padding: 0 12px; position:relative; }
.auth-form { display:flex; flex-direction:column; gap:14px; }
.auth-form label { display:flex; flex-direction:column; gap:6px; font-size:13px; font-weight:600; color:#444; }
.auth-form input { padding: 12px 14px; border-radius: 10px; border:1.5px solid #e2e2e2; font-size:14.5px;
  font-family: inherit; transition: border-color .15s, box-shadow .15s; }
.auth-form input:focus { outline:none; border-color: var(--dgreen); box-shadow: 0 0 0 3px rgba(11,81,50,0.12); }
.btn-primary { margin-top:4px; padding: 13px 18px; border-radius: 12px; border:0; cursor:pointer;
  background: linear-gradient(135deg, var(--dgreen), #0E6A41); color:#fff; font-weight:700; font-size:15px;
  transition: transform .15s, box-shadow .2s; box-shadow: 0 8px 20px -8px rgba(11,81,50,0.5); }
.btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 26px -8px rgba(11,81,50,0.55); }
.btn-primary:disabled { opacity:.7; cursor: not-allowed; }
.msg { padding: 10px 12px; border-radius: 10px; font-size:13px; line-height:1.4; }
.msg-err { background:#fff0f0; color:#a30000; border:1px solid #ffd2d2; }
.msg-info { background:#eef7f0; color:#0B5132; border:1px solid #cfe5d6; }
.auth-switch { margin-top: 20px; text-align:center; font-size:13.5px; color:#555; }
.auth-switch button { background:none; border:0; color: var(--dgreen); font-weight:700; cursor:pointer; padding:0 4px; text-decoration: underline; }
@media (max-width: 480px) { .auth-card { padding: 30px 22px; } .auth-card h1 { font-size: 26px; } }
`;