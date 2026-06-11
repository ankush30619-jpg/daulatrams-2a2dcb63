import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  getMyProfile, updateMyProfile,
  getMyAddresses, upsertMyAddress, deleteMyAddress,
  getMyOrders,
} from "@/lib/account.functions";

const TABS = ["overview", "orders", "addresses", "settings"] as const;
type Tab = (typeof TABS)[number];
const searchSchema = z.object({ tab: z.enum(TABS).optional() });

export const Route = createFileRoute("/_authenticated/profile")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "My Account — Daulatram's" },
      { name: "description", content: "Your Daulatram's account: orders, addresses, and profile settings." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

const LOGO = "/__l5e/assets-v1/8b91c49d-e362-4b9e-8d22-d4250fc957c2/daulatrams-logo.png";

function ProfilePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { tab: tabParam } = useSearch({ from: "/_authenticated/profile" });
  const tab: Tab = tabParam ?? "overview";
  const setTab = (t: Tab) =>
    navigate({ to: "/profile", search: t === "overview" ? {} : { tab: t }, replace: true });

  const fetchProfile = useServerFn(getMyProfile);
  const fetchOrders = useServerFn(getMyOrders);
  const fetchAddresses = useServerFn(getMyAddresses);

  const profileQ = useQuery({ queryKey: ["me", "profile"], queryFn: () => fetchProfile(), staleTime: 0, refetchOnWindowFocus: true });
  const ordersQ = useQuery({ queryKey: ["me", "orders"], queryFn: () => fetchOrders(), staleTime: 0, refetchOnWindowFocus: true });
  const addrQ = useQuery({ queryKey: ["me", "addresses"], queryFn: () => fetchAddresses(), staleTime: 0, refetchOnWindowFocus: true });

  // Always re-fetch the freshest data on entry (covers post-login redirect).
  useEffect(() => {
    qc.invalidateQueries({ queryKey: ["me"] });
    const { data: sub } = supabase.auth.onAuthStateChange((evt) => {
      if (evt === "SIGNED_IN" || evt === "USER_UPDATED" || evt === "TOKEN_REFRESHED") {
        qc.invalidateQueries({ queryKey: ["me"] });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  const profile = profileQ.data?.profile;
  const email = profileQ.data?.email;
  const orders = ordersQ.data ?? [];
  const addresses = addrQ.data ?? [];

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => ["pending", "confirmed", "shipped"].includes(o.status)).length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const spent = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return { total, pending, delivered, spent };
  }, [orders]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const initials = (profile?.full_name || email || "U")
    .split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("") || "U";

  return (
    <div className="acc-page">
      <style>{styles}</style>
      <header className="acc-top">
        <Link to="/" className="acc-brand"><img src={LOGO} alt="Daulatram's" /></Link>
        <div className="acc-top-actions">
          <button className="acc-refresh" onClick={() => qc.invalidateQueries({ queryKey: ["me"] })} title="Refresh">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/></svg>
            Refresh
          </button>
          <Link to="/" className="acc-back">← Back to shop</Link>
        </div>
      </header>

      <div className="acc-hero">
        <div className="acc-hero-deco" aria-hidden="true">
          <span className="orb orb-1" /><span className="orb orb-2" /><span className="orb orb-3" />
        </div>
        <div className="acc-hero-inner">
          <div className="avatar-ring">
            <div className="avatar">{profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : initials}</div>
          </div>
          <div className="who">
            <span className="who-hi">Namaste 🙏</span>
            <h1>{profile?.full_name || (email ? email.split("@")[0] : "Welcome")}</h1>
            <p>{email}</p>
            <div className="hero-badges">
              {profile?.created_at && (
                <span className="hero-badge">✨ Member since {new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
              )}
              <span className="hero-badge gold">🪔 {stats.total} order{stats.total === 1 ? "" : "s"}</span>
            </div>
          </div>
          <div className="hero-actions">
            <a href="/site/shop.html" className="btn-fill-light">Continue shopping</a>
            <button className="btn-ghost" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </div>

      <div className="acc-body">
        <aside className="acc-nav">
          {([
            ["overview", "Overview", "📊"],
            ["orders", "My Orders", "📦"],
            ["addresses", "Addresses", "📍"],
            ["settings", "Settings", "⚙️"],
          ] as const).map(([key, label, icon]) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
              <span className="ic">{icon}</span>{label}
            </button>
          ))}
        </aside>

        <section className="acc-main" key={tab}>
          {tab === "overview" && <Overview stats={stats} orders={orders.slice(0, 3)} loading={ordersQ.isLoading} onSeeAll={() => setTab("orders")} />}
          {tab === "orders" && <Orders orders={orders} loading={ordersQ.isLoading} />}
          {tab === "addresses" && <Addresses addresses={addresses} loading={addrQ.isLoading} />}
          {tab === "settings" && <Settings profile={profile ?? null} email={email ?? null} />}
        </section>
      </div>
    </div>
  );
}

// ---------- Overview ----------
function Overview({ stats, orders, loading, onSeeAll }:
  { stats: { total:number; pending:number; delivered:number; spent:number }; orders: any[]; loading: boolean; onSeeAll: () => void }) {
  return (
    <div className="card">
      <h2>Overview</h2>
      <div className="stat-grid">
        <Stat label="Total Orders" value={stats.total} color="#0B5132" />
        <Stat label="In Progress" value={stats.pending} color="#F5921D" />
        <Stat label="Delivered" value={stats.delivered} color="#3a7d44" />
        <Stat label="Total Spent" value={`₹${stats.spent.toLocaleString("en-IN")}`} color="#1d1d1d" />
      </div>
      <div className="recent-head">
        <h3>Recent orders</h3>
        {orders.length > 0 && <button className="link-btn" onClick={onSeeAll}>See all →</button>}
      </div>
      {loading ? <Skeleton rows={2} /> : orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="order-list">{orders.map((o) => <OrderRow key={o.id} order={o} />)}</div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="stat" style={{ borderTopColor: color }}>
      <div className="stat-val">{value}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

// ---------- Orders ----------
function Orders({ orders, loading }: { orders: any[]; loading: boolean }) {
  return (
    <div className="card">
      <h2>My Orders</h2>
      {loading ? <Skeleton rows={3} /> : orders.length === 0 ? <EmptyOrders /> : (
        <div className="order-list">{orders.map((o) => <OrderRow key={o.id} order={o} expandable />)}</div>
      )}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#F5921D", confirmed: "#3a7d9b", shipped: "#7b5fb2", delivered: "#3a7d44", cancelled: "#a44",
};

function OrderRow({ order, expandable = false }: { order: any; expandable?: boolean }) {
  const [open, setOpen] = useState(false);
  const color = STATUS_COLORS[order.status] || "#777";
  return (
    <div className="order-row">
      <div className="order-head" onClick={() => expandable && setOpen(!open)} style={{ cursor: expandable ? "pointer" : "default" }}>
        <div>
          <div className="ord-num">{order.order_number}</div>
          <div className="ord-date">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {order.order_items?.length || 0} item(s)</div>
        </div>
        <span className="status-pill" style={{ background: color + "22", color }}>{order.status}</span>
        <div className="ord-total">₹{Number(order.total).toLocaleString("en-IN")}</div>
        {expandable && <span className="chev" style={{ transform: open ? "rotate(180deg)" : "none" }}>▾</span>}
      </div>
      {expandable && open && (
        <div className="order-detail">
          <div className="items">
            {(order.order_items || []).map((it: any) => (
              <div key={it.id} className="item-row">
                <div className="item-name">{it.product_name}</div>
                <div className="item-qty">× {it.quantity}</div>
                <div className="item-amt">₹{Number(it.line_total).toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
          <div className="totals">
            <div><span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString("en-IN")}</span></div>
            <div><span>Shipping</span><span>₹{Number(order.shipping).toLocaleString("en-IN")}</span></div>
            <div className="grand"><span>Total</span><span>₹{Number(order.total).toLocaleString("en-IN")}</span></div>
          </div>
          {order.shipping_address && (
            <div className="ship-addr">
              <h4>Shipping to</h4>
              <p>{[order.shipping_address.line1, order.shipping_address.line2, order.shipping_address.city, order.shipping_address.state, order.shipping_address.pincode].filter(Boolean).join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="empty">
      <div className="emoji">🌿</div>
      <h3>No orders yet</h3>
      <p>Browse our Ayurvedic range and place your first order.</p>
      <a href="/site/shop.html" className="btn-fill">Shop Now</a>
    </div>
  );
}

// ---------- Addresses ----------
function Addresses({ addresses, loading }: { addresses: any[]; loading: boolean }) {
  const qc = useQueryClient();
  const upsertFn = useServerFn(upsertMyAddress);
  const deleteFn = useServerFn(deleteMyAddress);
  const [editing, setEditing] = useState<any | null>(null);
  const [adding, setAdding] = useState(false);

  const saveMut = useMutation({
    mutationFn: (data: any) => upsertFn({ data }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["me", "addresses"] }); setAdding(false); setEditing(null); },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me", "addresses"] }),
  });

  return (
    <div className="card">
      <div className="card-head">
        <h2>Saved Addresses</h2>
        {!adding && !editing && <button className="btn-fill" onClick={() => setAdding(true)}>+ Add address</button>}
      </div>
      {(adding || editing) ? (
        <AddressForm initial={editing} onCancel={() => { setAdding(false); setEditing(null); }} onSave={(d) => saveMut.mutate(d)} saving={saveMut.isPending} />
      ) : loading ? <Skeleton rows={2} /> : addresses.length === 0 ? (
        <div className="empty"><div className="emoji">📍</div><h3>No addresses saved</h3><p>Save an address for faster checkout next time.</p></div>
      ) : (
        <div className="addr-grid">
          {addresses.map((a) => (
            <div key={a.id} className="addr-card">
              <div className="addr-top">
                <span className="label-pill">{a.label}</span>
                {a.is_default && <span className="default-pill">Default</span>}
              </div>
              <p>{a.line1}{a.line2 && `, ${a.line2}`}</p>
              <p>{a.city}, {a.state} {a.pincode}</p>
              <p>{a.country}{a.phone ? ` · ${a.phone}` : ""}</p>
              <div className="addr-actions">
                <button className="link-btn" onClick={() => setEditing(a)}>Edit</button>
                <button className="link-btn danger" onClick={() => { if (confirm("Delete this address?")) delMut.mutate(a.id); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ initial, onSave, onCancel, saving }: { initial: any | null; onSave: (d: any) => void; onCancel: () => void; saving: boolean }) {
  const [f, setF] = useState({
    id: initial?.id, label: initial?.label || "Home", line1: initial?.line1 || "", line2: initial?.line2 || "",
    city: initial?.city || "", state: initial?.state || "", pincode: initial?.pincode || "",
    country: initial?.country || "India", phone: initial?.phone || "", is_default: initial?.is_default || false,
  });
  function up<K extends keyof typeof f>(k: K, v: typeof f[K]) { setF((p) => ({ ...p, [k]: v })); }
  return (
    <form className="addr-form" onSubmit={(e) => { e.preventDefault(); onSave(f); }}>
      <div className="row-2">
        <label>Label<input value={f.label} onChange={(e) => up("label", e.target.value)} required /></label>
        <label>Phone<input value={f.phone} onChange={(e) => up("phone", e.target.value)} /></label>
      </div>
      <label>Address line 1<input value={f.line1} onChange={(e) => up("line1", e.target.value)} required /></label>
      <label>Address line 2 (optional)<input value={f.line2} onChange={(e) => up("line2", e.target.value)} /></label>
      <div className="row-3">
        <label>City<input value={f.city} onChange={(e) => up("city", e.target.value)} required /></label>
        <label>State<input value={f.state} onChange={(e) => up("state", e.target.value)} required /></label>
        <label>Pincode<input value={f.pincode} onChange={(e) => up("pincode", e.target.value)} required /></label>
      </div>
      <label className="check"><input type="checkbox" checked={f.is_default} onChange={(e) => up("is_default", e.target.checked)} /> Set as default address</label>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-fill" disabled={saving}>{saving ? "Saving…" : "Save address"}</button>
      </div>
    </form>
  );
}

// ---------- Settings ----------
function Settings({ profile, email }: { profile: any; email: string | null }) {
  const qc = useQueryClient();
  const updFn = useServerFn(updateMyProfile);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile?.full_name || "");
    setPhone(profile?.phone || "");
  }, [profile]);

  const mut = useMutation({
    mutationFn: () => updFn({ data: { full_name: fullName, phone } }),
    onSuccess: () => { setMsg("Saved!"); qc.invalidateQueries({ queryKey: ["me", "profile"] }); setTimeout(() => setMsg(null), 2000); },
    onError: (e) => setMsg(e instanceof Error ? e.message : "Failed to save"),
  });

  return (
    <div className="card">
      <h2>Account Settings</h2>
      <form onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} className="addr-form" style={{ maxWidth: 520 }}>
        <label>Email<input value={email ?? ""} disabled /></label>
        <label>Full name<input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></label>
        <label>Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 …" /></label>
        {msg && <div className="msg-info">{msg}</div>}
        <div className="form-actions">
          <button type="submit" className="btn-fill" disabled={mut.isPending}>{mut.isPending ? "Saving…" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return <div className="skel-wrap">{Array.from({ length: rows }).map((_, i) => <div className="skel" key={i} />)}</div>;
}

const styles = `
:root { --dgreen:#0B5132; --dgreen-2:#0E6A41; --orange:#F5921D; --cream:#FAF6EF; --cream-deep:#F3ECDE; --charcoal:#1d1d1d; --text-medium:#4a4a4a; --text-muted:#7a7a7a; }
.acc-page { min-height: 100vh; background: var(--cream); color: var(--charcoal); font-family: 'DM Sans', system-ui, sans-serif; }
.acc-top { display:flex; align-items:center; justify-content:space-between; padding: 18px 28px; background:#fff; border-bottom:1px solid #eee5cf; position: sticky; top:0; z-index:10; }
.acc-brand img { height: 38px; display:block; }
.acc-back { color: var(--dgreen); font-weight:600; font-size:14px; text-decoration:none; }
.acc-back:hover { text-decoration: underline; }
.acc-hero { background: linear-gradient(135deg, var(--dgreen) 0%, #0E6A41 60%, #145d3d 100%); color:#fff; padding: 40px 28px; }
.acc-hero-inner { max-width: 1180px; margin:0 auto; display:flex; align-items:center; gap: 22px; flex-wrap: wrap; }
.avatar { width:72px; height:72px; border-radius:50%; background: linear-gradient(135deg, var(--orange), #ffb358); color:#fff; display:grid; place-items:center; font-family:'Cormorant Garamond',serif; font-weight:700; font-size:30px; box-shadow:0 8px 20px rgba(0,0,0,0.2); }
.who { flex:1; min-width: 200px; }
.who h1 { font-family: 'Cormorant Garamond', serif; font-weight:700; font-size:30px; margin:0 0 4px; }
.who p { margin:0; opacity:.9; font-size:14.5px; }
.member-since { display:inline-block; margin-top:6px; font-size:12px; padding:4px 10px; background:rgba(255,255,255,0.16); border-radius: 50px; }
.btn-ghost { background: rgba(255,255,255,0.14); color:#fff; border:1px solid rgba(255,255,255,0.3); padding: 10px 18px; border-radius:10px; font-weight:600; cursor:pointer; font-size:14px; }
.btn-ghost:hover { background: rgba(255,255,255,0.22); }

.acc-body { max-width: 1180px; margin:0 auto; padding: 28px; display:grid; grid-template-columns: 240px 1fr; gap: 24px; }
@media (max-width: 820px) { .acc-body { grid-template-columns: 1fr; padding: 18px; } }
.acc-nav { display:flex; flex-direction:column; gap:6px; background:#fff; padding: 14px; border-radius: 16px; height: fit-content; box-shadow: 0 6px 20px -10px rgba(11,81,50,0.15); }
.acc-nav button { display:flex; align-items:center; gap:12px; padding: 12px 14px; background:none; border:0; border-radius:10px; text-align:left; font-size:14.5px; font-weight:500; color:var(--text-medium); cursor:pointer; font-family:inherit; transition: background .15s, color .15s; }
.acc-nav button .ic { font-size: 17px; }
.acc-nav button:hover { background: #f5efe1; color: var(--charcoal); }
.acc-nav button.active { background: var(--dgreen); color:#fff; }
.acc-nav button.active:hover { background: var(--dgreen-2); }
@media (max-width: 820px) { .acc-nav { flex-direction: row; overflow-x: auto; } .acc-nav button { white-space: nowrap; } }

.acc-main { min-width: 0; }
.card { background:#fff; border-radius: 18px; padding: 26px 28px; box-shadow: 0 6px 24px -12px rgba(11,81,50,0.15); }
.card h2 { font-family:'Cormorant Garamond', serif; font-weight:700; font-size:26px; color: var(--dgreen); margin:0 0 18px; }
.card-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; flex-wrap:wrap; }
.card-head h2 { margin:0; }

.stat-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr)); gap:14px; margin-bottom: 26px; }
.stat { background: var(--cream-deep); padding: 16px 18px; border-radius: 12px; border-top: 3px solid; }
.stat-val { font-family:'Cormorant Garamond', serif; font-weight:700; font-size: 28px; color: var(--charcoal); }
.stat-lbl { font-size: 12.5px; color: var(--text-muted); text-transform: uppercase; letter-spacing: .08em; font-weight:600; margin-top:4px; }
.recent-head { display:flex; align-items:center; justify-content:space-between; margin: 8px 0 12px; }
.recent-head h3 { margin:0; font-size: 16px; color: var(--charcoal); }

.order-list { display:flex; flex-direction:column; gap:12px; }
.order-row { background: var(--cream-deep); border-radius: 12px; overflow:hidden; }
.order-head { display:grid; grid-template-columns: 1fr auto auto auto; gap: 14px; align-items:center; padding: 14px 18px; }
.ord-num { font-weight: 700; color: var(--dgreen); font-size: 14.5px; }
.ord-date { font-size: 12.5px; color: var(--text-muted); margin-top:2px; }
.status-pill { padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: capitalize; }
.ord-total { font-weight: 700; font-size: 15.5px; }
.chev { color: var(--text-muted); transition: transform .2s; }
.order-detail { padding: 0 18px 18px; border-top: 1px dashed #d8cda9; padding-top: 14px; }
.items { display:flex; flex-direction:column; gap:6px; margin-bottom:12px; }
.item-row { display:grid; grid-template-columns: 1fr auto auto; gap: 14px; font-size:14px; padding: 6px 0; }
.item-qty { color: var(--text-muted); }
.item-amt { font-weight:600; }
.totals { border-top: 1px solid #d8cda9; padding-top: 10px; display:flex; flex-direction:column; gap:5px; font-size:13.5px; color:var(--text-medium); }
.totals > div { display:flex; justify-content:space-between; }
.totals .grand { font-size:15px; font-weight:700; color: var(--charcoal); padding-top:6px; margin-top:4px; border-top:1px solid #d8cda9; }
.ship-addr { margin-top: 12px; }
.ship-addr h4 { margin: 0 0 4px; font-size: 13px; text-transform: uppercase; letter-spacing:.08em; color: var(--text-muted); }
.ship-addr p { margin:0; font-size: 13.5px; color: var(--charcoal); }

.empty { text-align:center; padding: 36px 12px; color: var(--text-medium); }
.empty .emoji { font-size: 44px; }
.empty h3 { font-family:'Cormorant Garamond', serif; font-weight:700; font-size:22px; color: var(--charcoal); margin: 8px 0 4px; }
.empty p { margin: 0 0 16px; font-size: 14px; }

.addr-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap:14px; }
.addr-card { background: var(--cream-deep); padding: 16px 18px; border-radius: 12px; font-size: 13.5px; color: var(--text-medium); position:relative; }
.addr-card p { margin: 4px 0; }
.addr-top { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.label-pill { background: var(--dgreen); color:#fff; padding: 2px 10px; border-radius: 50px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing:.05em; }
.default-pill { background: var(--orange); color:#fff; padding: 2px 10px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.addr-actions { display:flex; gap:14px; margin-top: 10px; }
.link-btn { background:none; border:0; color: var(--dgreen); font-weight: 700; cursor:pointer; padding: 0; font-size: 13px; }
.link-btn:hover { text-decoration: underline; }
.link-btn.danger { color: #a44; }

.addr-form { display:flex; flex-direction:column; gap:12px; }
.addr-form label { display:flex; flex-direction:column; gap:5px; font-size:12.5px; font-weight:700; color: var(--text-medium); text-transform: uppercase; letter-spacing:.05em; }
.addr-form input { padding: 11px 14px; border-radius: 10px; border: 1.5px solid #e2e2e2; font-size: 14px; font-family: inherit; text-transform: none; letter-spacing: normal; font-weight: 400; color: var(--charcoal); }
.addr-form input:focus { outline:none; border-color: var(--dgreen); box-shadow: 0 0 0 3px rgba(11,81,50,0.12); }
.addr-form input:disabled { background:#f6f6f6; color:#888; }
.row-2 { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.row-3 { display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
@media (max-width: 600px) { .row-2, .row-3 { grid-template-columns: 1fr; } }
.check { flex-direction: row !important; align-items: center; gap: 8px !important; font-weight:500 !important; text-transform: none !important; letter-spacing: normal !important; font-size: 14px !important; color: var(--charcoal) !important; }
.check input { width: 18px; height: 18px; }
.form-actions { display:flex; gap:10px; justify-content:flex-end; margin-top: 8px; }

.btn-fill { background: linear-gradient(135deg, var(--dgreen), var(--dgreen-2)); color:#fff; border:0; padding: 11px 20px; border-radius:10px; font-weight:700; cursor:pointer; font-size:14px; box-shadow: 0 8px 18px -8px rgba(11,81,50,0.5); transition: transform .15s; font-family: inherit; text-decoration: none; display:inline-block; }
.btn-fill:hover { transform: translateY(-1px); }
.btn-fill:disabled { opacity:.7; cursor:not-allowed; }
.btn-ghost { background:#fff; color: var(--text-medium); border:1.5px solid #e0e0e0; padding: 10px 18px; border-radius:10px; cursor:pointer; font-weight:600; font-size:14px; font-family: inherit; }
.btn-ghost:hover { border-color: var(--dgreen); color: var(--dgreen); }

.skel-wrap { display:flex; flex-direction:column; gap:10px; }
.skel { height: 60px; border-radius:10px; background: linear-gradient(90deg, #f0e7d0 0%, #f8f1dd 50%, #f0e7d0 100%); background-size: 200% 100%; animation: skel 1.4s linear infinite; }
@keyframes skel { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

.msg-info { background:#eef7f0; color: var(--dgreen); border:1px solid #cfe5d6; padding: 10px 12px; border-radius: 8px; font-size: 13px; }
`;