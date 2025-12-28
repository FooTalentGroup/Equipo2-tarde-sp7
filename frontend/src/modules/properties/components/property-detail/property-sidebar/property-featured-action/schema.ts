import z from "zod";

export const ArchivePropertySchema = z.object({
	isFeatured: z.boolean(),
});

export type ArchiveProperty = z.infer<typeof ArchivePropertySchema>;
