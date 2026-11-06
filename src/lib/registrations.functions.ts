import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const approveRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: admin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId, _role: "admin",
    });
    if (roleError || !admin) throw new Error("Acesso exclusivo do administrador.");
    const { data: registration, error: lookupError } = await context.supabase
      .from("registrations").select("user_id").eq("user_id", data.userId).single();
    if (lookupError || !registration) throw new Error("Cadastro não encontrado.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { email_confirm: true });
    if (authError) throw new Error("Não foi possível liberar a conta. Tente novamente.");
    const { error } = await context.supabase.from("registrations").update({
      status: "approved", approved_at: new Date().toISOString(), approved_by: context.userId,
    }).eq("user_id", data.userId);
    if (error) throw new Error("Não foi possível salvar a aprovação. Tente novamente.");
    return { approved: true };
  });