import Link from "next/link";

import { Button } from "@src/components/ui/button";

export default function PropertyNotFound() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="text-center max-w-md mx-auto">
				<h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
				<h2 className="text-2xl font-bold mb-2">Propiedad no encontrada</h2>
				<p className="text-muted-foreground mb-6">
					La propiedad que buscas no existe o ha sido eliminada.
				</p>
				<Button asChild>
					<Link href="/properties">Volver a propiedades</Link>
				</Button>
			</div>
		</div>
	);
}
