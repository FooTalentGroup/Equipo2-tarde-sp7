import "server-only";

import { cookies } from "next/headers";

import type { User } from "@src/types";

const TOKEN_NAME = "auth_token";
const USER_DATA_NAME = "auth_user";

/**
 * Configura una sesión guardando el token y datos del usuario en cookies
 */
export async function setSession(token: string, user: User) {
	const cookieStore = await cookies();

	// Guardar token (httpOnly para seguridad)
	cookieStore.set(TOKEN_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 días
		path: "/",
	});

	// Guardar datos del usuario (no httpOnly para que el cliente pueda leerlo)
	cookieStore.set(USER_DATA_NAME, JSON.stringify(user), {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 días
		path: "/",
	});
}

/**
 * Obtiene el token de la sesión actual
 */
export async function getToken(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get(TOKEN_NAME)?.value;
}

/**
 * Obtiene los datos del usuario de la sesión actual
 */
export async function getUser(): Promise<User | null> {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get(USER_DATA_NAME)?.value;

	if (!userCookie) {
		return null;
	}

	try {
		return JSON.parse(userCookie) as User;
	} catch {
		return null;
	}
}

/**
 * Elimina la sesión
 */
export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(TOKEN_NAME);
	cookieStore.delete(USER_DATA_NAME);
}

/**
 * Verifica si hay una sesión activa
 */
export async function hasSession(): Promise<boolean> {
	const token = await getToken();
	return !!token;
}
