import { api } from "@src/lib/axios";
import { UserHeader, UserList } from "@src/modules/admin/components";
import type { ListUserProps } from "@src/modules/admin/types";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
	try {
		const { users } = await api.get<ListUserProps>("/users");

		return (
			<section className="grid min-h-dvh max-h-fit grid-rows-[auto_1fr]">
				<header className="flex justify-between border-b border-border pb-8">
					<UserHeader />
				</header>
				<main>
					<UserList users={users} />
				</main>
			</section>
		);
	} catch (error) {
		// Manejo de errores
		console.error("Error al cargar usuarios:", error);

		// Mensaje de error amigable para el usuario
		const errorMessage =
			error instanceof Error
				? error.message
				: "Ocurrió un error al cargar los usuarios";

		return (
			<section className="grid min-h-dvh max-h-fit grid-rows-[auto_1fr_auto]">
				<header className="flex justify-between border-b border-border pb-8">
					<UserHeader />
				</header>
				<main className="flex flex-col items-center justify-center h-full">
					<div className="text-center p-8">
						<p className="text-red-500 text-lg font-medium mb-4">
							❌ {errorMessage}
						</p>
						<p className="text-gray-600">
							Por favor, intenta nuevamente más tarde.
						</p>
					</div>
				</main>
			</section>
		);
	}
}
