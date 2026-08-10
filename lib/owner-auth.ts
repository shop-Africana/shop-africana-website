import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type OwnerUser = {
  userId: string;
  email: string | null;
};

export async function isAllowlistedOwner(
  userId: string,
  authClient?: SupabaseClient,
) {
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("owner_users")
      .select("user_id")
      .eq("user_id", userId)
      .eq("is_active", true)
      .in("role", ["owner", "admin"])
      .maybeSingle();

    if (!error) return Boolean(data);
  } catch {
    // Fall back to the authenticated security-definer RPC below.
  }

  if (!authClient) return false;

  const { data, error } = await authClient.rpc("current_user_is_owner");

  if (error) return false;

  return Boolean(data);
}

export async function getOwnerUser(): Promise<OwnerUser | null> {
  const authClient = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) return null;
  const isOwner = await isAllowlistedOwner(user.id, authClient);

  if (!isOwner) return null;

  return {
    userId: user.id,
    email: user.email ?? null,
  };
}

export async function requireOwner() {
  const owner = await getOwnerUser();

  if (!owner) {
    redirect("/owner/login");
  }

  return owner;
}
