import { Heading } from "@src/components/ui/heading";
import { getAuthenticatedUser } from "@src/modules/auth/lib/utils";

export const metadata = {
	title: "Dashboard",
	description: "Gestión de propiedades inmobiliarias",
};

export default async function DashboardPage() {
	const user = await getAuthenticatedUser();

	return (
		<section>
			<h1 className="text-3xl font-bold mb-4">
				Bienvenido, {user?.first_name} {user?.last_name}
			</h1>
			<Heading variant="subtitle1">Dashboard</Heading>
		</section>
	);
}
