import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, ImagePlus } from "lucide-react";
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
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", id).maybeSingle()).data,
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
  const [form, setForm] = useState({ display_name: "", bio: "", costume: "", city: "" });
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

  return (
    <main className="mx-auto grid max-w-5xl gap-4 p-4 md:grid-cols-[260px_1fr]">
      <aside className={`${box} h-fit text-center`}>
        <Avatar url={profile.avatar_url} name={profile.display_name} size="h-32 w-32" />
        {editing ? (
          <div className="mt-4 space-y-2 text-left">
            <input className={input} placeholder="Nome" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
            <input className={input} placeholder="Fantasia" value={form.costume} onChange={(e) => setForm({ ...form, costume: e.target.value })} />
            <input className={input} placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <textarea className={input} placeholder="Quem sou eu" rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <button className={btn} onClick={saveProfile}>Salvar</button>
          </div>
        ) : (
          <>
            <h1 className="mt-3 text-xl font-bold">{profile.display_name}</h1>
            {profile.costume && <p className="text-sm text-primary">🎃 {profile.costume}</p>}
            {profile.city && <p className="text-xs text-muted-foreground">{profile.city}</p>}
            {profile.bio && <p className="mt-3 whitespace-pre-wrap text-left text-sm">{profile.bio}</p>}
            {isMe && (
              <button
                className="mt-4 text-xs text-primary underline"
                onClick={() => {
                  setForm({ display_name: profile.display_name, bio: profile.bio ?? "", costume: profile.costume ?? "", city: profile.city ?? "" });
                  setEditing(true);
                }}
              >
                Editar perfil
              </button>
            )}
          </>
        )}
      </aside>

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
          <h2 className="mb-3 font-['Creepster'] text-2xl text-primary">Recados ({scraps.length})</h2>
          <div className="mb-4 flex gap-2">
            <input className={input} placeholder="Deixe um recado..." value={scrap} onChange={(e) => setScrap(e.target.value)} />
            <button className={btn} onClick={sendScrap}>Enviar</button>
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
