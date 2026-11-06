import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { canAccessCommunity } from "@/lib/registration-access";

const inputCls =
  "w-full rounded-2xl border border-primary/40 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

export function EmailAuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.code === "email_not_confirmed") setNotice("Cadastro pendente. Aguarde a aprovação do administrador.");
        else toast.error("E-mail ou senha incorretos.");
      } else {
        const { data: session } = await supabase.auth.getUser();
        if (session.user) {
          const [{ data: registration }, { data: admin }] = await Promise.all([
            supabase.from("registrations").select("status").eq("user_id", session.user.id).maybeSingle(),
            supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }),
          ]);
          if (!canAccessCommunity(registration?.status, admin === true)) setNotice("Cadastro pendente. Aguarde a aprovação do administrador.");
          else toast.success("Bem-vinda, alma!");
        }
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error)
        toast.error(
          /weak|easy to guess/i.test(error.message)
            ? "Senha muito fácil de adivinhar. Escolha outra."
            : error.message,
        );
      else if (data.user && data.user.identities?.length === 0) {
        toast.error("Esse e-mail já tem conta. Use “Esqueci a senha” para criar sua senha.");
        setMode("login");
      } else {
        setNotice("Cadastro enviado! Aguarde a aprovação do administrador para entrar.");
        setMode("login");
      }
    }
    setBusy(false);
  };

  const reset = async () => {
    if (!email) { toast.error("Digite seu e-mail primeiro."); return; }
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    toast.success("Enviamos um link para redefinir a senha.");
  };

  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      {notice && <p role="status" className="text-sm text-primary">{notice}</p>}
      <input aria-label="E-mail" type="email" required autoComplete="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      <input aria-label="Senha" type="password" required autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} placeholder="Senha (mín. 6)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Cadastrar"}
      </Button>
      <div className="flex justify-between text-xs text-muted-foreground">
        <Button variant="link" type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="px-0 text-xs">
          {mode === "login" ? "Cadastrar" : "Já tenho conta"}
        </Button>
        {mode === "login" && (
          <Button variant="link" type="button" onClick={reset} className="px-0 text-xs">Esqueci a senha</Button>
        )}
      </div>
    </form>
  );
}
