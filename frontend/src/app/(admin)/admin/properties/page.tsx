"use client";

import { PropertiesClient } from "./PropertiesClient";

// export const metadata = {
// 	title: "Propiedades",
// 	description: "Gestión de propiedades inmobiliarias",
// };

export default function PropertiesPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<PropertiesClient />
		</div>
	);
}
