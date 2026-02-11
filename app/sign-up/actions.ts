"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { signUpSchema } from "@/lib/validations";
import { ServerActionResponse } from "@/types";

export async function signUpAction(formData: FormData): Promise<ServerActionResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Validate Input
  const validationResult = signUpSchema.safeParse({ name, email, password });

  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation failed",
      error: validationResult.error.issues.map((e) => e.message).join(", "),
    };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  // 2. Sign Up with Supabase
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Check your email to confirm your account.",
  };
}
