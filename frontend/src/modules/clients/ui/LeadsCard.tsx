/* import { Badge } from "@src/components/ui/badge"; */
import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@src/components/ui/collapsible";
import { StatusBadge } from "@src/components/ui/status-badge";
import type { Client } from "@src/types/client";
import { ChevronDown, Mail, Phone } from "lucide-react";

export function LeadsCard({
	client,
	defaultOpen = false,
}: {
	client: Client;
	defaultOpen?: boolean;
}) {
	return (
		<Collapsible defaultOpen={defaultOpen}>
			<Card className="mb-3">
				<CardContent className="p-0">
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
									<span className="text-sm text-slate-500 mr-2">
										Origen: {client.origin}
									</span>
								)}
								<ChevronDown className="h-5 w-5 text-slate-400" />
							</div>
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent>
						<div className="border-t px-4 py-4 bg-slate-50">
							<div className="grid grid-cols-2 gap-6">
								<div>
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

								<div>
									<h4 className="font-semibold text-sm text-slate-900 mb-3">
										Información del Lead
									</h4>
									<div className="space-y-2">
										{client.origin && (
											<div className="text-sm">
												<span className="text-slate-500">Origen:</span>
												<span className="ml-2 text-slate-900">
													{client.origin}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							{client.interest && (
								<div className="mt-4 pt-4 border-t">
									<h4 className="font-semibold text-sm text-slate-900 mb-2">
										Interés
									</h4>
									<p className="text-sm text-slate-600">{client.interest}</p>
								</div>
							)}

							<div className="flex gap-2 mt-4 pt-4 border-t">
								<Button size="lg">Convertir en cliente</Button>
								<Button
									variant="outline"
									size="lg"
									className="border-[#D8D8D8]"
								>
									Enviar propuestas
								</Button>
							</div>
						</div>
					</CollapsibleContent>
				</CardContent>
			</Card>
		</Collapsible>
	);
}
