import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/comunidade")({
  head: () => ({
    meta: [
      { title: "Comunidade — BristeWeen" },
      { name: "description", content: "Todas as almas do BristeWeen." },
      { property: "og:title", content: "Comunidade — BristeWeen" },
      { property: "og:description", content: "Conheça as almas que vão ao BristeWeen." },
    ],
  }),
  component: Comunidade,
});

function Comunidade() {
  const { data = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, costume")
        .order("created_at");
      return data ?? [];
    },
  });
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="my-6 font-['Creepster'] text-4xl text-primary">Almas ({data.length})</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {data.map((p) => (
          <Link
            key={p.id}
            to="/perfil/$id"
            params={{ id: p.id }}
            className="rounded-2xl border border-border bg-card p-4 text-center hover:border-primary"
          >
            <Avatar url={p.avatar_url} name={p.display_name} size="h-20 w-20" />
            <p className="mt-2 truncate font-semibold">{p.display_name}</p>
            {p.costume && <p className="truncate text-xs text-muted-foreground">{p.costume}</p>}
          </Link>
        ))}
      </div>
    </main>
  );
}

export function Avatar({ url, name, size }: { url: string | null; name: string; size: string }) {
  return url ? (
    <img src={url} alt={name} referrerPolicy="no-referrer" className={`${size} mx-auto rounded-full object-cover`} />
  ) : (
    <div className={`${size} mx-auto flex items-center justify-center rounded-full bg-primary/20 text-2xl text-primary`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
