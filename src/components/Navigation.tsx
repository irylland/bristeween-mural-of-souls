import { Home, User, Trophy, Store, RotateCcw, Settings } from "lucide-react";

export type NavTab = "ritual" | "perfil" | "concursos" | "parceiros";

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onReplayIntro?: () => void;
  onOpenAuth?: () => void;
}

export function Navigation({ activeTab, onSelectTab, onReplayIntro, onOpenAuth }: NavigationProps) {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "ritual", label: "RITUAL", icon: <Home className="w-4 h-4 shrink-0" /> },
    { id: "perfil", label: "MEU PERFIL", icon: <User className="w-4 h-4 shrink-0" /> },
    { id: "concursos", label: "CONCURSOS", icon: <Trophy className="w-4 h-4 shrink-0" /> },
    { id: "parceiros", label: "PARCEIROS", icon: <Store className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <nav className="relative z-30 mx-auto w-full max-w-4xl px-2 pt-4 pb-2">
      <div className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-3 rounded-2xl border border-white/10 bg-black/60 p-2 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-x-auto no-scrollbar">
        {/* Navigation Tabs */}
        <div className="flex flex-nowrap items-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                title={tab.label}
                aria-label={tab.label}
                className={`flex items-center justify-center sm:justify-start gap-2 rounded-xl p-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "border border-orange-500/80 bg-gradient-to-r from-orange-950/80 via-black to-orange-950/80 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-[1.02]"
                    : "border border-transparent text-neutral-300 hover:border-neutral-800 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                      : "text-neutral-400"
                  }
                >
                  {tab.icon}
                </span>
                <span className="hidden sm:inline font-mono">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vertical Separator */}
        <div className="hidden sm:block h-6 w-px bg-neutral-800/80 mx-1 shrink-0" />

        {/* Right Side Action Buttons */}
        <div className="flex flex-nowrap items-center gap-1 sm:gap-2 shrink-0">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              aria-label="Rever Vídeo de Entrada"
              title="Rever Vídeo de Entrada"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-black/70 text-neutral-300 transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-950/40 hover:text-orange-300 active:scale-95 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              if (onOpenAuth) onOpenAuth();
              else onSelectTab("perfil");
            }}
            aria-label="Configurações do Perfil e Login"
            title="Meu Perfil / Login"
            className="flex h-9 w-9 sm:w-auto sm:px-2.5 items-center justify-center sm:justify-start gap-1.5 rounded-xl border border-neutral-800 bg-black/70 text-neutral-300 transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-950/40 hover:text-orange-300 active:scale-95 shrink-0"
          >
            <User className="w-4 h-4 text-orange-400 shrink-0" />
            <Settings className="hidden sm:inline w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </button>
        </div>
      </div>
    </nav>
  );
}
