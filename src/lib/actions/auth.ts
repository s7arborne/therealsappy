"use server";
import { signSession, setSessionCookie, clearSessionCookie, ADMIN_PATH } from "@/lib/auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData): Promise<void> {
  const password = formData.get("password") as string;
  if (!password) redirect(`/${ADMIN_PATH}/login?error=1`);

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) redirect(`/${ADMIN_PATH}/login?error=1`);

  // Use sync compare to avoid async timing issues in server action context
  let ok: boolean;
  try {
    ok = bcrypt.compareSync(password, hash!);
  } catch {
    ok = false;
  }
  
  if (!ok) {
    redirect(`/${ADMIN_PATH}/login?error=1`);
  }

  const token = await signSession();
  await setSessionCookie(token);
  redirect(`/${ADMIN_PATH}/login?ok=1`);
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect(`/${ADMIN_PATH}/login`);
}
