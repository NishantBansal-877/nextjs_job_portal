"use server";

import { cache } from "react";
import { validateSessionAndGetUser } from "./use-cases/sessions";
import { cookies } from "next/headers";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  const user = await validateSessionAndGetUser(session);
  return user;
});
