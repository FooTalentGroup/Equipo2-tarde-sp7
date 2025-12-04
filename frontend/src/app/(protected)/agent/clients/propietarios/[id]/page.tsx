import Link from "next/link";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { StatusBadge } from "@src/components/ui/status-badge";
import { paths } from "@src/lib/paths";
import { DeleteOwnerButton } from "@src/modules/clients/ui/DeleteOwnerButton";
import {
	Building2,
	Calendar,
	FileText,
	Mail,
	MapPin,
	Phone,
} from "lucide-react";

// Página: app/agent/clients/propietarios/[id]/page.tsx
export default async function OwnerDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	// En producción, cargarías los datos del propietario usando el ID
	// const owner = await getOwnerById(id);
	const owner = {
		id: id,
		first_name: "Juan",
		last_name: "Pérez",
		email: "juan.perez@email.com",
		phone: "+54 341 234 5678",
		dni: "12345678-A",
		address: "Calle Mayor 45, 3º B",
		created_at: "15/03/2024",
		notes:
			"Cliente preferencial desde 2020. Siempre paga puntualmente. Interesado en expandir su cartera de propiedades en la zona céntrica. Prefiere comunicación por WhatsApp. Ha referido 3 clientes nuevos. Solicita facturas electrónicas.",
		properties: [
			{
				id: "1",
				address: "Calle Mayor 45, 3º B",
				city: "Rosario",
				type: "Departamento",
				rooms: 3,
				bathrooms: 2,
				surface: 85,
				image: "/api/placeholder/400/300",
				status: "ocupado",
				monthly_rent: 150000,
			},
			{
				id: "2",
				address: "Av. de la Libertad 128",
				city: "Rosario",
				type: "Casa",
				rooms: 4,
				bathrooms: 3,
				surface: 180,
				image: "/api/placeholder/400/300",
				status: "disponible",
				monthly_rent: 280000,
			},
			{
				id: "3",
				address: "San Martín 567, 1º A",
				city: "Rosario",
				type: "Departamento",
				rooms: 2,
				bathrooms: 1,
				surface: 55,
				image: "/api/placeholder/400/300",
				status: "ocupado",
				monthly_rent: 95000,
			},
		],
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "disponible":
				return "bg-green-100 text-green-700";
			case "ocupado":
				return "bg-blue-100 text-blue-700";
			case "mantenimiento":
				return "bg-yellow-100 text-yellow-700";
			default:
				return "bg-slate-100 text-slate-700";
		}
	};

	return (
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-6">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700 text-2xl">
										{owner.first_name.charAt(0)}
									</div>
									<div>
										<div className="flex items-center gap-2 mb-1">
											<h1 className="text-2xl font-bold text-slate-900">
												{owner.first_name} {owner.last_name}
											</h1>
											<StatusBadge status="propietario">
												Propietario
											</StatusBadge>
										</div>
										<div className="text-sm text-slate-500">
											DNI: {owner.dni}
										</div>
									</div>
								</div>
								<div className="flex flex-col items-center gap-1">
									<Button variant="outline" size="sm" className="px-10" asChild>
										<Link
											href={`${paths.agent.clients.propietarios()}/${id}/edit`}
										>
											Editar contacto
										</Link>
									</Button>
									<DeleteOwnerButton
										ownerId={id}
										ownerName={`${owner.first_name} ${owner.last_name}`}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Columna izquierda - Información */}
					<div className="lg:col-span-1 space-y-6">
						{/* Información de Contacto */}
						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold text-lg text-slate-900 mb-4">
									Información de Contacto
								</h3>
								<div className="space-y-3">
									<div className="flex items-start gap-3">
										<Phone className="h-5 w-5 text-slate-400 mt-0.5" />
										<div>
											<div className="text-xs text-slate-500">Teléfono</div>
											<div className="text-sm text-slate-900">
												{owner.phone}
											</div>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<Mail className="h-5 w-5 text-slate-400 mt-0.5" />
										<div>
											<div className="text-xs text-slate-500">Email</div>
											<div className="text-sm text-slate-900">
												{owner.email}
											</div>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
										<div>
											<div className="text-xs text-slate-500">Dirección</div>
											<div className="text-sm text-slate-900">
												{owner.address}
											</div>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
										<div>
											<div className="text-xs text-slate-500">
												Cliente desde
											</div>
											<div className="text-sm text-slate-900">
												{owner.created_at}
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Notas */}
						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
									<FileText className="h-5 w-5" />
									Notas
								</h3>
								<div className="bg-slate-50 p-4 rounded-lg">
									<p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
										{owner.notes ||
											"No hay notas registradas para este propietario."}
									</p>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Columna derecha - Propiedades */}
					<div className="lg:col-span-2">
						<Card>
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-6">
									<h3 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
										<Building2 className="h-5 w-5" />
										Propiedades ({owner.properties.length})
									</h3>
									<Button variant="tertiary">Agregar Propiedad</Button>
								</div>

								<div className="space-y-4">
									{owner.properties.map((property) => (
										<Card
											key={property.id}
											className="hover:shadow-md transition-shadow"
										>
											<CardContent className="p-4">
												<div className="flex gap-4">
													{/* Imagen */}
													<div className="w-32 h-32 bg-slate-200 rounded-lg shrink-0 overflow-hidden">
														<div className="w-full h-full bg-linear-to-br from-slate-300 to-slate-400 flex items-center justify-center">
															<Building2 className="h-12 w-12 text-slate-500" />
														</div>
													</div>

													{/* Información */}
													<div className="flex-1">
														<div className="flex items-start justify-between mb-2">
															<div>
																<h4 className="font-semibold text-slate-900 mb-1">
																	{property.address}
																</h4>
																<div className="text-sm text-slate-500">
																	{property.city} · {property.type}
																</div>
															</div>
															<span
																className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
																	property.status,
																)}`}
															>
																{property.status.charAt(0).toUpperCase() +
																	property.status.slice(1)}
															</span>
														</div>

														<div className="grid grid-cols-3 gap-4 mb-3">
															<div>
																<div className="text-xs text-slate-500">
																	Ambientes
																</div>
																<div className="text-sm font-medium text-slate-900">
																	{property.rooms}
																</div>
															</div>
															<div>
																<div className="text-xs text-slate-500">
																	Baños
																</div>
																<div className="text-sm font-medium text-slate-900">
																	{property.bathrooms}
																</div>
															</div>
															<div>
																<div className="text-xs text-slate-500">
																	Superficie
																</div>
																<div className="text-sm font-medium text-slate-900">
																	{property.surface} m²
																</div>
															</div>
														</div>

														<div className="flex items-center justify-between">
															<div>
																<div className="text-xs text-slate-500">
																	Renta mensual
																</div>
																<div className="text-lg font-bold text-slate-900">
																	$
																	{property.monthly_rent.toLocaleString(
																		"es-AR",
																	)}
																</div>
															</div>
															<Button variant="outline" size="sm" asChild>
																<Link
																	href={paths.agent.properties.detail(
																		property.id,
																	)}
																>
																	Ver Detalles
																</Link>
															</Button>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
