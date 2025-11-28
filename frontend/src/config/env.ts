import { z } from "zod";

const envSchema = z.object({
	NEXT_PUBLIC_API_URL: z.string().url({
		message: "NEXT_PUBLIC_API_URL debe ser una URL válida",
	}),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
	try {
		return envSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const zodError = error as z.ZodError;
			//@ts-expect-error
			const missingVars = zodError.errors.map((err) => {
				return ` ${err.path.join(".")}: ${err.message}`;
			});

			console.error(" Error en validación de variables de entorno:");
			console.error(missingVars.join("\n"));
			console.error(
				"\n💡 Asegúrate de que tu archivo .env tiene todas las variables requeridas con el prefijo NEXT_PUBLIC_",
			);

			throw new Error(
				"Configuración de variables de entorno inválida. Revisa la consola para más detalles.",
			);
		}
		throw error;
	}
}

export const env = validateEnv();
