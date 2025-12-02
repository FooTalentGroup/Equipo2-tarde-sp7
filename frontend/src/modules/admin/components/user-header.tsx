import Link  from "next/link"
import { Plus } from "lucide-react";
import { Text } from "@src/components/ui/text"
import { Heading } from "@src/components/ui/heading";

export const UserHeader = () => {
  return <>
        <Heading variant="h3" className="text-secondary" weight="semibold">Usuarios</Heading>
				<Link href="#" className="bg-sidebar-accent-foreground px-6 py-3 cursor-pointer text-white flex items-center gap-2 rounded-md hover:bg-outline-foreground transition-colors duration-300">
				<Plus className="text-white stroke-white" />
				<Text weight="normal" variant="body">Crear usuario</Text>
				</Link>
    </>
}