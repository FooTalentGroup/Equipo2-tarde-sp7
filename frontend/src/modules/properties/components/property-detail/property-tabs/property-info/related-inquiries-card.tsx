import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

import { Section } from "./section";

const inquiries = [
	{
		id: 1,
		name: "Carlos Méndez",
		date: "Hace 2 días",
		phone: "+54 11 5234-7890",
		email: "carlos.m@email.com",
	},
	{
		id: 2,
		name: "Laura Fernández",
		date: "Hace 5 días",
		phone: "+54 11 6543-2109",
		email: "laura.fer@email.com",
	},
	{
		id: 3,
		name: "Diego Paz",
		date: "Hace 1 semana",
		phone: "+54 11 4321-9876",
		email: "diego.paz@email.com",
	},
];

export default function RelatedInquiriesCard() {
	return (
		<Section title="Consultas relacionadas">
			<div className="-m-6 divide-y">
				{inquiries.map((inquiry) => (
					<div key={inquiry.id} className="p-4 space-y-2">
						<div className="flex justify-between items-start">
							<p className="font-medium text-gray-900">{inquiry.name}</p>
							<span className="text-xs text-gray-500">{inquiry.date}</span>
						</div>
						<div className="space-y-1">
							<div className="flex items-center gap-2 text-xs text-gray-600">
								<PhoneIcon className="h-3 w-3" />
								<span>{inquiry.phone}</span>
							</div>
							<div className="flex items-center gap-2 text-xs text-gray-600">
								<EnvelopeIcon className="h-3 w-3" />
								<span>{inquiry.email}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</Section>
	);
}
