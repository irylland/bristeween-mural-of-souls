import { useEffect } from "react";

const LOGO =
  "https://res.cloudinary.com/dkpn35e8m/image/upload/v1784320267/Bristeween_Logo_Final-1_gnn9gq.png";

export function InstagramFeed() {
  useEffect(() => {
    // Dynamic loading & execution of TikTok embed script
    const scriptSrc = "https://www.tiktok.com/embed.js";
    const existing = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existing) {
      existing.remove();
    }
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
      // TikTok embed script automatically initializes on load
    };
    document.body.appendChild(script);

    return () => {
      // Script cleanup
    };
  }, []);

  return (
    <section
      id="social-feeds-section"
      className="py-12 sm:py-14 select-none w-full max-w-full overflow-hidden"
    >
      <div className="text-center mb-8 px-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-primary">
          📡 Sinais do além
        </p>
        <h2 className="mt-2 text-3xl sm:text-5xl text-foreground tracking-wide">Siga o Ritual</h2>
        <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted-foreground px-3">
          Acompanhe todas as transmissões e frequências sobrenaturais do BristeWeen.
        </p>
      </div>

      {/* 4 Cards in 3x4 aspect ratio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch w-full max-w-full">
        {/* Card 1: Instagram */}
        <article className="group relative flex flex-col justify-between w-full overflow-hidden rounded-2xl border border-fuchsia-500/30 bg-[#0d070f] p-4 shadow-[0_0_25px_-10px_rgba(217,70,239,0.2)] transition-all duration-300 hover:border-fuchsia-500/70 hover:shadow-[0_0_35px_-5px_rgba(217,70,239,0.35)]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-fuchsia-950/80">
              <div className="flex items-center gap-2">
                <span className="text-base">📷</span>
                <span className="font-['Creepster'] text-lg tracking-wider text-fuchsia-300 uppercase">
                  Instagram
                </span>
              </div>
              <a
                href="https://www.instagram.com/bristeween/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-fuchsia-400/80 transition-colors duration-200 hover:text-fuchsia-200"
              >
                @bristeween ↗
              </a>
            </div>

            {/* Embed Container in 3x4 ratio */}
            <div className="mt-3 relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black/80 border border-fuchsia-950/60 shadow-inner flex items-center justify-center">
              <iframe
                src="https://www.instagram.com/bristeween/embed/"
                title="Perfil Oficial BristeWeen no Instagram"
                className="h-full w-full border-0 block"
                scrolling="no"
              />
            </div>

            {/* Description */}
            <p className="mt-3 px-1 text-center text-[11px] text-neutral-300/90 leading-relaxed min-h-[2.2rem] flex items-center justify-center font-mono">
              Acompanhe nossas publicações diretamente pelo Instagram oficial.
            </p>
          </div>

          {/* Button CTA */}
          <div className="mt-3 pt-1">
            <a
              href="https://www.instagram.com/bristeween/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-fuchsia-500/40 bg-fuchsia-950/20 py-2.5 px-3 text-[11px] font-bold uppercase tracking-widest text-fuchsia-200 transition-all duration-300 hover:bg-fuchsia-900/50 hover:border-fuchsia-400 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(217,70,239,0.3)]"
            >
              <span>📷</span>
              <span>Ver no Instagram</span>
            </a>
          </div>
        </article>

        {/* Card 2: TikTok */}
        <article className="group relative flex flex-col justify-between w-full overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#060c11] p-4 shadow-[0_0_25px_-10px_rgba(6,182,212,0.2)] transition-all duration-300 hover:border-cyan-500/70 hover:shadow-[0_0_35px_-5px_rgba(6,182,212,0.35)]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-cyan-950/80">
              <div className="flex items-center gap-2">
                <span className="text-base">🎵</span>
                <span className="font-['Creepster'] text-lg tracking-wider text-cyan-300 uppercase">
                  TikTok
                </span>
              </div>
              <a
                href="https://www.tiktok.com/@bristeween"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-cyan-400/80 transition-colors duration-200 hover:text-cyan-200"
              >
                @bristeween ↗
              </a>
            </div>

            {/* Embed Container in 3x4 ratio */}
            <div className="mt-3 relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black border border-cyan-950/60 shadow-inner flex items-center justify-center">
              <div className="w-full h-full overflow-y-auto overflow-x-hidden flex items-center justify-center p-1 bg-black">
                <blockquote
                  className="tiktok-embed w-full h-full my-auto"
                  cite="https://www.tiktok.com/@bristeween"
                  data-unique-id="bristeween"
                  data-embed-type="creator"
                  style={{
                    maxWidth: "100%",
                    minWidth: "220px",
                    width: "100%",
                    margin: "0 auto",
                    background: "transparent",
                  }}
                >
                  <section style={{ padding: "12px", textAlign: "center" }}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.tiktok.com/@bristeween?refer=creator_embed"
                      style={{
                        color: "#00f2fe",
                        fontWeight: "bold",
                        fontSize: "14px",
                        textDecoration: "none",
                      }}
                    >
                      @bristeween
                    </a>
                    <p style={{ color: "#a1a1aa", fontSize: "12px", marginTop: "8px" }}>
                      Acompanhe os vídeos do ritual no TikTok oficial.
                    </p>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.tiktok.com/@bristeween"
                      style={{
                        display: "inline-block",
                        marginTop: "12px",
                        background: "linear-gradient(to right, #00f2fe, #4facfe)",
                        color: "#000",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "12px",
                        textDecoration: "none",
                      }}
                    >
                      Abrir no TikTok ↗
                    </a>
                  </section>
                </blockquote>
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 px-1 text-center text-[11px] text-neutral-300/90 leading-relaxed min-h-[2.2rem] flex items-center justify-center font-mono">
              Assista aos nossos vídeos do ritual diretamente pelo TikTok.
            </p>
          </div>

          {/* Button CTA */}
          <div className="mt-3 pt-1">
            <a
              href="https://www.tiktok.com/@bristeween"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/20 py-2.5 px-3 text-[11px] font-bold uppercase tracking-widest text-cyan-200 transition-all duration-300 hover:bg-cyan-900/50 hover:border-cyan-400 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <span>🎵</span>
              <span>Ver no TikTok</span>
            </a>
          </div>
        </article>

        {/* Card 3: YouTube */}
        <article className="group relative flex flex-col justify-between w-full overflow-hidden rounded-2xl border border-red-500/30 bg-[#120707] p-4 shadow-[0_0_25px_-10px_rgba(239,68,68,0.2)] transition-all duration-300 hover:border-red-500/70 hover:shadow-[0_0_35px_-5px_rgba(239,68,68,0.35)]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-red-950/80">
              <div className="flex items-center gap-2">
                <span className="text-base">▶️</span>
                <span className="font-['Creepster'] text-lg tracking-wider text-red-300 uppercase">
                  YouTube
                </span>
              </div>
              <a
                href="https://youtu.be/SIxJry0S_Xg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-red-400/80 transition-colors duration-200 hover:text-red-200"
              >
                Assistir ↗
              </a>
            </div>

            {/* Embed Container in 3x4 ratio */}
            <div className="mt-3 relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black border border-red-950/60 shadow-inner flex items-center justify-center">
              <iframe
                src="https://www.youtube.com/embed/SIxJry0S_Xg"
                title="YouTube video player"
                className="h-full w-full border-0 block"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Description */}
            <p className="mt-3 px-1 text-center text-[11px] text-neutral-300/90 leading-relaxed min-h-[2.2rem] flex items-center justify-center font-mono">
              Assista aos lançamentos e rituais passados em alta definição.
            </p>
          </div>

          {/* Button CTA */}
          <div className="mt-3 pt-1">
            <a
              href="https://youtu.be/SIxJry0S_Xg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-950/20 py-2.5 px-3 text-[11px] font-bold uppercase tracking-widest text-red-200 transition-all duration-300 hover:bg-red-900/50 hover:border-red-400 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              <span>▶️</span>
              <span>Ver no YouTube</span>
            </a>
          </div>
        </article>

        {/* Card 4: Spotify */}
        <article className="group relative flex flex-col justify-between w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-[#061009] p-4 shadow-[0_0_25px_-10px_rgba(16,185,129,0.2)] transition-all duration-300 hover:border-emerald-500/70 hover:shadow-[0_0_35px_-5px_rgba(16,185,129,0.35)]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-emerald-950/80">
              <div className="flex items-center gap-2">
                <span className="text-base">🎧</span>
                <span className="font-['Creepster'] text-lg tracking-wider text-emerald-300 uppercase">
                  Spotify
                </span>
              </div>
              <a
                href="https://open.spotify.com/playlist/04VAdJQ38NfQp50orQhVvq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-emerald-400/80 transition-colors duration-200 hover:text-emerald-200"
              >
                Ouvir ↗
              </a>
            </div>

            {/* Embed Container in 3x4 ratio */}
            <div className="mt-3 relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black border border-emerald-950/60 shadow-inner">
              <iframe
                src="https://open.spotify.com/embed/playlist/04VAdJQ38NfQp50orQhVvq?utm_source=generator&theme=0"
                title="Playlist Spotify BristeWeen 2026"
                className="h-full w-full border-0 block"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>

            {/* Description */}
            <p className="mt-3 px-1 text-center text-[11px] text-neutral-300/90 leading-relaxed min-h-[2.2rem] flex items-center justify-center font-mono">
              Sintonize na trilha sonora do seu maior pesadelo no Spotify.
            </p>
          </div>

          {/* Button CTA */}
          <div className="mt-3 pt-1">
            <a
              href="https://open.spotify.com/playlist/04VAdJQ38NfQp50orQhVvq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/20 py-2.5 px-3 text-[11px] font-bold uppercase tracking-widest text-emerald-200 transition-all duration-300 hover:bg-emerald-900/50 hover:border-emerald-400 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <span>🎧</span>
              <span>Ouvir Playlist</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
