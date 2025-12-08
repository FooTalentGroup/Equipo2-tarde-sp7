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
			<Heading variant="h3" weight="semibold">
				Bienvenido, {user?.first_name} {user?.last_name}
			</Heading>
		</section>
	);
}
