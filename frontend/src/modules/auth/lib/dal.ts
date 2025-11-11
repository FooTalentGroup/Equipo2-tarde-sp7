import "server-only";
import { cache } from "react";

import type { User } from "@src/types";

import { getToken, getUser } from "./session";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Verifica la sesión actual consultando al backend
 * Usa React cache() para evitar múltiples llamadas en un mismo render
 */
export const verifySession = cache(
	async (): Promise<{
		isAuth: boolean;
		user: User | null;
	}> => {
		const token = await getToken();

		if (!token) {
			return { isAuth: false, user: null };
		}

		try {
			// Verificar el token con el backend
			const response = await fetch(`${API_URL}/auth/me`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				cache: "no-store", // No cachear la respuesta del usuario
			});

			if (!response.ok) {
				return { isAuth: false, user: null };
			}

			const user: User = await response.json();
			return { isAuth: true, user };
		} catch (error) {
			console.error("Error verifying session:", error);
			return { isAuth: false, user: null };
		}
	},
);

/**
 * Obtiene el usuario actual (primero desde cookie, luego verifica con backend)
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
	// Primero intentar obtener de la cookie
	const userFromCookie = await getUser();

	if (userFromCookie) {
		// Verificar que la sesión sea válida
		const { isAuth, user } = await verifySession();
		return isAuth ? user : null;
	}

	return null;
});

/**
 * Verifica si el usuario tiene un rol específico
 */
export async function checkUserRole(allowedRoles: string[]): Promise<boolean> {
	const user = await getCurrentUser();

	if (!user) {
		return false;
	}

	return allowedRoles.includes(user.role);
}
