import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, "Hasło musi mieć co najmniej 6 znaków")
  .regex(/[A-Z]/, "Hasło musi zawierać przynajmniej jedną wielką literę")
  .regex(/[0-9]/, "Hasło musi zawierać przynajmniej jedną cyfrę")
  .regex(/[@$!%*?&]/, "Hasło musi zawierać przynajmniej jeden znak specjalny");

export const loginFormSchema = z.object({
  email: z.string().trim().min(1, "Email jest wymagany").email("Podaj poprawny email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const forgotPasswordFormSchema = z.object({
  email: z.string().trim().min(1, "Email jest wymagany").email("Podaj poprawny email"),
});

export const registerFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nazwa jest wymagana")
      .min(3, "Nazwa musi mieć minimum 3 znaki"),
    email: z.string().trim().min(1, "Email jest wymagany").email("Podaj poprawny email"),
    password: passwordSchema,
    repeatPassword: z.string().min(1, "Powtórz hasło"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła nie są identyczne",
    path: ["repeatPassword"],
  });

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nazwa użytkownika jest wymagana")
    .min(3, "Nazwa musi mieć minimum 3 znaki"),
});

export const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Obecne hasło jest wymagane"),
    newPassword: passwordSchema,
    repeatNewPassword: z.string().min(1, "Powtórz nowe hasło"),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Hasła nie są identyczne",
    path: ["repeatNewPassword"],
  });

export const resetPasswordFormSchema = z
  .object({
    token: z.string().trim().min(1, "Token resetu hasła jest wymagany"),
    newPassword: passwordSchema,
    repeatNewPassword: z.string().min(1, "Powtórz nowe hasło"),
  })
  .refine((data) => data.newPassword === data.repeatNewPassword, {
    message: "Hasła nie są identyczne",
    path: ["repeatNewPassword"],
  });

export const checkoutFormSchema = z.object({
  shippingCity: z
    .string()
    .trim()
    .min(1, "Podaj miasto")
    .min(2, "Miasto musi mieć minimum 2 znaki"),
  shippingPostalCode: z
    .string()
    .trim()
    .min(1, "Podaj kod pocztowy")
    .regex(/^\d{2}-\d{3}$/, "Kod pocztowy powinien mieć format 00-000"),
  shippingStreet: z.string().trim().min(1, "Podaj ulicę"),
  shippingHouseNumber: z.string().trim().min(1, "Podaj numer domu"),
  shippingType: z.enum(["courier", "parcel_locker", "pickup"]),
  paymentType: z.enum(["card", "blik", "cash_on_delivery"]),
});

const optionalDateTimeInput = z
  .string()
  .optional()
  .transform((value) => (value ? new Date(value).toISOString() : undefined));

export const productFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nazwa produktu jest wymagana")
      .min(3, "Nazwa musi mieć minimum 3 znaki"),
    slug: z.string().trim().min(1, "Slug jest wymagany"),
    description: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined),
    imageUrl: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || undefined)
      .pipe(z.string().url("Podaj poprawny adres URL zdjęcia").optional()),
    price: z.coerce.number().min(0, "Cena nie może być ujemna"),
    promoPrice: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().min(0, "Cena promocyjna nie może być ujemna").optional(),
    ),
    promoStartsAt: optionalDateTimeInput,
    promoEndsAt: optionalDateTimeInput,
    stock: z.coerce
      .number()
      .int("Stan magazynowy musi być liczbą całkowitą")
      .min(0, "Stan magazynowy nie może być ujemny"),
    categoryId: z.string().min(1, "Kategoria jest wymagana"),
  })
  .refine(
    ({ price, promoPrice }) => promoPrice === undefined || promoPrice < price,
    {
      message: "Cena promocyjna musi być niższa od ceny regularnej",
      path: ["promoPrice"],
    },
  )
  .refine(
    ({ promoStartsAt, promoEndsAt }) =>
      !promoStartsAt || !promoEndsAt || new Date(promoStartsAt) < new Date(promoEndsAt),
    {
      message: "Start promocji musi być wcześniejszy niż koniec",
      path: ["promoStartsAt"],
    },
  );

export const priceFilterSchema = z
  .object({
    minPrice: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().min(0, "Cena minimalna nie może być ujemna").optional(),
    ),
    maxPrice: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().min(0, "Cena maksymalna nie może być ujemna").optional(),
    ),
  })
  .refine(
    ({ minPrice, maxPrice }) =>
      minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice,
    {
      message: "Cena minimalna nie może być większa od maksymalnej",
      path: ["minPrice"],
    },
  );

export const getFirstZodError = (error: z.ZodError) =>
  error.issues[0]?.message ?? "Podaj poprawne dane";
