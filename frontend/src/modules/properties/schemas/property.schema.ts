import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3, "El título es obligatorio"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Debe ser mayor a 0"),
  address: z.string().min(3, "Dirección obligatoria"),
  city: z.string().min(2, "Ciudad obligatoria"),
  beds: z.coerce.number().min(0),
  baths: z.coerce.number().min(0),
});

export type CreatePropertyDto = z.infer<typeof createPropertySchema>;
