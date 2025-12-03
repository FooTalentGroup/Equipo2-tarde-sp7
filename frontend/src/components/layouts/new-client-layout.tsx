import type { ReactNode } from "react";

import Link from "next/link";

import SectionHeading from "@src/components/section-heading/index";
import { paths } from "@src/lib/paths";

interface ClientsLayoutProps {
	children: ReactNode;
	activeTab: "leads" | "inquilinos" | "propietarios";
}

export default function ClientsLayout({
	children,
	activeTab,
}: ClientsLayoutProps) {
	return (
		<div className="w-full mx-auto">
			{/* Header */}
			<SectionHeading title="Nuevo cliente" />

			{/* Search and Navigation Tabs */}
			<div className="w-full">
				<div className="flex items-center my-4">
					<div className="justify-start gap-2 rounded-none bg-transparent px-5 text-black flex">
						<Link
							href={paths.agent.clients.newLeads()}
							className={`px-3 py-1.5 rounded-md transition-colors ${
								activeTab === "leads"
									? "bg-tertiary text-primary-foreground"
									: "bg-tertiary-light hover:bg-tertiary/30 hover:text-primary-foreground"
							}`}
						>
							Leads
						</Link>
						<Link
							href={paths.agent.clients.newInquilinos()}
							className={`px-3 py-1.5 rounded-md transition-colors ${
								activeTab === "inquilinos"
									? "bg-tertiary text-primary-foreground"
									: "bg-tertiary-light hover:bg-tertiary/30 hover:text-primary-foreground"
							}`}
						>
							Inquilinos
						</Link>
						<Link
							href={paths.agent.owners.new()}
							className={`px-3 py-1.5 rounded-md transition-colors ${
								activeTab === "propietarios"
									? "bg-tertiary text-primary-foreground"
									: "bg-tertiary-light hover:bg-tertiary/30 hover:text-primary-foreground"
							}`}
						>
							Propietarios
						</Link>
					</div>
				</div>
			</div>

			{/* Content Area - Aquí se renderiza el contenido de cada página */}
			<div className="mt-0">{children}</div>
		</div>
	);
}
