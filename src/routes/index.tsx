import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

const LOGO = "https://res.cloudinary.com/dkpn35e8m/image/upload/v1784320267/Bristeween_Logo_Final-1_gnn9gq.png";
const PARTY = new Date("2026-11-07T00:00:00-03:00").getTime();

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BristeWeen — Sobrenatural" },
      { name: "description", content: "Contagem regressiva para a festa BristeWeen. Confirme presença e deixe sua mensagem no Mural de Almas!" },
      { property: "og:title", content: "BristeWeen — Sobrenatural" },
      { property: "og:description", content: "Confirme presença e deixe sua mensagem assustadora no Mural de Almas!" },
      { property: "og:image", content: LOGO },
      { name: "twitter:image", content: LOGO },
    ],
  }),
  component: Index,
});

type Soul = { id: string; name: string; message: string; created_at: string };
const input = "w-full rounded-lg border border-input bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const btn = "w-full rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground glow transition hover:brightness-110 disabled:opacity-50";

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const d = Math.max(0, PARTY - (now ?? PARTY));
  const parts = [["Dias", d / 864e5], ["Horas", (d / 36e5) % 24], ["Min", (d / 6e4) % 60], ["Seg", (d / 1e3) % 60]] as const;
  if (now !== null && d === 0) return <p className="text-3xl text-accent" style={{ fontFamily: "Creepster" }}>A festa começou! 👻</p>;
  return (
    <div className="grid grid-cols-4 gap-3">
      {parts.map(([l, v]) => (
        <div key={l} className="rounded-xl border border-border bg-card p-3 text-center">
          <div className="text-3xl font-bold text-primary sm:text-5xl">{now === null ? "--" : String(Math.floor(v)).padStart(2, "0")}</div>
          <div className="text-xs uppercase text-muted-foreground">{l}</div>
        </div>
      ))}
    </div>
  );
}

function Rsvp() {
  const [name, setName] = useState(""); const [guests, setGuests] = useState(1); const [costume, setCostume] = useState("");
  const [count, setCount] = useState(0); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  const load = async () => { const { data } = await supabase.from("rsvps").select("guests"); setCount((data ?? []).reduce((a, r) => a + r.guests, 0)); };
  useEffect(() => { load(); }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); if (!name.trim()) return; setBusy(true);
    const { error } = await supabase.from("rsvps").insert({ name: name.trim(), guests, costume: costume.trim() || null });
    setBusy(false); if (!error) { setDone(true); load(); }
  }
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-3xl text-primary">Confirme sua presença</h2>
      <p className="mb-4 text-sm text-muted-foreground">{count} {count === 1 ? "alma confirmada" : "almas confirmadas"}</p>
      {done ? <p className="text-accent">🎃 Presença confirmada, {name}! Te esperamos no além.</p> : (
        <form onSubmit={submit} className="space-y-3">
          <input className={input} placeholder="Seu nome" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} required />
          <input className={input} type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} aria-label="Quantidade de pessoas" />
          <input className={input} placeholder="Sua fantasia (opcional)" maxLength={120} value={costume} onChange={(e) => setCostume(e.target.value)} />
          <button className={btn} disabled={busy}>Confirmar 🕯️</button>
        </form>
      )}
    </section>
  );
}

function Mural() {
  const [souls, setSouls] = useState<Soul[]>([]); const [name, setName] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const load = async () => { const { data } = await supabase.from("souls").select("*").order("created_at", { ascending: false }).limit(100); setSouls(data ?? []); };
  useEffect(() => { load(); }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); if (!name.trim() || !msg.trim()) return; setBusy(true);
    const { error } = await supabase.from("souls").insert({ name: name.trim(), message: msg.trim() });
    setBusy(false); if (!error) { setMsg(""); load(); }
  }
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-3xl text-accent">Mural de Almas</h2>
      <form onSubmit={submit} className="my-4 space-y-3">
        <input className={input} placeholder="Seu nome" maxLength={60} value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea className={input} placeholder="Deixe sua mensagem assustadora..." maxLength={280} rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} required />
        <button className={btn} disabled={busy}>Assombrar o mural 👻</button>
      </form>
      <ul className="max-h-96 space-y-3 overflow-y-auto">
        {souls.length === 0 && <li className="text-sm text-muted-foreground">Nenhuma alma por aqui ainda...</li>}
        {souls.map((s) => (
          <li key={s.id} className="rounded-lg bg-secondary p-3">
            <p className="text-secondary-foreground">{s.message}</p>
            <p className="mt-1 text-xs text-muted-foreground">— {s.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Index() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-10 text-center">
        <img src={LOGO} alt="Logo BristeWeen" className="mx-auto mb-4 h-40 w-auto animate-floaty" />
        <h1 className="text-6xl text-primary sm:text-7xl">BristeWeen</h1>
        <p className="mt-2 text-muted-foreground">Sobrenatural · 07 de novembro de 2026</p>
      </header>
      <div className="mx-auto mb-12 max-w-xl"><Countdown /></div>
      <div className="grid gap-6 md:grid-cols-2"><Rsvp /><Mural /></div>
    </main>
  );
}
