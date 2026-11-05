import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, User, LogOut, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Conta criada com sucesso! Verifique seu e-mail se necessário.");
        onClose();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Login realizado com sucesso! Bem-vindo ao BristeWeen.");
        onClose();
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro na autenticação. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair da conta.");
    } else {
      toast.success("Você saiu da sessão.");
      setUser(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl border border-orange-500/55 bg-gradient-to-b from-[#180d08] via-[#0b0604] to-black p-6 sm:p-8 shadow-[0_0_60px_rgba(249,115,22,0.35)]">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-black/60 text-neutral-400 hover:border-orange-500/50 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {user ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-500/60 bg-orange-950/50 text-orange-300 shadow-[0_0_20px_rgba(249,115,22,0.5)] mb-4">
              <User className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-400">
              Sessão Ativa
            </span>
            <h2 className="mt-2 text-xl font-bold text-white tracking-wide break-all font-mono">
              {user.email}
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Você está conectado ao portal oficial do BristeWeen Sobrenatural.
            </p>

            <button
              onClick={handleSignOut}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/50 bg-red-950/40 py-3 text-xs font-bold uppercase tracking-widest text-red-300 hover:border-red-400 hover:bg-red-900/60 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <LogOut className="w-4 h-4" />
              <span>Encerrar Sessão</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-950/40 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)] mb-3">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>PORTAL DO CONVIDADO</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-['Creepster'] text-white tracking-wider">
                {isSignUp ? "CRIAR SUA ALMA" : "ACESSAR RITUAL"}
              </h2>
              <p className="mt-1 text-xs text-neutral-400 font-mono">
                {isSignUp
                  ? "Cadastre-se para registrar sua presença no BristeWeen."
                  : "Entre com seu e-mail e senha para acessar sua conta."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full rounded-2xl border border-neutral-800 bg-black/70 py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-neutral-600 focus:border-orange-500/80 focus:outline-none focus:ring-1 focus:ring-orange-500/80 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-300 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-neutral-800 bg-black/70 py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-neutral-600 focus:border-orange-500/80 focus:outline-none focus:ring-1 focus:ring-orange-500/80 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-2xl border border-orange-500/80 bg-gradient-to-r from-orange-600 to-orange-500 py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:from-orange-500 hover:to-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Processando..." : isSignUp ? "Registrar Conta" : "Entrar no Portal"}
              </button>
            </form>

            {/* Toggle switch */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-neutral-400 hover:text-orange-300 font-mono transition-colors"
              >
                {isSignUp ? "Já tem uma conta? Faça login" : "Não tem conta? Criar nova conta"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
