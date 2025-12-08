import Link from "next/link";

import { Heading } from "@src/components/ui/heading";
import { Text } from "@src/components/ui/text";
import { paths } from "@src/lib/paths";
import { Plus } from "lucide-react";

export const UserHeader = () => {
	return (
		<>
			<Heading variant="h3" className="text-secondary" weight="semibold">
				Usuarios
			</Heading>
			<Link
				href={paths.admin.users.create()}
				className="bg-sidebar-accent-foreground px-6 py-3 cursor-pointer text-white flex items-center gap-2 rounded-md hover:bg-outline-foreground transition-colors duration-300"
			>
				<Plus className="text-white stroke-white" />
				<Text weight="normal" variant="body">
					Crear usuario
				</Text>
			</Link>
		</>
	);
};
