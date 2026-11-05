import { Store } from "lucide-react";

type Partner = {
  name: string;
  url: string;
  logo: string;
  bg?: string;
};

const PARTNERS: Partner[] = [
  {
    name: "PRINCIPIA",
    url: "https://www.instagram.com/principiaskincare",
    logo: "/parceiros/principia.jpg",
    bg: "bg-black",
  },
  {
    name: "BETH GIRL ALAGOAS",
    url: "https://www.instagram.com/bethgirl_alagoas/",
    logo: "/parceiros/bethgirl.png",
    bg: "bg-[#e20074]",
  },
  {
    name: "Slug Maquiagem...",
    url: "https://maquiagemdeterror.com/",
    logo: "/parceiros/slug.png",
    bg: "bg-black",
  },
  {
    name: "Fabrica de Ali...",
    url: "https://fabricadealimentos.com.br/",
    logo: "/parceiros/gravata.png",
    bg: "bg-white",
  },
  {
    name: "NAZCA",
    url: "https://www.instagram.com/nazcacosmeticos/",
    logo: "/parceiros/nazca.png",
    bg: "bg-[#a31d45]",
  },
];

export function Parceiros() {
  // Duplicate array 3 times for a seamless, balanced infinite loop
  const marqueeList = [...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="relative w-full max-w-full overflow-hidden pt-4 pb-2 select-none bg-transparent">
      {/* Section Header */}
      <div className="text-center mb-3.5">
        <div className="inline-flex items-center gap-2">
          <Store className="w-5 h-5 text-amber-500 stroke-[2.2]" />
          <span className="font-['Creepster'] text-lg sm:text-xl tracking-[0.22em] text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            PARCEIROS
          </span>
        </div>
      </div>

      {/* Infinite Horizontal Rolling Ticker Container with smooth CSS mask-image fade */}
      <div className="relative w-full max-w-4xl sm:max-w-5xl mx-auto overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent_0%,black_36px,black_calc(100%-36px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_36px,black_calc(100%-36px),transparent_100%)]">
        <div className="flex animate-marquee hover:[animation-play-state:paused] items-center gap-4 sm:gap-6 w-max">
          {marqueeList.map((item, idx) => (
            <a
              key={`${item.name}-${idx}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visitar ${item.name}`}
              className="group flex flex-col items-center gap-1.5 shrink-0 transition-transform duration-300 hover:scale-105 focus:outline-none"
            >
              {/* Logo Card Box */}
              <div
                className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-amber-950/40 p-2 shadow-md transition-all duration-300 group-hover:border-amber-500/60 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] overflow-hidden ${item.bg}`}
              >
                <img
                  src={item.logo}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Partner Name Subtitle */}
              <span className="max-w-[85px] sm:max-w-[105px] truncate text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-white transition-colors group-hover:text-amber-400 font-sans text-center">
                {item.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Tapered Needle Gray Divider Line */}
      <div className="mx-auto mt-4 sm:mt-5 h-[1px] w-full max-w-xl sm:max-w-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
