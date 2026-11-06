import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// The admin password lives only in the server secret ADMIN_PASSWORD; it never ships to the browser.
function checkPassword(password: string) {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected || password !== expected) throw new Error("Senha incorreta.");
}

const pw = z.object({ password: z.string().min(1).max(200) });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((i) => pw.parse(i))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true };
  });

export const adminListRegistrations = createServerFn({ method: "POST" })
  .inputValidator((i) => pw.parse(i))
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("registrations")
      .select("user_id,email,status,created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Não foi possível carregar os cadastros.");
    return rows ?? [];
  });

export const adminSetRegistration = createServerFn({ method: "POST" })
  .inputValidator((i) =>
    pw.extend({ userId: z.string().uuid(), action: z.enum(["approve", "reject"]) }).parse(i),
  )
  .handler(async ({ data }) => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.action === "approve") {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
        email_confirm: true,
      });
      if (authError) throw new Error("Não foi possível liberar a conta.");
    }
    const { error } = await supabaseAdmin
      .from("registrations")
      .update(
        data.action === "approve"
          ? { status: "approved", approved_at: new Date().toISOString() }
          : { status: "rejected", approved_at: null },
      )
      .eq("user_id", data.userId);
    if (error) throw new Error("Não foi possível salvar.");
    return { ok: true };
  });
