import { useState, useRef, useEffect } from "react";

type Dono = {
  id: string;
  name: string;
  role: string;
  badge: string;
  photo: string;
  description: string;
};

const DONOS: Dono[] = [
  {
    id: "bianca",
    name: "BIANCA",
    role: "BOSS",
    badge: "LÍDER",
    photo: "/donos/bianca.png",
    description:
      "Criadora das fórmulas místicas do BristeWeen, comandante absoluta do caldeirão sobrenatural.",
  },
  {
    id: "gleisson",
    name: "GLEISSON",
    role: "PRODUTOR",
    badge: "LÍDER",
    photo: "/donos/gleisson.jpg",
    description:
      "Mestre da produção e dos rituais, orquestrador por trás dos feitiços e da estrutura do apocalipse.",
  },
];

export function DonosDoCaldeirao() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const active = DONOS[index] as Dono;
  const total = DONOS.length;

  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = (e.touches[0]?.clientX ?? 0);
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diff = touchStartX.current - (e.changedTouches[0]?.clientX ?? 0);
      if (Math.abs(diff) > 35) {
        if (diff > 0) next();
        else prev();
      }
    }
    touchStartX.current = null;
    setPaused(false);
  };

  return (
    <section
      id="donos-do-caldeirao"
      className="py-12 sm:py-16 w-full max-w-full overflow-visible select-none"
    >
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 px-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/50 bg-gradient-to-r from-orange-950/80 via-black to-orange-950/80 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.3em] text-orange-300 shadow-[0_0_25px_-5px_rgba(249,115,22,0.4)] backdrop-blur-md">
          <span className="text-sm animate-pulse">🔥</span>
          <span>DONOS DO CALDEIRÃO</span>
        </span>
        <h2 className="mt-3 text-3xl sm:text-5xl text-foreground font-['Creepster'] tracking-wider drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
          MESTRES DE CERIMÔNIA DO APOCALIPSE
        </h2>
        <p className="mx-auto mt-2 sm:mt-3 max-w-lg text-xs sm:text-sm text-neutral-400 px-3 font-mono leading-relaxed">
          As mentes e espíritos que comandam e orquestram a noite mais macabra do ano.
        </p>
      </div>

      {/* Main Card Chamber Container (Constrained width to max-w-4xl for compact, stylish proportion) */}
      <div
        className="relative mx-auto w-full max-w-4xl rounded-3xl border border-orange-500/40 bg-gradient-to-b from-[#140b08] via-[#0a0504] to-black p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(249,115,22,0.35)] overflow-hidden backdrop-blur-xl transition-all duration-300"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Ambient atmospheric glows */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-red-600/15 blur-[100px] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Info & Owner Controls */}
          <div className="lg:col-span-6 flex flex-col justify-center gap-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-400/90 font-mono">
              <span className="text-base">🍵</span>
              <span>DONOS DO CALDEIRÃO</span>
            </div>

            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans font-medium">
              Junte-se a nós para a noite mais fantástica e macabra de todas no BristeWeen! Os
              mestres do Caldeirão preparam poções lendárias.
            </p>

            {/* Interactive Owner Switcher Tabs */}
            <div className="flex flex-col gap-3 pt-2">
              {DONOS.map((dono, idx) => {
                const isActive = idx === index;
                return (
                  <button
                    key={dono.id}
                    onClick={() => setIndex(idx)}
                    className={`group relative flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                      isActive
                        ? "border-orange-500/80 bg-gradient-to-r from-orange-950/60 via-black to-orange-950/30 shadow-[0_0_25px_rgba(249,115,22,0.3)] scale-[1.02]"
                        : "border-neutral-800/80 bg-black/40 text-neutral-400 hover:border-orange-500/40 hover:bg-neutral-950/60 hover:text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition-all duration-300 ${
                          isActive
                            ? "border-orange-400 bg-orange-600/20 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                            : "border-neutral-800 bg-neutral-900/60 text-neutral-500 group-hover:border-neutral-700"
                        }`}
                      >
                        🔥
                      </div>
                      <div>
                        <span className="block text-[11px] font-extrabold uppercase tracking-widest text-orange-400 font-mono">
                          {dono.role}
                        </span>
                        <span className="block text-base font-bold text-white tracking-wide font-['Creepster']">
                          {dono.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                          isActive
                            ? "bg-orange-600 text-black border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                            : "bg-neutral-900 text-neutral-500 border-neutral-800"
                        }`}
                      >
                        {idx + 1} DE {total}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: 3D Stacked Owner Photo Cards */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center pt-4 lg:pt-0">
            <div
              className="relative w-64 xs:w-72 sm:w-80 aspect-[3/4] flex items-center justify-center [perspective:1000px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {DONOS.map((dono, idx) => {
                const isActive = idx === index;
                const isNext = idx === (index + 1) % total;

                let cardTransform = "";
                if (isActive) {
                  cardTransform =
                    "z-30 scale-100 opacity-100 [transform:rotateY(0deg)] border-orange-500/80 shadow-[0_0_45px_rgba(249,115,22,0.4)]";
                } else if (isNext) {
                  cardTransform =
                    "z-10 scale-90 opacity-40 [transform:rotateY(16deg)_translateX(20px)] border-neutral-800 pointer-events-auto hover:opacity-60 cursor-pointer";
                } else {
                  cardTransform =
                    "z-10 scale-90 opacity-40 [transform:rotateY(-16deg)_translateX(-20px)] border-neutral-800 pointer-events-auto hover:opacity-60 cursor-pointer";
                }

                return (
                  <div
                    key={dono.id}
                    onClick={() => !isActive && setIndex(idx)}
                    className={`absolute inset-0 rounded-2xl border-2 bg-neutral-950 overflow-hidden transition-all duration-700 ease-out transform-gpu ${cardTransform}`}
                  >
                    <img
                      src={dono.photo}
                      alt={dono.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {/* Top Right Gold Badge (LÍDER) */}
                    {isActive && (
                      <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-500 to-amber-300 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(251,191,36,0.7)] backdrop-blur-md">
                        <span>★</span>
                        <span>{dono.badge}</span>
                      </div>
                    )}

                    {/* Bottom Dark Gradient Overlay */}
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent p-5 pt-14 text-center">
                        <span className="block text-xs font-extrabold uppercase tracking-[0.3em] text-orange-400 font-mono">
                          {dono.role}
                        </span>
                        <h3 className="mt-0.5 text-2xl sm:text-3xl font-['Creepster'] tracking-widest text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                          {dono.name}
                        </h3>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={prev}
                aria-label="Anterior"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/40 bg-black/80 text-orange-300 transition-all duration-300 hover:border-orange-400 hover:bg-orange-950 hover:text-white active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
              >
                ‹
              </button>

              <div className="flex items-center gap-2 rounded-full border border-orange-950/80 bg-black/90 px-4 py-1.5 backdrop-blur-md shadow-inner">
                <span className="text-xs font-bold tabular-nums text-orange-400 font-mono">
                  {index + 1}
                </span>
                <span className="text-xs text-neutral-600 font-mono">/</span>
                <span className="text-xs font-bold tabular-nums text-neutral-400 font-mono">
                  {total}
                </span>
              </div>

              <button
                onClick={next}
                aria-label="Próximo"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/40 bg-black/80 text-orange-300 transition-all duration-300 hover:border-orange-400 hover:bg-orange-950 hover:text-white active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
