"use server";
import { db } from "@/src/config/db";
import { applicants, employers, users } from "@/src/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
import { RegisterUserData, registerUserSchema } from "../auth.schema";
import {
  createSessionAndSetCookies,
  invalidateSession,
} from "./use-cases/sessions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

export const registerUserAction = async (data: RegisterUserData) => {
  try {
    const { data: validatedData, error } = registerUserSchema.safeParse(data);
    if (error) return { status: "ERROR", message: error.issues[0].message };
    const { name, userName, email, password, role } = validatedData;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.userName, userName)));

    if (user) {
      if (user.email === email)
        return { status: "Error", message: "Email Aleready Exists" };
      else {
        return {
          status: "Error",
          message: "UserName Already Exists",
        };
      }
    }
    const hashPassword = await argon2.hash(password);
    const [result] = await db
      .insert(users)
      .values({ name, userName, email, password: hashPassword, role });

    if (role === "applicant") {
      await db.insert(applicants).values({ id: result.insertId });
    } else {
      await db.insert(employers).values({ id: result.insertId });
    }

    await createSessionAndSetCookies(result.insertId);
    return {
      status: "SUCCESS",
      message: "Registraipon Completed Successfully",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Unknown Error Occurred! Please Try Again Later",
    };
  }
};

type loginData = {
  email: string;
  password: string;
};

export const loginUserAction = async (data: loginData) => {
  try {
    const { email, password } = data;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return { status: "ERROR", message: "Invalid Email or Password" };
    }

    const isValidPassword = await argon2.verify(user.password, password);
    if (!isValidPassword) {
      return { status: "ERROR", message: "Invalid Email or Password" };
    }

    await createSessionAndSetCookies(user.id);

    return {
      status: "SUCCESS",
      message: "Login Succcessful",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Unknown Error Occurred! Please Try Again Later",
    };
  }
};

export const logoutUserAction = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return redirect("/login");

  const hashedToken = crypto
    .createHash("sha-256")
    .update(session)
    .digest("hex");

  await invalidateSession(hashedToken);
  cookieStore.delete("session");

  return redirect("/login");
};
