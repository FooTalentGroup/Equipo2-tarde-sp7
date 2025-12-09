import z from "zod";

export const ArchivePropertySchema = z.object({
	isEnabled: z.boolean(),
});

export type ArchiveProperty = z.infer<typeof ArchivePropertySchema>;
