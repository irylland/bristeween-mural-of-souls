import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import edicoes from "@/assets/edicoes.json";

const LOGO = "https://res.cloudinary.com/dkpn35e8m/image/upload/v1784320267/Bristeween_Logo_Final-1_gnn9gq.png";
const VIDEO_DESKTOP = "https://res.cloudinary.com/dkpn35e8m/video/upload/v1768865455/Bristeween_qj4bhd.mp4";
const VIDEO_MOBILE = "https://res.cloudinary.com/dkpn35e8m/video/upload/v1768867212/Bristeween_celular_hgaqor.mp4";
const PARTY = new Date("2026-11-07T22:30:00-03:00").getTime();

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
type Slide = { src: string; title: string; sub: string; year: string };

const input = "w-full rounded-lg border border-input bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const btn = "w-full rounded-lg bg-primary px-4 py-3 font-bold text-primary-foreground glow transition hover:brightness-110 disabled:opacity-50";

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const d = Math.max(0, PARTY - (now ?? PARTY));
  const parts = [["Dias", d / 864e5], ["Horas", (d / 36e5) % 24], ["Min", (d / 6e4) % 60], ["Seg", (d / 1e3) % 60]] as const;
  if (now !== null && d === 0) return <p className="text-3xl text-primary" style={{ fontFamily: "Creepster" }}>A festa começou! 👻</p>;
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-5">
      {parts.map(([l, v]) => (
        <div key={l} className="text-center">
          <div className="text-5xl font-bold tabular-nums text-primary drop-shadow-[0_0_18px] drop-shadow-primary/40 sm:text-7xl">
            {now === null ? "--" : String(Math.floor(v)).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{l}</div>
        </div>
      ))}
    </div>
  );
}

function Carousel({ slides, accent, delay = 3500 }: { slides: Slide[]; accent?: boolean; delay?: number }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length;
  const at = (k: number) => slides[(i + k + n) % n] as Slide;
  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setI((k) => (k + 1) % n), delay);
    return () => clearInterval(t);
  }, [paused, i, n, delay]);
  const card = (s: Slide, pos: -1 | 0 | 1) => (
    <button
      key={pos}
      onClick={() => pos !== 0 && setI((i + pos + n) % n)}
      aria-label={pos === 0 ? s.title : pos === -1 ? "Anterior" : "Próximo"}
      className={`relative w-44 shrink-0 overflow-hidden rounded-2xl border transition-all duration-500 sm:w-56 ${
        pos === 0
          ? `z-10 scale-100 opacity-100 ${accent ? "border-accent/60 shadow-[0_0_50px_-10px] shadow-accent/40" : "border-primary/60 shadow-[0_0_50px_-10px] shadow-primary/40"}`
          : `scale-90 opacity-40 hover:opacity-70 ${pos === -1 ? "-rotate-6" : "rotate-6"} border-border`
      }`}
    >
      <img src={s.src} alt={s.title} loading="lazy" width={768} height={1024} className="aspect-[3/4] w-full object-cover" />
      <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${accent ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>{s.year}</span>
      {pos === 0 && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8 text-left">
          <span className="block text-sm font-bold uppercase tracking-wide text-white">{s.title}</span>
          <span className="block text-[11px] uppercase tracking-widest text-white/70">{s.sub}</span>
        </span>
      )}
    </button>
  );
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        {n > 1 && card(at(-1), -1)}
        {card(at(0), 0)}
        {n > 1 && card(at(1), 1)}
      </div>
      {n > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button onClick={() => setI((i - 1 + n) % n)} aria-label="Anterior" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary">‹</button>
          {n > 12 ? (
            <span className="text-xs font-bold tabular-nums text-muted-foreground">{i + 1} / {n}</span>
          ) : (
            <div className="flex gap-1.5">
              {slides.map((_, k) => (
                <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? `w-5 ${accent ? "bg-accent" : "bg-primary"}` : "w-1.5 bg-muted"}`} />
              ))}
            </div>
          )}
          <button onClick={() => setI((i + 1) % n)} aria-label="Próximo" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary">›</button>
        </div>
      )}
    </div>
  );
}

const YEARS = ["2025", "2024", "2023"] as const;
function Gallery() {
  const [year, setYear] = useState<(typeof YEARS)[number]>("2025");
  const urls = (edicoes as Record<string, string[]>)[year] ?? [];
  return (
    <div>
      <div className="mb-6 flex justify-center gap-2">
        {YEARS.map((y) => (
          <button key={y} onClick={() => setYear(y)} className={`rounded-full border px-4 py-1.5 text-xs font-bold tracking-wider transition ${y === year ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>{y}</button>
        ))}
      </div>
      <Carousel key={year} slides={urls.map((src, k) => ({ src, title: `BristeWeen ${year}`, sub: `Foto ${k + 1}`, year }))} />
    </div>
  );
}

function Section({ eyebrow, title, desc, children }: { eyebrow: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="py-14 text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-primary">🎃 {eyebrow}</p>
      <h2 className="mt-2 text-4xl text-foreground sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">{desc}</p>
      <div className="mt-8">{children}</div>
    </section>
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
    <section className="rounded-2xl border border-border bg-card p-6 text-left">
      <h2 className="text-3xl text-primary">Confirme sua presença</h2>
      <p className="mb-4 text-sm text-muted-foreground">{count} {count === 1 ? "alma confirmada" : "almas confirmadas"}</p>
      {done ? <p className="text-primary">🎃 Presença confirmada, {name}! Te esperamos no além.</p> : (
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
    <section className="rounded-2xl border border-border bg-card p-6 text-left">
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

const SOCIALS = [
  { icon: "📸", name: "Instagram", handle: "@bristeween", desc: "Acompanhe as publicações diretamente pelo Instagram oficial.", cta: "Ver no Instagram", href: "https://instagram.com" },
  { icon: "🎵", name: "TikTok", handle: "@bristeween", desc: "Assista aos nossos vídeos do ritual diretamente pelo TikTok.", cta: "Ver no TikTok", href: "https://tiktok.com" },
  { icon: "▶️", name: "YouTube", handle: "BristeWeen", desc: "Assista aos lançamentos e rituais passados na alta definição.", cta: "Ver no YouTube", href: "https://youtube.com" },
  { icon: "🎧", name: "Spotify", handle: "BristeWeen 2026", desc: "Sintonize na trilha sonora do nosso macabro no Spotify.", cta: "Ouvir playlist", href: "https://spotify.com" },
];

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden"
      style={{
        background: "radial-gradient(circle at center, rgba(234, 88, 12, 0.08) 0%, rgba(0, 0, 0, 1) 75%)",
        backgroundColor: "#000000",
      }}
    >
      {/* Top spacer */}
      <div className="h-6 w-full" />

      {/* Center content */}
      <div className="flex flex-col items-center text-center">
        {/* Circular Emblem */}
        <div className="relative flex items-center justify-center">
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-orange-600/15 blur-2xl" />

          {/* Outer ring */}
          <div className="relative flex h-64 w-64 sm:h-80 sm:w-80 items-center justify-center rounded-full border border-orange-500/25 bg-[#0b0806] shadow-[0_0_60px_-10px_rgba(234,88,12,0.3)]">
            {/* Inner concentric ring */}
            <div className="absolute inset-2.5 sm:inset-3 rounded-full border border-orange-500/15 pointer-events-none" />

            {/* Logo */}
            <img
              src={LOGO}
              alt="BristeWeen"
              className="relative z-10 w-44 sm:w-56 object-contain drop-shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Year */}
        <p className="mt-8 sm:mt-10 text-xs sm:text-sm font-semibold tracking-[0.6em] text-orange-200/70 uppercase">
          2 0 2 6
        </p>

        {/* Call to action */}
        <button
          onClick={onStart}
          className="group mt-4 flex items-center gap-3 rounded-full px-6 sm:px-8 py-3.5 font-bold tracking-[0.3em] uppercase text-[#ffd5b8] transition-all duration-300 hover:scale-105 hover:text-white focus:outline-none"
          style={{
            textShadow: "0 0 16px rgba(251, 146, 60, 0.8), 0 0 32px rgba(249, 115, 22, 0.4)",
          }}
        >
          <span className="text-lg sm:text-xl text-orange-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(251,146,60,0.9)]">
            ✦
          </span>
          <span className="text-sm sm:text-base tracking-[0.35em] font-extrabold">
            INICIAR MISSÃO
          </span>
          <span className="text-lg sm:text-xl text-orange-300 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 drop-shadow-[0_0_10px_rgba(251,146,60,0.9)]">
            ✧
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="pb-2 text-center text-[10px] sm:text-xs uppercase tracking-[0.35em] text-neutral-500/70 font-medium">
        🕯️ BRISTEWEEN ©
      </footer>
    </div>
  );
}

function VideoIntro({
  src,
  onFinish,
  isFading,
}: {
  src: string;
  onFinish: () => void;
  isFading: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay with sound prevented, playing muted:", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(console.error);
        }
      });
    }
  }, [src]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <button
        onClick={onFinish}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-md transition-all duration-300 hover:border-orange-500/60 hover:bg-black/90 hover:text-white hover:scale-105"
      >
        <span>Pular</span>
        <span className="text-xs">⏭️</span>
      </button>

      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        onEnded={onFinish}
        onError={onFinish}
        className="h-full w-full object-contain sm:object-cover bg-black"
      />
    </div>
  );
}

function Index() {
  const [stage, setStage] = useState<"intro" | "playing" | "done">("intro");
  const [videoSrc, setVideoSrc] = useState(VIDEO_DESKTOP);
  const [isFading, setIsFading] = useState(false);

  const handleStartMission = () => {
    const isMobile = window.innerWidth < 768;
    setVideoSrc(isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP);
    setStage("playing");
  };

  const handleFinishVideo = () => {
    setIsFading(true);
    setTimeout(() => {
      setStage("done");
      setIsFading(false);
    }, 600);
  };

  const handleReplayIntro = () => {
    const isMobile = window.innerWidth < 768;
    setVideoSrc(isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP);
    setStage("playing");
  };

  return (
    <>
      {stage === "intro" && <IntroScreen onStart={handleStartMission} />}
      {stage === "playing" && (
        <VideoIntro src={videoSrc} onFinish={handleFinishVideo} isFading={isFading} />
      )}

      <main
        className={`mx-auto max-w-5xl px-4 pb-20 transition-opacity duration-700 ${
          stage === "intro" ? "opacity-0 pointer-events-none h-screen overflow-hidden" : "opacity-100"
        }`}
      >
        <header className="pb-8 pt-12 text-center">
          <img src={LOGO} alt="Logo BristeWeen" className="mx-auto mb-6 h-36 w-auto animate-floaty sm:h-44" />
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">07 de novembro · 22h30</p>
          <div className="mt-8"><Countdown /></div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReplayIntro}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary/80 transition hover:border-primary hover:bg-card hover:text-primary hover:scale-105"
            >
              <span>🎬 Rever Vídeo de Entrada</span>
            </button>
          </div>
        </header>

      <Section eyebrow="Edições passadas" title="Galeria do Ritual" desc="Registros das noites em que o sobrenatural tomou conta do BristeWeen.">
        <Gallery />
      </Section>


      <Section eyebrow="Hall dos horrores" title="Campeões de Fantasias" desc="As almas que conquistaram a noite sombria e o prêmio máximo das edições do BristeWeen.">
        <Carousel slides={[
          { src: gallery2, title: "Casal Sombrio", sub: "Campeões 2025", year: "2025" },
          { src: gallery1, title: "Ghostface", sub: "Campeão 2024", year: "2024" },
        ]} />
      </Section>

      <Section eyebrow="Surpresas ocultas" title="Ganhadores das Caixas Mistério" desc="As almas sortudas que desvendaram o mistério sombrio do BristeWeen.">
        <Carousel accent slides={[
          { src: gallery3, title: "Caixa Mistério 2025", sub: "Ganhadora da noite", year: "2025" },
        ]} />
      </Section>

      <Section eyebrow="Charme & carisma" title="Miss Simpatia" desc="As presenças mais cativantes que conquistaram os corações do BristeWeen.">
        <Carousel accent slides={[
          { src: gallery4, title: "Bruxa da Noite", sub: "Miss Simpatia 2025", year: "2025" },
        ]} />
      </Section>

      <section className="py-14">
        <div className="grid gap-6 md:grid-cols-2"><Rsvp /><Mural /></div>
      </section>

      <section className="py-14">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.35em] text-primary">📡 Sinais do além</p>
        <h2 className="mt-2 text-center text-4xl text-foreground sm:text-5xl">Siga o Ritual</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOCIALS.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="group rounded-2xl border border-border bg-card p-5 text-center transition hover:border-primary/60 hover:shadow-[0_0_40px_-15px] hover:shadow-primary/40">
              <div className="text-3xl">{s.icon}</div>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">{s.name}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{s.handle}</p>
              <p className="mt-2 text-xs text-muted-foreground">{s.desc}</p>
              <span className="mt-4 inline-block rounded-lg border border-primary/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">{s.cta}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
        <p>© BristeWeen 2026 · Sobrenatural</p>
      </footer>
    </main>
    </>
  );
}
