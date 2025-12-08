import {
	EnvelopeIcon,
	PhoneIcon,
	UserCircleIcon,
} from "@heroicons/react/24/outline";
import type { Owner } from "@src/types/property-detail";

import { Section } from "./section";

export default function OwnerCard({ owner }: { owner: Owner }) {
	return (
		<Section title="Propietario">
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
						<UserCircleIcon className="h-8 w-8" />
					</div>
					<div>
						<p className="font-medium text-gray-900">{owner.name}</p>
						<p className="text-sm text-gray-500">ID: #PRO-{owner.id}</p>
					</div>
				</div>
				<div className="space-y-3">
					<div className="flex items-center gap-3 text-sm">
						<PhoneIcon className="h-4 w-4" />
						<span>{owner.phone}</span>
					</div>
					<div className="flex items-center gap-3 text-sm">
						<EnvelopeIcon className="h-4 w-4" />
						<span>{owner.email}</span>
					</div>
				</div>
			</div>
		</Section>
	);
}
