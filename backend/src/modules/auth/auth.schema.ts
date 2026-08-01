import { email, z } from "zod";

export const registerUserSchema = z
  .object({
    email: z.email("Invalid email").trim().toLowerCase(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(72, "Password must be at most 72 characters long"),
    confirmPassword: z.string(),
    captchaToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and ConfirmPassword do not match",
  });
export const loginUserSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),
  password: z.string(),
});
export type logingUserDTO = z.infer<typeof loginUserSchema>;
export type registerUserDTO = z.infer<typeof registerUserSchema>;
