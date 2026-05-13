import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Podaj prawidłowy email")
    .min(1, "Email jest wymagany"),
  password: z
    .string()
    .min(6, "Hasło musi mieć minimum 6 znaków")
    .min(1, "Hasło jest wymagane")
    .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
    .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę")
    .regex(
      /[@$!%*?&]/,
      "Hasło musi zawierać przynajmniej jeden znak specjalny",
    ),
  name: z.string().min(1, "Nazwa użytkownika jest wymagana"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Podaj prawidłowy email")
    .min(1, "Email jest wymagany"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

const passwordSchema = z
  .string()
  .min(6, "Hasło musi mieć minimum 6 znaków")
  .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
  .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę")
  .regex(
    /[@$!%*?&]/,
    "Hasło musi zawierać przynajmniej jeden znak specjalny",
  );

export const updateCurrentUserSchema = z
  .object({
    name: z.string().trim().min(1, "Nazwa użytkownika jest wymagana").optional(),
    currentPassword: z.string().min(1, "Obecne hasło jest wymagane").optional(),
    newPassword: passwordSchema.optional(),
  })
  .refine((data) => data.name !== undefined || data.newPassword !== undefined, {
    message: "Podaj dane do aktualizacji",
  })
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: "Obecne hasło jest wymagane",
    path: ["currentPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type UpdateCurrentUserData = z.infer<typeof updateCurrentUserSchema>;
