import {
	EnvelopeIcon,
	PhoneIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { Owner } from "@src/types/property-detail";

import { Section } from "./section";

export default function OwnerCard({
	owner,
}: {
	owner: Owner | null | undefined;
}) {
	if (!owner) {
		return (
			<Section title="Propietario">
				<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center bg-card">
					<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
						<UserCircleIcon className="h-8 w-8" />
					</div>
					<p className="text-sm font-medium text-muted-foreground">
						Sin propietario asignado
					</p>
				</div>
			</Section>
		);
	}

	return (
		<Section title="Propietario">
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-light text-tertiary">
						<UserCircleIcon className="h-8 w-8" />
					</div>
					<div>
						<p className="font-medium text-foreground">{owner.name || "-"}</p>
						<p className="text-sm text-muted-foreground">ID: #PRO-{owner.id}</p>
					</div>
				</div>
				<div className="space-y-3">
					<div className="flex items-center gap-3 text-sm">
						<PhoneIcon
							className={`h-4 w-4 ${owner.phone ? "text-foreground" : "text-muted-foreground"}`}
						/>
						{owner.phone ? (
							<span className="text-foreground">{owner.phone}</span>
						) : (
							<span className="text-muted-foreground italic">
								Teléfono no registrado
							</span>
						)}
					</div>
					<div className="flex items-center gap-3 text-sm">
						<EnvelopeIcon
							className={`h-4 w-4 ${owner.email ? "text-foreground" : "text-muted-foreground"}`}
						/>
						{owner.email ? (
							<span className="text-foreground">{owner.email}</span>
						) : (
							<span className="text-muted-foreground italic">
								Email no registrado
							</span>
						)}
					</div>
				</div>
			</div>
		</Section>
	);
}
