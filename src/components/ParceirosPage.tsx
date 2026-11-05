import { Store, ExternalLink, Sparkles, ShieldCheck } from "lucide-react";

type PartnerDetail = {
  name: string;
  fullName: string;
  url: string;
  logo: string;
  bg?: string;
  category: string;
  description: string;
};

const PARTNERS_DETAILS: PartnerDetail[] = [
  {
    name: "PRINCIPIA",
    fullName: "Principia Skincare",
    url: "https://www.instagram.com/principiaskincare",
    logo: "/parceiros/principia.jpg",
    bg: "bg-black",
    category: "Skincare & Ciência",
    description:
      "Cosméticos de alta performance baseados em evidências científicas para cuidados avançados com a pele.",
  },
  {
    name: "BETH GIRL MACEIÓ",
    fullName: "Beth Girl Maceió (AL)",
    url: "https://www.instagram.com/bethgirl_alagoas/",
    logo: "/parceiros/bethgirl.png",
    bg: "bg-[#e20074]",
    category: "Maquiagens & Acessórios",
    description: "Maquiagens, acessórios e novidades.",
  },
  {
    name: "SLUG",
    fullName: "Slug Maquiagem de Terror",
    url: "https://maquiagemdeterror.com/",
    logo: "/parceiros/slug.png",
    bg: "bg-black",
    category: "Efeitos Especiais & Halloween",
    description:
      "Referência absoluta em próteses, sangue artificial e maquiagem profissional de terror e Halloween.",
  },
  {
    name: "FÁBRICA GRAVATÁ",
    fullName: "Fábrica de Alimentos Gravatá",
    url: "https://fabricadealimentos.com.br/",
    logo: "/parceiros/gravata.png",
    bg: "bg-white",
    category: "Gastronomia & Tradição",
    description: "Alimentos e iguarias tradicionais de excelência desde 1971.",
  },
  {
    name: "NAZCA",
    fullName: "Nazca Cosméticos",
    url: "https://www.instagram.com/nazcacosmeticos/",
    logo: "/parceiros/nazca.png",
    bg: "bg-[#a31d45]",
    category: "Beleza & Cabelos",
    description: "Produtos inovadores para tratamento capilar e beleza que realçam a sua essência.",
  },
];

export function ParceirosPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in select-none">
      {/* Header Banner */}
      <div className="relative rounded-3xl border border-orange-500/40 bg-gradient-to-b from-[#180d08] via-[#0b0604] to-black p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(249,115,22,0.25)] overflow-hidden mb-10">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-orange-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-red-600/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/50 bg-orange-950/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.4)] mb-4">
            <Store className="w-4 h-4 text-orange-400" />
            <span>ALIANÇA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-['Creepster'] text-white tracking-wider drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]">
            MARCAS PARCEIRAS DO BRISTEWEEN
          </h1>

          <p className="mt-3 max-w-2xl text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">
            Conheça os mestres e marcas oficiais que apoiam e tornam possível o evento BristeWeen.
          </p>

          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-500/60 bg-black/80 px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-widest text-orange-300 transition-all duration-300 hover:border-orange-400 hover:bg-orange-950 hover:text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] active:scale-95"
          >
            <span>← Voltar ao Ritual</span>
          </button>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PARTNERS_DETAILS.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800 bg-black/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-orange-500/80 hover:bg-gradient-to-b hover:from-orange-950/30 hover:to-black hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:-translate-y-1"
          >
            <div>
              {/* Top Row: Logo & Category Badge */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div
                  className={`flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 p-2.5 shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 ${partner.bg}`}
                >
                  <img
                    src={partner.logo}
                    alt={partner.fullName}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-950/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300 font-mono">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Oficial</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono text-neutral-400 text-right">
                    {partner.category}
                  </span>
                </div>
              </div>

              {/* Partner Name & Full Title */}
              <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-orange-300 transition-colors">
                {partner.fullName}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                {partner.description}
              </p>
            </div>

            {/* Bottom Visit Button */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 group-hover:text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Parceiro Verificado</span>
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 group-hover:text-orange-300">
                <span>Visitar Site</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
