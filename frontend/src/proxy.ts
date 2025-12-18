import { type NextRequest, NextResponse } from "next/server";

import { paths } from "./lib/paths";
import { ROLES } from "./types/user";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("auth_token")?.value;
	const userCookie = request.cookies.get("auth_user")?.value;

	let user = null;
	if (userCookie) {
		try {
			user = JSON.parse(userCookie);
		} catch {
			const response = NextResponse.redirect(
				new URL(paths.auth.login(), request.url),
			);
			response.cookies.delete("auth_token");
			response.cookies.delete("auth_user");
			return response;
		}
	}

	const isAuthPage =
		pathname.startsWith(paths.auth.login()) ||
		pathname.startsWith(paths.auth.register());

	const isProtectedPage =
		pathname.startsWith("/admin") || pathname.startsWith("/agent");

	if (isProtectedPage && !token) {
		const loginUrl = new URL(paths.auth.login(), request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (user && token) {
		const userRole = user.role;

		if (pathname.startsWith("/agent") && userRole === ROLES.ADMIN) {
			return NextResponse.redirect(
				new URL(paths.admin.dashboard(), request.url),
			);
		}

		if (pathname.startsWith("/admin") && userRole === ROLES.AGENT) {
			return NextResponse.redirect(
				new URL(paths.agent.dashboard(), request.url),
			);
		}

		if (isAuthPage) {
			const redirectTo = request.nextUrl.searchParams.get("redirect");
			const dashboardPath =
				userRole === ROLES.ADMIN
					? paths.admin.dashboard()
					: paths.agent.dashboard();
			const destination = redirectTo || dashboardPath;
			return NextResponse.redirect(new URL(destination, request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
