import z from "zod";

export const registerUserSchema = z.object({
    name: z
        .string()
        .trim(),
    email: z
        .email({message: "Enter a valid email"})
        .trim(),
    password: z
        .string()
        .min(8, "Length of password should be atleast 8 characters")
        .max(13, "Length of password must not exceed 13 characters")
});

export const loginUserSchema = z.object({
    email: z
        .email({message: "Enter a valid email"})
        .trim(),
    password: z
        .string()
        .min(8, "Length of password should be atleast 8 characters")
        .max(13, "Length of password must not exceed 13 characters")
});
