"use client";

import { useState } from "react";

import Link from "next/link";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@src/components/ui/dialog";
import { StatusBadge } from "@src/components/ui/status-badge";
import { paths } from "@src/lib/paths";
import type { Owner } from "@src/types/clients/owner";
import { Building2, FileText, Mail, Phone } from "lucide-react";

export function OwnerCard({ owner }: { owner: Owner }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Card
				className="mb-3 cursor-pointer hover:bg-slate-50 transition-colors"
				onClick={() => setIsOpen(true)}
			>
				<CardContent className="p-0 w-full">
					<div className="flex items-center justify-between px-4 py-4 transition-colors">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
								{owner.first_name.charAt(0)}
							</div>                                                                                                                                                                                                                     
							<div className="text-left">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-slate-900">
										{owner.first_name} {owner.last_name}
									</span>
									<StatusBadge status="propietario">Propietario</StatusBadge>
								</div>
								<div className="text-sm text-slate-500 mt-1">
									Tel: {owner.phone} · {owner.address}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-right">
								<div className="text-xs text-slate-500">Propiedades</div>
								<div className="text-lg font-semibold text-slate-900">
									{/* {owner.properties_count || 3} */} 3
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="w-full min-w-2xl bg-white max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<div className="flex items-center justify-between px-4 py-4 transition-colors">
							<div className="flex items-center gap-4">
								<DialogTitle className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
									{owner.first_name.charAt(0)}
								</DialogTitle>
								<div className="text-left">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-slate-900">
											{owner.first_name} {owner.last_name}
										</span>
										<StatusBadge status="propietario">Propietario</StatusBadge>
									</div>
									<div className="text-sm text-slate-500 mt-1">
										Tel: {owner.phone} · {owner.address}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="text-right">
									<div className="text-xs text-slate-500">Propiedades</div>
									<div className="text-2xl font-bold text-slate-900">
										{/* {owner.properties_count || 3} */} 3
									</div>
								</div>
							</div>
						</div>
					</DialogHeader>

					<div>
						<div className="grid grid-cols-2 gap-6 mb-4">
							{/* Contacto */}
							<div className="border border-slate-200 p-4 rounded-lg">
								<h4 className="font-semibold text-sm text-slate-900 mb-3">
									Contacto
								</h4>
								<div className="space-y-2">
									{owner.phone && (
										<div className="flex items-center gap-2 text-sm text-slate-600">
											<Phone className="h-4 w-4" />
											<span>{owner.phone}</span>
										</div>
									)}
									{owner.email && (
										<div className="flex items-center gap-2 text-sm text-slate-600">
											<Mail className="h-4 w-4" />
											<span>{owner.email}</span>
										</div>
									)}
								</div>
							</div>

							{/* Información */}
							<div className="border border-slate-200 p-4 rounded-lg">
								<h4 className="font-semibold text-sm text-slate-900 mb-3">
									Información
								</h4>
								<div className="flex items-center text-sm">
									<span>
										<Building2 className="inline h-4 w-4 mr-1" />
										{/* {owner.properties_count || 3} */} 3 propiedades
									</span>
								</div>
							</div>
						</div>

						{/* Notas */}
						<div className="border border-slate-200 p-4 rounded-lg mb-4">
							<h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Notas
							</h4>
							<div className="bg-slate-50 p-3 rounded-md max-h-40 overflow-y-auto">
								<p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
									{owner.notes ||
										"No hay notas registradas para este propietario."}
								</p>
							</div>
						</div>

						{/* Botones de acción */}
						<div className="flex justify-end">
							<Button size="lg" variant="tertiary" asChild>
								<Link href={paths.agent.owners.detail(owner.id)}>
									Ver propiedades
								</Link>
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
