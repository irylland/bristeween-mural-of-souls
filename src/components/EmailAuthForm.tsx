import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const inputCls =
  "w-full rounded-2xl border border-primary/40 bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

export function EmailAuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error("E-mail ou senha incorretos (ou e-mail ainda não confirmado).");
      else toast.success("Bem-vinda, alma!");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Conta criada! Confira seu e-mail para confirmar.");
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
      <input type="email" required placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      <input type="password" required minLength={6} placeholder="Senha (mín. 6)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
      <button disabled={busy} className="w-full rounded-2xl bg-primary py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90 disabled:opacity-50">
        {busy ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
      </button>
      <div className="flex justify-between text-xs text-muted-foreground">
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="hover:text-primary">
          {mode === "login" ? "Criar conta" : "Já tenho conta"}
        </button>
        {mode === "login" && (
          <button type="button" onClick={reset} className="hover:text-primary">Esqueci a senha</button>
        )}
      </div>
    </form>
  );
}
