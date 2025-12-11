import Link from "next/link";

import { Text } from "@src/components/ui/text";
import { paths } from "@src/lib/paths";
import { Plus } from "lucide-react";

export const AdminCreateLink = () => {
	return (
		<Link
			href={paths.admin.users.create()}
			className="bg-sidebar-accent-foreground px-6 py-3 cursor-pointer text-white gap-2 rounded-tl-lg rounded-bl-lg hover:bg-outline-foreground transition-colors duration-300 flex items-center min-w-max!"
		>
			<Plus className="text-white stroke-white inline" size={14} />
			<Text weight="normal" variant="body" className="inline">
				Crear usuario
			</Text>
		</Link>
	);
};
