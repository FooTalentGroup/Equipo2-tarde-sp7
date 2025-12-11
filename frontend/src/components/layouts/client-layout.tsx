import type { ReactNode } from "react";

import Link from "next/link";

import SectionHeading from "@src/components/section-heading/index";
import { Input } from "@src/components/ui/input";
import { paths } from "@src/lib/paths";
import { Search } from "lucide-react";

interface ClientsLayoutProps {
	children: ReactNode;
	activeTab: "leads" | "inquilinos" | "propietarios";
}

export default function ClientsLayout({
	children,
	activeTab,
}: ClientsLayoutProps) {
	return (
		<div className="w-full">
			{/* Header */}
			<SectionHeading title="Clientes" />

			{/* Search and Navigation Tabs */}
			<div className="w-full">
				<div className="flex items-center my-4">
					<div className="w-full max-w-2/3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								type="text"
								placeholder="Buscar por nombre, DNI o dirección..."
								className="pl-10 h-7"
							/>
						</div>
					</div>

					<div className="justify-start gap-2 rounded-none bg-transparent px-5 text-black flex">
						<Link
							href={paths.agent.clients.leads.index()}
							className={`px-3 py-1.5 rounded-md transition-colors ${
								activeTab === "leads"
									? "bg-tertiary text-primary-foreground"
									: "bg-tertiary-light hover:bg-tertiary/30 hover:text-primary-foreground"
							}`}
						>
							Leads
						</Link>
						<Link
							href={paths.agent.clients.inquilinos.index()}
							className={`px-3 py-1.5 rounded-md transition-colors ${
								activeTab === "inquilinos"
									? "bg-tertiary text-primary-foreground"
									: "bg-tertiary-light hover:bg-tertiary/30 hover:text-primary-foreground"
							}`}
						>
							Inquilinos
						</Link>
						<Link
							href={paths.agent.clients.owners.index()}
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
