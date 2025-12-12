"use client";

import { Card, CardContent } from "@src/components/ui/card";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";

interface ClientContactInfoProps {
	phone: string;
	email: string;
	address?: string;
	createdAt: string;
}

export function ClientContactInfo({
	phone,
	email,
	address,
	createdAt,
}: ClientContactInfoProps) {
	return (
		<Card>
			<CardContent className="px-4 py-3">
				<h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
					<User className="h-5 w-5" />
					Información de Contacto
				</h3>
				<div className="space-y-3">
					<div className="flex items-start gap-3">
						<Phone className="h-5 w-5 text-slate-400 mt-0.5" />
						<div>
							<div className="text-xs text-slate-500">Teléfono</div>
							<div className="text-sm text-slate-900">{phone}</div>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<Mail className="h-5 w-5 text-slate-400 mt-0.5" />
						<div>
							<div className="text-xs text-slate-500">Email</div>
							<div className="text-sm text-slate-900">{email}</div>
						</div>
					</div>
					{address && (
						<div className="flex items-start gap-3">
							<MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
							<div>
								<div className="text-xs text-slate-500">Dirección</div>
								<div className="text-sm text-slate-900">{address}</div>
							</div>
						</div>
					)}
					<div className="flex items-start gap-3">
						<Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
						<div>
							<div className="text-xs text-slate-500">Cliente desde</div>
							<div className="text-sm text-slate-900">{createdAt}</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
