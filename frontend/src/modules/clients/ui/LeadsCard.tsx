"use client";

import { useState } from "react";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@src/components/ui/dialog";
import { StatusBadge } from "@src/components/ui/status-badge";
import type { Client } from "@src/types/client";
import { Mail, Phone } from "lucide-react";

export function LeadsCard({ client }: { client: Client }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Card
				className="mb-3 cursor-pointer hover:bg-slate-50 transition-colors"
				onClick={() => setIsOpen(true)}
			>
				<CardContent className="p-0 w-full">
					<div className="flex items-center justify-between px-4 py-3 transition-colors">
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
										{client.type.charAt(0).toUpperCase() + client.type.slice(1)}
									</StatusBadge>
								</div>
								<div className="text-sm text-slate-500 mt-1">
									Tel: {client.phone} · {client.email}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-2xl bg-grey-fill">
					<DialogHeader>
						<div className="flex items-center justify-between transition-colors border border-slate-200 rounded-lg p-4 mt-4">
							<div className="flex items-center gap-4">
								<DialogTitle className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
									{client.name.charAt(0)}
								</DialogTitle>
								<div className="text-left">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-slate-900">
											{client.name}
										</span>
										<StatusBadge status={client.type} className="text-xs">
											{client.type.charAt(0).toUpperCase() +
												client.type.slice(1)}
										</StatusBadge>
									</div>
									<div className="text-sm text-slate-500 mt-1">
										Tel: {client.phone} · {client.email}
									</div>
								</div>
							</div>
						</div>
					</DialogHeader>

					<div className="space-y-4 mt-1">
						{/* Sección de Contacto */}
						<div className="border border-slate-200 rounded-lg p-4">
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

						{/* Sección de Información del Lead */}
						<div className="border border-slate-200 rounded-lg p-4">
							<h4 className="font-semibold text-sm text-slate-900 mb-3">
								Información del Lead
							</h4>
							<div className="space-y-2">
								{client.origin && (
									<div className="text-sm">
										<span className="text-slate-500">Origen:</span>
										<span className="ml-2 text-slate-900">{client.origin}</span>
									</div>
								)}
							</div>
						</div>

						{/* Sección de Interés */}
						{client.interest && (
							<div className="border border-slate-200 rounded-lg p-4">
								<h4 className="font-semibold text-sm text-slate-900 mb-2">
									Interés
								</h4>
								<p className="text-sm text-slate-600">{client.interest}</p>
							</div>
						)}

						{/* Botones de acción */}
						<div className="flex gap-2 pt-4">
							<DialogClose asChild>
								<Button
									variant="outline"
									size="lg"
									className="flex-1 border-slate-300"
								>
									Cerrar
								</Button>
							</DialogClose>
							<Button size="lg" className="flex-1" variant="tertiary">
								Convertir en inquilino
							</Button>
						</div>
					</div>
					<div></div>
				</DialogContent>
			</Dialog>
		</>
	);
}
