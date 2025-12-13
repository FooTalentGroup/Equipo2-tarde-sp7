import { z } from "zod";

export const noteClientSchema = z.object({
	notes: z.string().min(1, "La nota es requerida"),
});

export type NoteClientFormData = z.infer<typeof noteClientSchema>;
