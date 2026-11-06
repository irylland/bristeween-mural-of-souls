import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — BristeWeen" },
      { name: "description", content: "Defina uma nova senha para sua conta BristeWeen." },
      { property: "og:title", content: "Nova senha — BristeWeen" },
      { property: "og:description", content: "Defina uma nova senha para sua conta BristeWeen." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(error.message); return; }
    toast.success("Senha alterada!");
    navigate({ to: "/comunidade" });
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={save} className="w-full max-w-sm space-y-4 rounded-3xl border border-primary/50 bg-card p-8 text-center">
        <h1 className="font-['Creepster'] text-4xl text-primary">Nova senha</h1>
        <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nova senha" className="w-full rounded-2xl border border-primary/40 bg-background/60 px-4 py-3 text-sm" />
        <button className="w-full rounded-2xl bg-primary py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground">Salvar</button>
      </form>
    </div>
  );
}
