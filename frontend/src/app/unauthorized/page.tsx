import Link from "next/link";

import { Button } from "@src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@src/components/ui/card";
import { paths } from "@src/lib/paths";
import { getCurrentUser } from "@src/modules/auth/lib/dal";
import { ShieldAlert } from "lucide-react";

export default async function UnauthorizedPage() {
	const user = await getCurrentUser();

	const dashboardPath = user
		? user.role === "admin"
			? paths.admin.dashboard()
			: paths.agent.dashboard()
		: paths.auth.login();

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center space-y-4">
					<div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
						<ShieldAlert className="w-8 h-8 text-destructive" />
					</div>
					<CardTitle className="text-2xl">Acceso No Autorizado</CardTitle>
					<CardDescription className="text-base">
						No tienes permisos para acceder a esta página
					</CardDescription>
				</CardHeader>
				<CardContent className="text-center text-sm text-muted-foreground">
					{user ? (
						<p>
							Tu rol actual ({user.role}) no tiene acceso a este recurso.
							Contacta al administrador si crees que esto es un error.
						</p>
					) : (
						<p>Necesitas iniciar sesión para acceder a este recurso.</p>
					)}
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Button asChild className="w-full">
						<Link href={dashboardPath}>
							{user ? "Volver al Dashboard" : "Iniciar Sesión"}
						</Link>
					</Button>
					<Button asChild variant="outline" className="w-full">
						<Link href={paths.public.landing()}>Ir al Inicio</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
