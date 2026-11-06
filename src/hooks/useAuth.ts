import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const load = async (u: User | null) => {
      setUser(u);
      if (u) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", u.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!data);
      } else setIsAdmin(false);
      setReady(true);
    };
    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      void load(s?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, isAdmin, ready };
}

export async function signInWithGoogle() {
  const { lovable } = await import("@/integrations/lovable");
  return lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
}
