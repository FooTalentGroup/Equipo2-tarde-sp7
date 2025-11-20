import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@src/components/ui/collapsible";
import { StatusBadge } from "@src/components/ui/status-badge";
import type { Client } from "@src/types/client";
import { Building2, ChevronDown, Mail, Phone } from "lucide-react";

export function PropertyOwnerCard({
	client,
	defaultOpen = false,
}: {
	client: Client;
	defaultOpen?: boolean;
}) {
	return (
		<Collapsible defaultOpen={defaultOpen}>
			<Card className="mb-3">
				<CardContent className="p-0 focus-visible:outline-none">
					<CollapsibleTrigger className="w-full">
						<div className="flex items-center justify-between px-4 pb-4 transition-colors">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
									{client.name.charAt(0)}
								</div>
								<div className="text-left">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-slate-900">
											{client.name}
										</span>
										<StatusBadge status={client.type} className="text-xs">
											{client.type}
										</StatusBadge>
									</div>
									<div className="text-sm text-slate-500 mt-1">
										DNI: {client.dni} · {client.address}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{client.origin && (
									<div className="flex flex-col text-end text-black mr-2">
										<small>Propiedades</small>
										<strong className="text-2xl">{client.origin}</strong>
									</div>
								)}
								<ChevronDown className="h-5 w-5 text-slate-400" />
							</div>
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent>
						<div className="px-4 py-4">
							<div className="grid grid-cols-2 gap-6">
								{/* Contact */}
								<div className="border-grey-light border p-4 rounded-lg">
									<h4 className="font-semibold text-sm text-slate-900 mb-3">
										Contacto
									</h4>
									<div className="space-y-2">
										{client.phone && (
											<div className="flex items-center gap-2 text-sm text-slate-600">
												<Phone className="h-4 w-4" />
												<span>{client.phone}</span>
											</div>
										)}
										{client.email && (
											<div className="flex items-center gap-2 text-sm text-slate-600">
												<Mail className="h-4 w-4" />
												<span>{client.email}</span>
											</div>
										)}
									</div>
								</div>
								{/* Portfolio */}
								<div className="border-grey-light border p-4 rounded-lg">
									<h4 className="font-semibold text-sm text-slate-900 mb-3">
										Portafolio
									</h4>
									<div className="space-y-2">
										{client.origin && (
											<div className="flex items-center gap-2 text-sm text-slate-600">
												<Building2 className="h-4 w-4" />
												{client.origin} propiedades
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="flex gap-2 mt-4 pt-4">
								<Button size="lg">Ver propiedades</Button>
								<Button
									variant="outline"
									size="lg"
									className="border-[#D8D8D8]"
								>
									Enviar informe
								</Button>
							</div>
						</div>
					</CollapsibleContent>
				</CardContent>
			</Card>
		</Collapsible>
	);
}
