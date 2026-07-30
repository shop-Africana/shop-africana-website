import { redirect } from "next/navigation";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";

export type OwnerUser = {
  userId: string;
  email: string | null;
};

export async function getOwnerUser(): Promise<OwnerUser | null> {
  const authClient = await createSupabaseAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) return null;

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
