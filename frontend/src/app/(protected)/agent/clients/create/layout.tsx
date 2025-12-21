"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SectionHeading from "@src/components/section-heading/index";
import { paths } from "@src/lib/paths";

interface ClientsLayoutProps {
	children: ReactNode;
}

export default function CreateClientLayout({ children }: ClientsLayoutProps) {
	type Tab = "leads" | "inquilinos" | "propietarios";
	const pathname = usePathname() || "";
	let activeTab: Tab = "leads";

	const tabMappings: { tab: Tab; matchPaths: string[] }[] = [
		{
			tab: "leads",
			matchPaths: [
				paths.agent.clients.leads.new(),
				paths.agent.clients.leads.index(),
			],
		},
		{
			tab: "inquilinos",
			matchPaths: [
				paths.agent.clients.inquilinos.new(),
				paths.agent.clients.inquilinos.index(),
			],
		},
		{
			tab: "propietarios",
			matchPaths: [
				paths.agent.clients.owners.new(),
				paths.agent.clients.owners.index(),
			],
		},
	];

	for (const mapping of tabMappings) {
		if (mapping.matchPaths.some((p) => p && pathname.startsWith(p))) {
			activeTab = mapping.tab;
			break;
		}
	}
	return (
		<div className="w-full mx-auto">
			<SectionHeading title="Nuevo cliente" />

			{/* Search and Navigation Tabs */}
			<div className="w-full">
				<div className="flex items-center my-4">
					<div className="justify-start gap-2 rounded-none bg-transparent text-black flex">
						<Link
							href={paths.agent.clients.leads.new()}
							className={`px-3 py-1.5 rounded-md transition-colors ${
								activeTab === "leads"
									? "bg-tertiary text-primary-foreground"
									: "bg-tertiary-light hover:bg-tertiary/30 hover:text-primary-foreground"
							}`}
						>
							Leads
						</Link>
						<Link
							href={paths.agent.clients.inquilinos.new()}
							className={`px-3 py-1.5 rounded-md transition-colors ${
								activeTab === "inquilinos"
									? "bg-tertiary text-primary-foreground"
									: "bg-tertiary-light hover:bg-tertiary/30 hover:text-primary-foreground"
							}`}
						>
							Inquilinos
						</Link>
						<Link
							href={paths.agent.clients.owners.new()}
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

			<div className="mt-0">{children}</div>
		</div>
	);
}
