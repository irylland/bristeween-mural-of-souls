import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminListRegistrations, adminLogin, adminSetRegistration } from "@/lib/admin-password.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — BristeWeen" },
      { name: "description", content: "Aprovação de cadastros do BristeWeen." },
      { property: "og:title", content: "Administração — BristeWeen" },
      { property: "og:description", content: "Aprovação de cadastros do BristeWeen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Row = { user_id: string; email: string; status: string; created_at: string };
const KEY = "bw-admin-pw";

function AdminPage() {
  const login = useServerFn(adminLogin);
  const list = useServerFn(adminListRegistrations);
  const setReg = useServerFn(adminSetRegistration);
  const [password, setPassword] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => { setPassword(sessionStorage.getItem(KEY)); }, []);

  const load = useCallback(async (pw: string) => {
    try { setRows(await list({ data: { password: pw } })); }
    catch { sessionStorage.removeItem(KEY); setPassword(null); toast.error("Sessão expirada. Digite a senha de novo."); }
  }, [list]);

  useEffect(() => { if (password) load(password); }, [password, load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ data: { password: typed } });
      sessionStorage.setItem(KEY, typed);
      setPassword(typed); setTyped("");
    } catch { toast.error("Senha incorreta."); }
  };

  const act = async (userId: string, action: "approve" | "reject") => {
    if (!password) return;
    setBusy(userId);
    try {
      await setReg({ data: { password, userId, action } });
      toast.success(action === "approve" ? "Cadastro aprovado!" : "Cadastro recusado.");
      await load(password);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Falha."); }
    finally { setBusy(null); }
  };

  if (!password) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
        <h1 className="text-center font-['Creepster'] text-4xl text-primary">Administração</h1>
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <Input type="password" placeholder="Senha de administrador" value={typed} onChange={(e) => setTyped(e.target.value)} autoFocus />
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
        <Link to="/" className="text-center text-sm text-muted-foreground">Voltar ao site</Link>
      </main>
    );
  }

  const pending = rows?.filter((r) => r.status === "pending") ?? [];
  const approved = rows?.filter((r) => r.status === "approved") ?? [];
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-['Creepster'] text-4xl text-primary">Cadastros pendentes ({pending.length})</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" aria-label="Atualizar" onClick={() => load(password)}><RefreshCw className="h-4 w-4" /></Button>
          <Button variant="outline" onClick={() => { sessionStorage.removeItem(KEY); setPassword(null); setRows(null); }}>Sair</Button>
        </div>
      </div>
      {rows === null && <p>Carregando...</p>}
      {rows && pending.length === 0 && <p className="text-muted-foreground">Nenhum cadastro pendente.</p>}
      <ul className="divide-y divide-border rounded-2xl border border-border bg-card px-4">
        {pending.map((r) => (
          <li key={r.user_id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0"><p className="break-all">{r.email}</p><p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("pt-BR")}</p></div>
            <div className="flex gap-2">
              <Button disabled={busy !== null} onClick={() => act(r.user_id, "approve")}><Check className="h-4 w-4" />Aprovar</Button>
              <Button variant="outline" disabled={busy !== null} onClick={() => act(r.user_id, "reject")}><X className="h-4 w-4" />Recusar</Button>
            </div>
          </li>
        ))}
      </ul>
      <details>
        <summary className="cursor-pointer text-muted-foreground">Aprovados ({approved.length})</summary>
        <ul className="mt-3 space-y-1 text-sm">{approved.map((r) => <li key={r.user_id} className="break-all">{r.email}</li>)}</ul>
      </details>
    </main>
  );
}
