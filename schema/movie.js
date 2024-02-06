import z from 'zod'

const movieSchema = z.object({
    title: z.string({
      invalid_type_error: 'El nombre de la pelicula debe ser una cadena de texto',
    }),
    id: z.integer({
      invalid_type_error: 'el id de la pelicula debe ser un numero entero',
    }),
   
  })

  export function validateMovie (input) {
    return movieSchema.safeParse(input)
  }
  