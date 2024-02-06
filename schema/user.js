import { z } from 'zod';

const userSchema = z.object({
    // Nombre de usuario (debe ser una cadena)
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(50, 'El nombre de usuario no puede exceder los 50 caracteres'),
    // Correo electrónico (debe ser una cadena válida de correo electrónico)
    email: z.string().email('El correo electrónico debe tener un formato válido'),
    // Contraseña (debe ser una cadena con cierta complejidad)
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export function validateUser (input) {
    return userSchema.safeParse(input)
  }
  