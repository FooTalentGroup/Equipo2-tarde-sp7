import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@src/components/ui/collapsible";
import { StatusBadge } from "@src/components/ui/status-badge";
import type { Tenant } from "@src/types/client";
import { ChevronDown, Mail, Phone, TrendingUp } from "lucide-react";

export default function addressasdasd({
	tenant,
	defaultOpen = false,
}: {
	tenant: Tenant;
	defaultOpen?: boolean;
}) {
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

	const getStatusBadge = (status: "paid" | "pending" | "overdue") => {
		const statusMap: Record<
			"paid" | "pending" | "overdue",
			{ label: string; variant: "pagado" | "pendiente" | "atrasado" }
		> = {
			paid: { label: "Pagado", variant: "pagado" },
			pending: { label: "Pendiente", variant: "pendiente" },
			overdue: { label: "Vencido", variant: "atrasado" },
		};
		return statusMap[status] ?? statusMap.pending;
	};

	return (
		<Collapsible defaultOpen={defaultOpen}>
			<Card className="mb-3">
				<CardContent className="p-0 focus-visible:outline-none">
					<CollapsibleTrigger className="w-full">
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
								<ChevronDown className="h-5 w-5 text-slate-400" />
							</div>
						</div>
					</CollapsibleTrigger>

					<CollapsibleContent>
						<div className="px-4 pb-4">
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

							{/* Historial de Pagos */}
							<div className="border border-slate-200 rounded-lg p-4 mb-4">
								<h4 className="font-semibold text-sm text-slate-900 mb-3">
									Historial de Pagos
								</h4>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-slate-200">
												<th className="text-left text-xs font-medium text-slate-500 pb-2">
													Mes
												</th>
												<th className="text-right text-xs font-medium text-slate-500 pb-2">
													Monto
												</th>
												<th className="text-center text-xs font-medium text-slate-500 pb-2">
													Estado
												</th>
												<th className="text-right text-xs font-medium text-slate-500 pb-2">
													Fecha Pago
												</th>
												<th className="text-center text-xs font-medium text-slate-500 pb-2">
													Notas
												</th>
											</tr>
										</thead>
										<tbody>
											{tenant.paymentHistory.map((payment, idx) => (
												<tr
													key={idx}
													className="border-b border-slate-100 last:border-0"
												>
													<td className="py-3 text-sm text-slate-900">
														{payment.month}
													</td>
													<td className="py-3 text-sm text-right font-medium text-slate-900">
														{formatCurrency(payment.amount)}
													</td>
													<td className="py-3 text-center">
														<StatusBadge
															status={getStatusBadge(payment.status).variant}
														>
															{getStatusBadge(payment.status).label}
														</StatusBadge>
													</td>
													<td className="py-3 text-sm text-right text-slate-600">
														{formatDate(payment.date)}
													</td>
													<td className="py-3 text-sm text-center text-slate-600">
														{payment.notes || "—"}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>

							{/* Botones de acción */}
							<div className="flex gap-2 pt-2">
								<Button size="lg">Registrar pago</Button>
								<Button
									variant="outline"
									size="lg"
									className="border-slate-300"
								>
									Enviar recordatorio
								</Button>
							</div>
						</div>
					</CollapsibleContent>
				</CardContent>
			</Card>
		</Collapsible>
	);
}
