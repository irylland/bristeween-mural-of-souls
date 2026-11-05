import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import champion2025 from "@/assets/champion-2025.webp";
import champion2024 from "@/assets/champion-2024.jpg";
import champion2023 from "@/assets/champion-2023.jpg";
import mystery2025 from "@/assets/mystery-2025.jpg";
import miss2025 from "@/assets/miss-2025.jpg";
import edicoes from "@/assets/edicoes.json";
import { InstagramFeed } from "@/components/InstagramFeed";
import { DonosDoCaldeirao } from "@/components/DonosDoCaldeirao";
import { Parceiros } from "@/components/Parceiros";
import { ParceirosPage } from "@/components/ParceirosPage";
import { Navigation, type NavTab } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";

const LOGO =
  "https://res.cloudinary.com/dkpn35e8m/image/upload/v1784320267/Bristeween_Logo_Final-1_gnn9gq.png";
const VIDEO_DESKTOP =
  "https://res.cloudinary.com/dkpn35e8m/video/upload/v1768865455/Bristeween_qj4bhd.mp4";
const VIDEO_MOBILE =
  "https://res.cloudinary.com/dkpn35e8m/video/upload/v1768867212/Bristeween_celular_hgaqor.mp4";
const PARTY = new Date("2026-11-07T20:30:00-03:00").getTime();

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BristeWeen — Sobrenatural" },
      { name: "description", content: "Contagem regressiva para a festa BristeWeen Sobrenatural." },
      { property: "og:title", content: "BristeWeen — Sobrenatural" },
      {
        property: "og:description",
        content: "Contagem regressiva para a festa BristeWeen Sobrenatural.",
      },
      { property: "og:image", content: LOGO },
      { name: "twitter:image", content: LOGO },
    ],
  }),
  component: Index,
});

type Slide = {
  src: string;
  title: string;
  sub: string;
  year: string;
  icon?: string;
  rating?: string;
  info?: string;
};

function resolveAssetUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("/__l5e/")) {
    return `${LOVABLE_CDN}${src}`;
  }
  return src;
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.max(0, PARTY - (now ?? PARTY));
  const parts = [
    ["Dias", d / 864e5],
    ["Horas", (d / 36e5) % 24],
    ["Min", (d / 6e4) % 60],
    ["Seg", (d / 1e3) % 60],
  ] as const;
  if (now !== null && d === 0)
    return <p className="text-3xl text-primary font-['Creepster']">A festa começou! 👻</p>;
  return (
    <div className="flex items-end justify-center gap-2 sm:gap-5">
      {parts.map(([l, v]) => (
        <div key={l} className="text-center min-w-[3.25rem] sm:min-w-[4.5rem]">
          <div className="text-4xl font-bold tabular-nums text-primary drop-shadow-[0_0_25px_rgba(249,115,22,0.85)] sm:text-6xl md:text-7xl">
            {now === null ? "--" : String(Math.floor(v)).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[9px] uppercase tracking-[0.25em] text-orange-200/70 sm:text-[10px] sm:tracking-[0.3em] font-mono">
            {l}
          </div>
        </div>
      ))}
    </div>
  );
}

function Carousel({
  slides,
  accent = "red",
  delay = 3500,
}: {
  slides: Slide[];
  accent?: "red" | "green" | "purple" | "rose" | boolean;
  delay?: number;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const n = slides.length;

  const at = (k: number) => slides[(i + k + n) % n] as Slide;

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setI((k) => (k + 1) % n), delay);
    return () => clearInterval(t);
  }, [paused, i, n, delay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          setI((k) => (k + 1) % n);
        } else {
          setI((k) => (k - 1 + n) % n);
        }
      }
    }
    touchStartX.current = null;
    setPaused(false);
  };

  const isGreen = accent === "green";
  const isPurple = accent === "purple";
  const isRose = accent === "rose";
  const isRed = accent === "red" || (!isGreen && !isPurple && !isRose);

  const activeBorder = isRose
    ? "border-rose-500/90 shadow-[0_0_45px_rgba(244,63,94,0.7)]"
    : isPurple
      ? "border-purple-500/90 shadow-[0_0_45px_rgba(168,85,247,0.7)]"
      : isGreen
        ? "border-emerald-500/90 shadow-[0_0_45px_rgba(16,185,129,0.7)]"
        : "border-red-500/90 shadow-[0_0_45px_rgba(239,68,68,0.7)]";

  const ambientGlowClass = isRose
    ? "bg-rose-500/60 shadow-[0_0_60px_rgba(244,63,94,0.7)]"
    : isPurple
      ? "bg-purple-500/60 shadow-[0_0_60px_rgba(168,85,247,0.7)]"
      : isGreen
        ? "bg-emerald-500/60 shadow-[0_0_60px_rgba(16,185,129,0.7)]"
        : "bg-red-500/60 shadow-[0_0_60px_rgba(239,68,68,0.7)]";

  const btnStyle = isRose
    ? "border-rose-500/40 text-rose-300 hover:border-rose-400 hover:bg-rose-950/60 shadow-[0_0_15px_rgba(244,63,94,0.25)]"
    : isPurple
      ? "border-purple-500/40 text-purple-300 hover:border-purple-400 hover:bg-purple-950/60 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
      : isGreen
        ? "border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/60 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
        : "border-red-500/40 text-red-300 hover:border-red-400 hover:bg-red-950/60 shadow-[0_0_15px_rgba(239,68,68,0.25)]";

  const counterText = isRose
    ? "text-rose-300 font-mono"
    : isPurple
      ? "text-purple-300 font-mono"
      : isGreen
        ? "text-emerald-300 font-mono"
        : "text-red-300 font-mono";

  const counterBorder = isRose
    ? "border-rose-950/80 bg-black/80"
    : isPurple
      ? "border-purple-950/80 bg-black/80"
      : isGreen
        ? "border-emerald-950/80 bg-black/80"
        : "border-red-950/80 bg-black/80";

  // Offset array for 3D Coverflow perspective [-2, -1, 0, 1, 2]
  const offsets = [-2, -1, 0, 1, 2] as const;

  const card = (s: Slide, pos: -2 | -1 | 0 | 1 | 2) => {
    let positionClass = "";
    if (pos === 0) {
      positionClass = `z-30 scale-100 opacity-100 [transform:rotateY(0deg)] ${activeBorder}`;
    } else if (pos === -1) {
      positionClass = `z-20 scale-[0.88] opacity-70 [transform:rotateY(14deg)_scale(0.92)] border-neutral-700/60 hover:opacity-90 -mr-4 sm:-mr-6`;
    } else if (pos === 1) {
      positionClass = `z-20 scale-[0.88] opacity-70 [transform:rotateY(-14deg)_scale(0.92)] border-neutral-700/60 hover:opacity-90 -ml-4 sm:-ml-6`;
    } else if (pos === -2) {
      positionClass = `z-10 scale-[0.72] opacity-35 [transform:rotateY(25deg)_scale(0.8)] border-neutral-800/40 hidden sm:block -mr-8 sm:-mr-12`;
    } else if (pos === 2) {
      positionClass = `z-10 scale-[0.72] opacity-35 [transform:rotateY(-25deg)_scale(0.8)] border-neutral-800/40 hidden sm:block -ml-8 sm:-ml-12`;
    }

    const hasOverlayText = Boolean(s.title || s.sub);

    return (
      <div key={pos} className="relative shrink-0 overflow-visible">
        {pos === 0 && (
          <div
            aria-hidden="true"
            className={`absolute -inset-4 sm:-inset-6 rounded-3xl blur-2xl opacity-80 pointer-events-none z-0 transition-all duration-500 ${ambientGlowClass}`}
          />
        )}
        <button
          onClick={() => pos !== 0 && setI((i + pos + n) % n)}
          aria-label={pos === 0 ? s.title || "Foto ativa" : pos < 0 ? "Anterior" : "Próximo"}
          className={`relative z-10 w-36 xs:w-44 sm:w-56 shrink-0 overflow-hidden rounded-2xl border bg-neutral-950 transition-all duration-500 ease-out transform-gpu ${positionClass}`}
        >
          <img
            src={resolveAssetUrl(s.src)}
            alt={s.title || `BristeWeen ${s.year}`}
            loading="lazy"
            width={768}
            height={1024}
            className="aspect-[3/4] w-full object-cover"
          />

          {/* Rating Badge or Custom Icon */}
          {s.rating ? (
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-md">
              <span>{s.rating}</span>
              <span className="text-amber-400">★</span>
            </span>
          ) : s.icon ? (
            <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-[12px] backdrop-blur-md border border-white/20">
              {s.icon}
            </span>
          ) : null}

          {/* Subtitle / Title Bar on Active Card (only if title or sub present) */}
          {pos === 0 && hasOverlayText && (
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 pt-10 text-center">
              {s.title && (
                <span className="block text-sm font-bold uppercase tracking-wide text-white drop-shadow">
                  {s.title}
                </span>
              )}
              {s.sub && (
                <span className="mt-0.5 block text-[11px] uppercase tracking-widest text-white/80 font-mono">
                  {s.sub}
                </span>
              )}
            </span>
          )}
        </button>
      </div>
    );
  };

  return (
    <div
      className="relative w-full max-w-full overflow-visible py-2 sm:py-4 [perspective:1000px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 overflow-visible">
        {offsets.map((pos) => n > Math.abs(pos) && card(at(pos), pos))}
      </div>

      {n > 1 && (
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setI((i - 1 + n) % n)}
            aria-label="Anterior"
            className={`flex h-9 w-9 items-center justify-center rounded-full border bg-black/70 transition-all duration-300 active:scale-95 ${btnStyle}`}
          >
            ‹
          </button>

          <div
            className={`flex items-center gap-2 rounded-full border px-4 py-1 backdrop-blur-md ${counterBorder}`}
          >
            <span className={`text-xs font-bold tabular-nums ${counterText}`}>{i + 1}</span>
            <span className="text-xs text-neutral-500">/</span>
            <span className="text-xs font-bold tabular-nums text-neutral-400">{n}</span>
          </div>

          <button
            onClick={() => setI((i + 1) % n)}
            aria-label="Próximo"
            className={`flex h-9 w-9 items-center justify-center rounded-full border bg-black/70 transition-all duration-300 active:scale-95 ${btnStyle}`}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

const YEARS = ["Todos", "2025", "2024", "2023"] as const;

function Gallery() {
  const [yearFilter, setYearFilter] = useState<(typeof YEARS)[number]>("2025");

  // Filter slides based on year or return all photos combined
  const getSlides = (): Slide[] => {
    const rawEdicoes = edicoes as Record<string, string[]>;
    if (yearFilter === "Todos") {
      const all: Slide[] = [];
      ["2025", "2024", "2023"].forEach((y) => {
        const list = rawEdicoes[y] ?? [];
        list.forEach((src, idx) => {
          const ratingVal = (8.5 + ((idx * 7) % 14) * 0.1).toFixed(1);
          all.push({
            src: resolveAssetUrl(src),
            title: "",
            sub: "",
            year: y,
            rating: ratingVal,
          });
        });
      });
      return all;
    }

    const list = rawEdicoes[yearFilter] ?? [];
    return list.map((src, idx) => {
      const ratingVal = (8.5 + ((idx * 7) % 14) * 0.1).toFixed(1);
      return {
        src: resolveAssetUrl(src),
        title: "",
        sub: "",
        year: yearFilter,
        rating: ratingVal,
      };
    });
  };

  const slides = getSlides();

  return (
    <div className="w-full max-w-full overflow-visible py-1 sm:py-2">
      <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-center gap-2 relative z-20">
        <span className="text-xs font-mono text-muted-foreground mr-1">Edições:</span>
        {YEARS.map((y) => (
          <button
            key={y}
            onClick={() => setYearFilter(y)}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold tracking-wider transition-all duration-300 ${
              y === yearFilter
                ? "border-red-500 bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                : "border-neutral-800 bg-black/60 text-neutral-400 hover:border-red-500/50 hover:text-red-200"
            }`}
          >
            {y}
          </button>
        ))}
      </div>
      <Carousel key={yearFilter} slides={slides} accent="red" />
    </div>
  );
}

function Section({
  eyebrow,
  title,
  desc,
  pill,
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  pill?: "red" | "emerald" | "green" | "amber" | "purple" | "rose";
  children: React.ReactNode;
}) {
  return (
    <section className="py-8 sm:py-10 text-center w-full max-w-full overflow-visible">
      {pill === "red" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-950/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-red-300 shadow-[0_0_20px_-5px_rgba(239,68,68,0.3)]">
          <span>🎃</span> {eyebrow}
        </span>
      ) : pill === "emerald" || pill === "green" || pill === "amber" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
          <span>👑</span> {eyebrow}
        </span>
      ) : pill === "purple" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-950/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-purple-300 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]">
          <span>🎁</span> {eyebrow}
        </span>
      ) : pill === "rose" ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-rose-300 shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]">
          <span>♡</span> {eyebrow}
        </span>
      ) : (
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-primary">
          🎃 {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl sm:text-5xl text-foreground px-2">{title}</h2>
      <p className="mx-auto mt-2 sm:mt-3 max-w-md text-xs sm:text-sm text-muted-foreground px-3">
        {desc}
      </p>
      <div className="mt-2 sm:mt-4 w-full max-w-full overflow-visible">{children}</div>
    </section>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between px-4 py-8 select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, rgba(234, 88, 12, 0.08) 0%, rgba(0, 0, 0, 1) 75%)",
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
  const [activeTab, setActiveTab] = useState<NavTab>("ritual");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "ritual" || tab === "parceiros") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tab === "concursos") {
      const el = document.getElementById("hall-dos-imortais");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (tab === "perfil") {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      {stage === "intro" && <IntroScreen onStart={handleStartMission} />}
      {stage === "playing" && (
        <VideoIntro src={videoSrc} onFinish={handleFinishVideo} isFading={isFading} />
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <main
        className={`mx-auto w-full max-w-[1540px] px-3 sm:px-6 lg:px-8 pb-20 overflow-visible no-scrollbar transition-opacity duration-700 ${
          stage === "intro"
            ? "opacity-0 pointer-events-none h-screen overflow-hidden"
            : "opacity-100"
        }`}
      >
        <Navigation
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onReplayIntro={handleReplayIntro}
          onOpenAuth={() => setIsAuthOpen(true)}
        />

        {activeTab === "parceiros" ? (
          <ParceirosPage onBack={() => handleSelectTab("ritual")} />
        ) : (
          <>
            <div id="parceiros-section" className="pt-2">
              <Parceiros />
            </div>

            <header className="relative pb-6 pt-6 sm:pt-10 text-center">
              {/* Ambient Orange Glow behind Logo */}
              <div className="relative mx-auto inline-block">
                <div className="absolute inset-0 rounded-full bg-orange-600/35 blur-3xl scale-125 pointer-events-none" />
                <img
                  src={LOGO}
                  alt="Logo BristeWeen"
                  className="relative z-10 mx-auto mb-6 h-36 w-auto animate-floaty sm:h-44 drop-shadow-[0_0_35px_rgba(249,115,22,0.75)]"
                />
              </div>

              <p className="text-xs uppercase tracking-[0.4em] text-orange-200/80 font-mono">
                07 de novembro · 20:30
              </p>

              {/* Ambient Orange Glow behind Countdown Clock */}
              <div className="relative mt-8">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-28 w-80 sm:w-96 rounded-full bg-orange-600/30 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <Countdown />
                </div>
              </div>
            </header>

            <Section
              eyebrow="Edições passadas"
              title="Galeria do Ritual"
              desc="Registros das noites em que o sobrenatural tomou conta do BristeWeen."
              pill="red"
            >
              <Gallery />
            </Section>

            <div id="hall-dos-imortais">
              <Section
                eyebrow="Hall dos Imortais"
                title="Campeões de Fantasias"
                desc="As almas que conquistaram a glória suprema e o prêmio máximo nas edições do BristeWeen."
                pill="green"
              >
                <Carousel
                  accent="green"
                  slides={[
                    {
                      src: champion2025,
                      title: "Sally e Jack",
                      sub: "por Bianca",
                      year: "2025",
                      icon: "🏆",
                    },
                    {
                      src: champion2024,
                      title: "Turma do Scooby Doo",
                      sub: "por Ericka, Nycole, Vito e Leonardo",
                      year: "2024",
                      icon: "🏆",
                    },
                    {
                      src: champion2023,
                      title: "Motoqueiro Fantasma",
                      sub: "por André Freitas",
                      year: "2023",
                      icon: "🏆",
                    },
                  ]}
                />
              </Section>
            </div>

            <Section
              eyebrow="Segredos Revelados"
              title="Ganhadores das Caixas Mistério"
              desc="As almas corajosas que desvendaram os enigmas sombrios do BristeWeen."
              pill="purple"
            >
              <Carousel
                accent="purple"
                slides={[
                  {
                    src: mystery2025,
                    title: "Caixa Mistério 2025",
                    sub: "Desvendado por Yasmin",
                    year: "2025",
                    icon: "📦",
                  },
                ]}
              />
            </Section>

            <Section
              eyebrow="Charme & Carisma"
              title="Miss Simpatia"
              desc="As presenças mais cativantes que conquistaram os corações do BristeWeen."
              pill="rose"
            >
              <Carousel
                accent="rose"
                slides={[
                  {
                    src: miss2025,
                    title: "Clarice Sebrain",
                    sub: "Miss Simpatia",
                    year: "2025",
                    icon: "❤️",
                  },
                ]}
              />
            </Section>

            <DonosDoCaldeirao />

            <InstagramFeed />
          </>
        )}

        <footer className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
          <p>© BristeWeen 2026 · Sobrenatural</p>
        </footer>
      </main>
    </>
  );
}
