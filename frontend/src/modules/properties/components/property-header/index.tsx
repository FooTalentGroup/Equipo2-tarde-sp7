import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { Heading } from "@src/components/ui/heading";
import { PlusIcon } from "lucide-react";

export default function PropertyHeader() {
	return (
		<Card>
			<CardContent className="flex items-center gap-4 justify-between">
				<Heading variant="h2" weight="semibold" className="text-secondary">
					Buscar propiedad
				</Heading>
				<Button size="lg">
					<PlusIcon className="" />
					Agregar propiedad
				</Button>
			</CardContent>
		</Card>
	);
}
