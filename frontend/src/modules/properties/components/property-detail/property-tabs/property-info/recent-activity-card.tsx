import {
	ArrowUpTrayIcon,
	EyeIcon,
	PencilSquareIcon,
} from "@heroicons/react/24/outline";

import { Section } from "./section";

const activities = [
	{
		id: 1,
		title: "Precio actualizado",
		description: "USD 185,000 -> USD 180,000",
		date: "Hace 3 días",
		user: "Admin",
		icon: PencilSquareIcon,
	},
	{
		id: 2,
		title: "Imágenes agregadas",
		description: "6 nuevas fotos",
		date: "Hace 1 semana",
		user: "Admin",
		icon: ArrowUpTrayIcon,
	},
	{
		id: 3,
		title: "Publicado en portal",
		description: "Portal Inmobiliario",
		date: "Hace 2 semanas",
		user: "Sistema",
		icon: EyeIcon,
	},
];

export default function RecentActivityCard() {
	return (
		<Section title="Actividad reciente">
			<div className="space-y-6">
				{activities.map((activity) => (
					<div key={activity.id} className="flex gap-4">
						<div className="mt-1 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
							<activity.icon className="h-4 w-4 text-gray-600" />
						</div>
						<div>
							<p className="font-medium text-gray-900">{activity.title}</p>
							<p className="text-sm text-gray-500">{activity.description}</p>
							<p className="text-xs text-gray-400 mt-1">
								{activity.date} • {activity.user}
							</p>
						</div>
					</div>
				))}
			</div>
		</Section>
	);
}
