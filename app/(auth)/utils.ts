import { getEmailAuthUtils } from "naystack/auth/email/client";

export const { useLogin, useLogout, useSignUp } =
  getEmailAuthUtils("/api/email");
