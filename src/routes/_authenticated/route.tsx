import { createFileRoute, Outlet, redirect, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { userId: data.user.id };
  },
  component: Layout,
});

function Layout() {
  const { userId } = Route.useRouteContext();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-primary/30 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 text-sm">
          <Link to="/" className="font-['Creepster'] text-2xl text-primary">BristeWeen</Link>
          <div className="ml-auto flex gap-4">
            <Link to="/comunidade" className="hover:text-primary" activeProps={{ className: "text-primary" }}>Comunidade</Link>
            <Link to="/perfil/$id" params={{ id: userId }} className="hover:text-primary" activeProps={{ className: "text-primary" }}>Minha página</Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
