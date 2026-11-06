import { Link } from "@tanstack/react-router";
import { LogOut, X, Sparkles, User, Users, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EmailAuthForm } from "@/components/EmailAuthForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const linkCls =
  "flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/50 bg-orange-950/40 py-3 text-xs font-bold uppercase tracking-widest text-orange-200 hover:border-orange-400 hover:text-white transition-all";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { user, isAdmin, approved } = useAuth();
  if (!isOpen) return null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da sessão.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl border border-orange-500/55 bg-gradient-to-b from-[#180d08] via-[#0b0604] to-black p-6 sm:p-8 shadow-[0_0_60px_rgba(249,115,22,0.35)]">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800 bg-black/60 text-neutral-400 hover:border-orange-500/50 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/40 bg-orange-950/40 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300 mb-3">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>PORTAL DO CONVIDADO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-['Creepster'] text-white tracking-wider">
            {user ? "SUA ALMA" : "ACESSAR RITUAL"}
          </h2>
          <p className="mt-1 text-xs text-neutral-400 font-mono break-all">
            {user ? user.email : "Entre com seu e-mail para criar sua página."}
          </p>
        </div>

        {user ? (
          <div className="space-y-3">
            {!approved && <p role="status" className="text-center text-sm text-primary">Cadastro pendente. Aguarde a aprovação do administrador.</p>}
            {approved && <><Link to="/perfil/$id" params={{ id: user.id }} onClick={onClose} className={linkCls}>
              <User className="w-4 h-4" /> Minha página
            </Link>
            <Link to="/comunidade" onClick={onClose} className={linkCls}>
              <Users className="w-4 h-4" /> Comunidade
            </Link></>}
            {isAdmin && (
              <Link to="/painel" onClick={onClose} className={linkCls}>
                <Shield className="w-4 h-4" /> Painel do organizador
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/50 bg-red-950/40 py-3 text-xs font-bold uppercase tracking-widest text-red-300 hover:text-white transition-all"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        ) : (
          <EmailAuthForm />
        )}
      </div>
    </div>
  );
}
