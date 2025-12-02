"use client";

import { useState } from "react";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@src/components/ui/dialog";
import { StatusBadge } from "@src/components/ui/status-badge";
import type { Tenant } from "@src/types/client";
import { Mail, Phone, TrendingUp } from "lucide-react";

export function TenantCard({ tenant }: { tenant: Tenant }) {
	const [isOpen, setIsOpen] = useState(false);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("es-AR", {
			style: "currency",
			currency: "ARS",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString("es-AR", {
			day: "2-digit",
			month: "short",
		});
	};

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
								{tenant.name.charAt(0)}
							</div>
							<div className="text-left">
								<div className="flex items-center gap-2">
									<span className="font-semibold text-slate-900">
										{tenant.name}
									</span>
									<StatusBadge status="inquilino">{tenant.type}</StatusBadge>
								</div>
								<div className="text-sm text-slate-500 mt-1">
									Tel: {tenant.phone} · {tenant.address}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-right">
								<div className="text-xs text-slate-500">Alquiler</div>
								<div className="text-2xl font-bold text-slate-900">
									{formatCurrency(tenant.rentAmount)}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="w-full min-w-2xl bg-white">
					<DialogHeader>
						<div className="flex items-center justify-between px-4 py-4 transition-colors">
							<div className="flex items-center gap-4">
								<DialogTitle className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700">
									{tenant.name.charAt(0)}
								</DialogTitle>
								<div className="text-left">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-slate-900">
											{tenant.name}
										</span>
										<StatusBadge status="inquilino">{tenant.type}</StatusBadge>
									</div>
									<div className="text-sm text-slate-500 mt-1">
										Tel: {tenant.phone} · {tenant.address}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="text-right">
									<div className="text-xs text-slate-500">Alquiler</div>
									<div className="text-2xl font-bold text-slate-900">
										{formatCurrency(tenant.rentAmount)}
									</div>
								</div>
							</div>
						</div>
					</DialogHeader>

					<div className="pb-4">
						{/* Alerta de próximo aumento */}
						{tenant.nextIncrease && (
							<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
								<TrendingUp className="h-4 w-4 text-amber-600 mt-0.5" />
								<div className="text-sm">
									<span className="text-amber-900">
										Próximo aumento: {formatDate(tenant.nextIncrease.date)}
									</span>
								</div>
							</div>
						)}

						<div className="grid grid-cols-2 gap-6 mb-4">
							{/* Contacto */}
							<div className="border border-slate-200 p-4 rounded-lg">
								<h4 className="font-semibold text-sm text-slate-900 mb-3">
									Contacto
								</h4>
								<div className="space-y-2">
									{tenant.phone && (
										<div className="flex items-center gap-2 text-sm text-slate-600">
											<Phone className="h-4 w-4" />
											<span>{tenant.phone}</span>
										</div>
									)}
									{tenant.email && (
										<div className="flex items-center gap-2 text-sm text-slate-600">
											<Mail className="h-4 w-4" />
											<span>{tenant.email}</span>
										</div>
									)}
								</div>
							</div>

							{/* Estado del Pago */}
							<div className="border border-slate-200 p-4 rounded-lg">
								<h4 className="font-semibold text-sm text-slate-900 mb-3">
									Estado del Pago
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-slate-600">Monto</span>
										<span className="font-semibold text-slate-900">
											{formatCurrency(tenant.currentPayment.amount)}
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-slate-600">Vencimiento</span>
										<span className="font-semibold text-slate-900">
											{formatDate(tenant.currentPayment.dueDate)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Botones de acción */}
						<div className="flex justify-end gap-2 pt-2">
							<Button variant="outline" size="sm" className=" border-slate-300">
								Editar cliente
							</Button>
							<Button size="sm" variant="destructive">
								Eliminar cliente
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
