import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, ImagePlus, Camera, Music, BatteryMedium } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, signedUrls } from "@/lib/media";
import { Avatar } from "./comunidade";

export const Route = createFileRoute("/_authenticated/perfil/$id")({
  beforeLoad: async () => {
    const { data, error } = await supabase.rpc("community_access");
    if (error || !data) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "Perfil — BristeWeen" },
      { name: "description", content: "Página de uma alma do BristeWeen." },
      { property: "og:title", content: "Perfil — BristeWeen" },
      { property: "og:description", content: "Fotos, GIFs e recados de uma alma do BristeWeen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Perfil,
});

const box = "rounded-2xl border border-border bg-card p-4";
const input = "w-full rounded-xl border border-border bg-background p-2 text-sm";
const btn = "rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-50";

function Perfil() {
  const { id } = Route.useParams();
  const { userId } = Route.useRouteContext();
  const qc = useQueryClient();
  const isMe = id === userId;

  const { data: profile } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const p = (await supabase.from("profiles").select("*").eq("id", id).maybeSingle()).data;
      if (!p) return null;
      const urls = await signedUrls([p.avatar_path, p.cover_path, p.monster_path].filter((x): x is string => !!x));
      return { ...p, avatar: p.avatar_path ? urls[p.avatar_path] : p.avatar_url, cover: p.cover_path ? urls[p.cover_path] : undefined, monster: p.monster_path ? urls[p.monster_path] : undefined };
    },
  });
  const { data: posts = [] } = useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const { data } = await supabase.from("posts").select("*").eq("user_id", id).order("created_at", { ascending: false });
      const urls = await signedUrls((data ?? []).flatMap((p) => (p.media_path ? [p.media_path] : [])));
      return (data ?? []).map((p) => ({ ...p, url: p.media_path ? urls[p.media_path] : undefined }));
    },
  });
  const { data: scraps = [] } = useQuery({
    queryKey: ["scraps", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("scraps")
        .select("*, from:profiles!scraps_from_user_fkey(id, display_name, avatar_url)")
        .eq("to_user", id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ display_name: "", bio: "", costume: "", city: "", human_name: "", relationship: "", status: "", music_url: "" });
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [scrap, setScrap] = useState("");
  const [busy, setBusy] = useState(false);

  if (!profile) return <p className="p-8 text-center text-muted-foreground">Carregando alma...</p>;

  const saveProfile = async () => {
    const { error } = await supabase.from("profiles").update(form).eq("id", id);
    if (error) { toast.error("Não foi possível salvar."); return; }
    setEditing(false);
    qc.invalidateQueries({ queryKey: ["profile", id] });
  };

  const uploadImage = async (field: "avatar_path" | "cover_path" | "monster_path", f?: File) => {
    if (!f) return;
    try {
      const m = await uploadMedia(userId, f);
      await supabase.from("profiles").update({ [field]: m.path }).eq("id", id);
      qc.invalidateQueries({ queryKey: ["profile", id] });
      toast.success("Imagem atualizada!");
    } catch { toast.error("Falha ao enviar imagem."); }
  };

  const setBattery = async (v: number) => {
    await supabase.from("profiles").update({ social_battery: v }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["profile", id] });
  };

  const yt = (() => {
    const m = profile.music_url?.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/);
    return m?.[1];
  })();
  const bat = profile.social_battery;
  const batColor = bat > 60 ? "bg-green-500" : bat > 25 ? "bg-primary" : "bg-destructive";

  const publish = async () => {
    if (!text.trim() && !file) return;
    setBusy(true);
    try {
      let media: { path: string; type: string } | null = null;
      if (file) media = await uploadMedia(userId, file);
      const { error } = await supabase.from("posts").insert({
        user_id: userId,
        content: text.trim() || null,
        media_path: media?.path ?? null,
        media_type: media?.type ?? null,
      });
      if (error) throw error;
      setText("");
      setFile(null);
      qc.invalidateQueries({ queryKey: ["posts", id] });
    } catch {
      toast.error("Falha ao publicar. Arquivos até 20 MB.");
    }
    setBusy(false);
  };

  const sendScrap = async () => {
    if (!scrap.trim()) return;
    const { error } = await supabase.from("scraps").insert({ to_user: id, from_user: userId, message: scrap.trim() });
    if (error) { toast.error("Não foi possível enviar."); return; }
    setScrap("");
    qc.invalidateQueries({ queryKey: ["scraps", id] });
  };

  const del = async (table: "posts" | "scraps", rowId: string) => {
    await supabase.from(table).delete().eq("id", rowId);
    qc.invalidateQueries({ queryKey: [table, id] });
  };

  const field = (k: keyof typeof form, ph: string) => (
    <input className={input} placeholder={ph} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
  );
  const chip = "rounded-md border border-border bg-background/70 px-2 py-0.5 text-xs font-bold uppercase tracking-wide";

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-4">
      <section className="overflow-hidden rounded-2xl border border-primary/40 bg-card shadow-[0_0_30px_-10px_var(--primary)]">
        <div className="relative h-48 bg-gradient-to-b from-primary/20 to-card md:h-60">
          {profile.cover && <img src={profile.cover} alt="Capa" className="h-full w-full object-cover opacity-70" />}
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          {isMe && (
            <label className="absolute right-3 top-3 flex cursor-pointer items-center gap-1 rounded-lg border border-primary/50 bg-background/80 px-3 py-1.5 text-xs font-bold uppercase text-primary">
              <Camera className="h-4 w-4" /> Mudar capa
              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage("cover_path", e.target.files?.[0])} />
            </label>
          )}
        </div>

        <div className="relative -mt-16 flex flex-wrap items-end gap-4 px-5 pb-5">
          <div className="relative">
            <label className={`block ${isMe ? "cursor-pointer" : ""}`} title={isMe ? "Mudar foto de monstro" : undefined}>
              {profile.monster ? (
                <img src={profile.monster} alt="Monstro" className="h-32 w-32 rounded-2xl border-2 border-primary object-cover" />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-background text-4xl">👻</div>
              )}
              {isMe && <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage("monster_path", e.target.files?.[0])} />}
            </label>
            <label className={`absolute -bottom-2 -right-2 block ${isMe ? "cursor-pointer" : ""}`} title={isMe ? "Mudar foto de perfil" : undefined}>
              <div className="overflow-hidden rounded-xl border-2 border-card">
                <Avatar url={profile.avatar ?? null} name={profile.display_name} size="h-12 w-12" />
              </div>
              {isMe && <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage("avatar_path", e.target.files?.[0])} />}
            </label>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold uppercase">{profile.costume || "Sua fantasia"}</h1>
              {profile.relationship && <span className="rounded-full border border-green-500/60 px-2 py-0.5 text-xs font-bold uppercase text-green-400">{profile.relationship}</span>}
              <span>🎃</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={chip}>Humano: {profile.human_name || profile.display_name}</span>
              {profile.city && <span className={chip}>📍 {profile.city}</span>}
              <span className={chip}>⚡ Poder: <span className="text-primary">{posts.length * 10 + scraps.length * 5}xp</span></span>
            </div>
          </div>

          <div className="w-56 rounded-xl border border-border bg-background/70 p-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase">
              <span className="flex items-center gap-1"><BatteryMedium className="h-4 w-4" /> Bateria social</span>
              <span>{bat}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${batColor} transition-all`} style={{ width: `${bat}%` }} />
            </div>
            {isMe && (
              <input type="range" min={0} max={100} step={5} defaultValue={bat} aria-label="Bateria social"
                className="mt-2 w-full accent-[var(--primary)]" onMouseUp={(e) => setBattery(+e.currentTarget.value)} onTouchEnd={(e) => setBattery(+e.currentTarget.value)} onKeyUp={(e) => setBattery(+e.currentTarget.value)} />
            )}
          </div>
        </div>

        {isMe && (
          <div className="flex justify-end gap-2 px-5 pb-4">
            <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold uppercase"
              onClick={() => {
                setForm({ display_name: profile.display_name, bio: profile.bio ?? "", costume: profile.costume ?? "", city: profile.city ?? "", human_name: profile.human_name ?? "", relationship: profile.relationship ?? "", status: profile.status ?? "", music_url: profile.music_url ?? "" });
                setEditing(!editing);
              }}>
              ⚙ {editing ? "Fechar" : "Editar dados"}
            </button>
          </div>
        )}

        {editing && (
          <div className="grid gap-2 border-t border-border p-5 md:grid-cols-2">
            {field("costume", "Fantasia (ex: Vampira)")}
            {field("human_name", "Nome humano")}
            {field("display_name", "Apelido na comunidade")}
            {field("relationship", "Status (ex: Solteiro(a))")}
            {field("city", "Cidade")}
            {field("music_url", "Link do YouTube da trilha sonora")}
            <textarea className={`${input} md:col-span-2`} placeholder="Quem sou eu" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <textarea className={`${input} md:col-span-2`} placeholder="Status do momento" rows={2} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
            <button className={`${btn} md:col-span-2`} onClick={saveProfile}>Salvar</button>
          </div>
        )}

        {yt && (
          <div className="mx-5 mb-5 rounded-xl border border-border bg-background/60 p-3">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><Music className="h-4 w-4 text-primary" /> Trilha sonora</p>
            <iframe className="mx-auto aspect-video w-full max-w-md rounded-lg" src={`https://www.youtube.com/embed/${yt}`} title="Trilha sonora" allow="autoplay; encrypted-media" allowFullScreen />
          </div>
        )}
      </section>

      <div className={box}>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-widest">Status do momento</h2>
        <p className="rounded-lg bg-background p-3 italic">“{profile.status || "Perambulando pelo submundo do Bristeween..."}”</p>
        {profile.bio && <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{profile.bio}</p>}
      </div>

      <section className="space-y-4">
        {isMe && (
          <div className={box}>
            <textarea className={input} rows={3} placeholder="Compartilhe algo..." value={text} onChange={(e) => setText(e.target.value)} />
            <div className="mt-2 flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-1 text-sm text-primary">
                <ImagePlus className="h-4 w-4" /> {file ? file.name : "Foto ou GIF"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
              <button className={`${btn} ml-auto`} disabled={busy} onClick={publish}>{busy ? "Enviando..." : "Publicar"}</button>
            </div>
          </div>
        )}

        <div className={box}>
          <h2 className="mb-3 font-['Creepster'] text-2xl text-primary">Publicações ({posts.length})</h2>
          {posts.length === 0 && <p className="text-sm text-muted-foreground">Nada por aqui ainda.</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            {posts.map((p) => (
              <div key={p.id} className="relative rounded-xl border border-border p-2">
                {p.url && <img src={p.url} alt="" className="w-full rounded-lg object-cover" />}
                {p.content && <p className="mt-2 whitespace-pre-wrap text-sm">{p.content}</p>}
                {isMe && (
                  <button aria-label="Apagar" onClick={() => del("posts", p.id)} className="absolute right-3 top-3 rounded-full bg-background/80 p-1.5">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={box}>
          <h2 className="mb-3 font-['Creepster'] text-2xl text-primary">Mural de recados ({scraps.length})</h2>
          <div className="mb-4 flex gap-2">
            <input className={input} placeholder="Escreva seu recado gótico..." value={scrap} onChange={(e) => setScrap(e.target.value)} />
            <button className={btn} onClick={sendScrap}>Gravar no mural</button>
          </div>
          <ul className="space-y-3">
            {scraps.map((s) => (
              <li key={s.id} className="flex gap-3 border-b border-border pb-3">
                <Avatar url={s.from?.avatar_url ?? null} name={s.from?.display_name ?? "?"} size="h-10 w-10" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{s.from?.display_name}</p>
                  <p className="whitespace-pre-wrap text-sm">{s.message}</p>
                </div>
                {(isMe || s.from_user === userId) && (
                  <button aria-label="Apagar" onClick={() => del("scraps", s.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
