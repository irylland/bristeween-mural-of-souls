import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { approveRegistration } from "@/lib/registrations.functions";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Painel,
});

const box = "rounded-2xl border border-border bg-card p-4";

function Painel() {
  const qc = useQueryClient();
  const approve = useServerFn(approveRegistration);
  const [busyId, setBusyId] = useState<string | null>(null);
  const registrations = useQuery({
    queryKey: ["admin", "registrations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000,
  });
  const pending = registrations.data?.filter((r) => r.status === "pending") ?? [];
  const accept = async (userId: string) => {
    setBusyId(userId);
    try {
      await approve({ data: { userId } });
      await qc.invalidateQueries({ queryKey: ["admin", "registrations"] });
      toast.success("Cadastro aprovado! A pessoa já pode entrar.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao aprovar cadastro.");
    } finally { setBusyId(null); }
  };
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
      <section className="border-b border-border py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-['Creepster'] text-3xl text-primary">Cadastros pendentes ({pending.length})</h2>
          <Button variant="ghost" size="icon" title="Atualizar cadastros" aria-label="Atualizar cadastros" onClick={() => registrations.refetch()}><RefreshCw className="h-4 w-4" /></Button>
        </div>
        {registrations.isLoading && <p>Carregando cadastros...</p>}
        {registrations.isError && <p role="alert">Não foi possível carregar os cadastros. Tente atualizar.</p>}
        {registrations.isSuccess && pending.length === 0 && <p className="text-sm text-muted-foreground">Nenhum cadastro pendente.</p>}
        <ul className="divide-y divide-border">
          {pending.map((r) => <li key={r.user_id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0"><p className="break-all text-sm">{r.email}</p><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("pt-BR")}</p></div>
            <Button disabled={busyId !== null} onClick={() => accept(r.user_id)}><Check className="h-4 w-4" />{busyId === r.user_id ? "Aprovando..." : "Aprovar"}</Button>
          </li>)}
        </ul>
        <details className="mt-5 text-sm">
          <summary className="cursor-pointer text-muted-foreground">Cadastros aprovados ({registrations.data?.filter((r) => r.status === "approved").length ?? 0})</summary>
          <ul className="mt-3 space-y-2">{registrations.data?.filter((r) => r.status === "approved").map((r) => <li key={r.user_id} className="break-all">{r.email} · Aprovado</li>)}</ul>
        </details>
      </section>
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
