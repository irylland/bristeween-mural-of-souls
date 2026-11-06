import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { EmailAuthForm } from "@/components/EmailAuthForm";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — BristeWeen" },
      { name: "description", content: "Entre com seu e-mail para acessar a comunidade BristeWeen." },
      { property: "og:title", content: "Entrar — BristeWeen" },
      { property: "og:description", content: "Acesse a comunidade de almas do BristeWeen." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate({ to: "/comunidade", replace: true });
  }, [user, navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-3xl border border-primary/50 bg-card p-8 text-center">
        <h1 className="mb-2 font-['Creepster'] text-4xl text-primary">Acessar Ritual</h1>
        <p className="mb-6 text-sm text-muted-foreground">Entre para ver as páginas das almas.</p>
        <EmailAuthForm />
        <Link to="/" className="mt-6 block text-xs text-muted-foreground hover:text-primary">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
