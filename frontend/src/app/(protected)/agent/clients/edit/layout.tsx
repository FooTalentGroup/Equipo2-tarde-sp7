"use client";

import type { ReactNode } from "react";

import SectionHeading from "@src/components/section-heading/index";

interface ClientsLayoutProps {
	children: ReactNode;
}

export default function CreateClientLayout({ children }: ClientsLayoutProps) {
	return (
		<div className="w-full mx-auto">
			{/* Header */}
			<SectionHeading title="Editar cliente" />

			{/* Content Area - Aquí se renderiza el contenido de cada página */}
			<div className="mt-0">{children}</div>
		</div>
	);
}
