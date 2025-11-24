import { type NextRequest, NextResponse } from "next/server";

import { paths } from "./lib/paths";

export function proxy(request: NextRequest) {
	const token = request.cookies.get("auth_token")?.value;
	const isAuthPage =
		request.nextUrl.pathname.startsWith(paths.auth.login()) ||
		request.nextUrl.pathname.startsWith(paths.auth.register());
	// Proteger todas las rutas bajo /admin/*
	const isProtectedPage = request.nextUrl.pathname.startsWith("/admin");

	//Si está en una página protegida y no tiene token, redirigir a login
	if (isProtectedPage && !token) {
		const loginUrl = new URL(paths.auth.login(), request.url);
		loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
	}

	//Si está autenticado y trata de acceder a login/register, redirigir al dashboard
	if (isAuthPage && token) {
		const redirectTo = request.nextUrl.searchParams.get("redirect");
		const destination = redirectTo || paths.admin.properties.index();
		return NextResponse.redirect(new URL(destination, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|images).*)",
	],
};
