"use client";

import Link from "next/link";

import { Button } from "@src/components/ui/button";
import { Card, CardContent } from "@src/components/ui/card";
import { StatusBadge } from "@src/components/ui/status-badge";
/* import { paths } from "@src/lib/paths"; */
import { DeleteOwnerButton } from "@src/modules/clients/ui/DeleteOwnerButton";

interface ClientHeaderProps {
	id: string;
	firstName: string;
	lastName: string;
	dni?: string;
	status: "lead" | "inquilino" | "propietario";
	editPath: string;
}

export function ClientHeader({
	id,
	firstName,
	lastName,
	dni,
	status,
	editPath,
}: ClientHeaderProps) {
	const initial = (firstName ?? lastName ?? "?").charAt(0);
	const statusLabel = status
		? status.charAt(0).toUpperCase() + status.slice(1)
		: "Cliente";

	console.log("ClientHeader status:", firstName);
	return (
		<div className="mb-6">
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-700 text-2xl">
								{initial}
							</div>
							<div>
								<div className="flex items-center gap-2 mb-1">
									<h1 className="text-2xl font-bold text-slate-900">
										{firstName} {lastName}
									</h1>
									<StatusBadge status={status}>{statusLabel}</StatusBadge>
								</div>
								{dni && (
									<div className="text-sm text-slate-500">DNI: {dni}</div>
								)}
							</div>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Button variant="outline" size="sm" className="px-10" asChild>
								<Link href={editPath}>Editar contacto</Link>
							</Button>
							<DeleteOwnerButton
								ownerId={id}
								ownerName={`${firstName} ${lastName}`}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
