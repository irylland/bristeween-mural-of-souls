import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/painel")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!data) throw redirect({ to: "/comunidade" });
  },
  head: () => ({
    meta: [
      { title: "Painel — BristeWeen" },
      { name: "description", content: "Painel do organizador do BristeWeen." },
      { property: "og:title", content: "Painel — BristeWeen" },
      { property: "og:description", content: "Gerencie confirmações e conteúdos." },
    ],
  }),
  component: Painel,
});

const box = "rounded-2xl border border-border bg-card p-4";

function Painel() {
  const qc = useQueryClient();
  const q = (table: "rsvps" | "souls" | "posts" | "scraps") => ({
    queryKey: ["admin", table],
    queryFn: async () =>
      ((await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(200)).data ?? []) as Array<Record<string, unknown> & { id: string }>,
  });
  const rsvps = useQuery(q("rsvps")).data ?? [];
  const souls = useQuery(q("souls")).data ?? [];
  const posts = useQuery(q("posts")).data ?? [];
  const scraps = useQuery(q("scraps")).data ?? [];
  const total = rsvps.reduce((n, r) => n + Number(r["guests"] ?? 1), 0);

  const del = async (table: "rsvps" | "souls" | "posts" | "scraps", id: string) => {
    if (!confirm("Apagar?")) return;
    await supabase.from(table).delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin", table] });
  };

  const List = ({ title, table, rows, render }: { title: string; table: "rsvps" | "souls" | "posts" | "scraps"; rows: Array<Record<string, unknown> & { id: string }>; render: (r: Record<string, unknown>) => string }) => (
    <div className={box}>
      <h2 className="mb-3 font-['Creepster'] text-2xl text-primary">{title} ({rows.length})</h2>
      <ul className="max-h-96 space-y-2 overflow-auto">
        {rows.map((r) => (
          <li key={r.id} className="flex items-start gap-2 border-b border-border pb-2 text-sm">
            <span className="flex-1 break-words">{render(r)}</span>
            <button aria-label="Apagar" onClick={() => del(table, r.id)}><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <main className="mx-auto max-w-5xl space-y-4 p-4">
      <h1 className="my-4 font-['Creepster'] text-4xl text-primary">Painel do organizador</h1>
      <p className="text-lg">{total} almas confirmadas em {rsvps.length} confirmações</p>
      <div className="grid gap-4 md:grid-cols-2">
        <List title="Confirmações" table="rsvps" rows={rsvps} render={(r) => `${r["name"]} (+${r["guests"]})${r["costume"] ? ` — ${r["costume"]}` : ""}`} />
        <List title="Mural de Almas" table="souls" rows={souls} render={(r) => `${r["name"]}: ${r["message"]}`} />
        <List title="Publicações" table="posts" rows={posts} render={(r) => `${r["content"] ?? "(imagem)"}`} />
        <List title="Recados" table="scraps" rows={scraps} render={(r) => `${r["message"]}`} />
      </div>
    </main>
  );
}
