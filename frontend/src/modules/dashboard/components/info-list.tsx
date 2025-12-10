import { CircleAlert, House, MessageSquare } from "lucide-react";

import { getDashboardInfo } from "../services/dashboard-info";
import { InfoAgentsCard } from "./info-agents-card";

export const InfoList = async () => {
	const data = await getDashboardInfo();

	return (
		<ul className="flex gap-6 justify-center">
			<li>
				<InfoAgentsCard
					icon={House}
					title={data?.active_properties || 0}
					description="Propiedades activas"
					className="[&>svg]:text-success-foreground [&>svg]:bg-success"
				/>
			</li>
			<li>
				<InfoAgentsCard
					icon={CircleAlert}
					title={data?.inactive_properties || 0}
					description="Propiedades inactivas"
					className="[&>svg]:bg-danger-light [&>svg]:text-danger-normal"
				/>
			</li>
			<li>
				<InfoAgentsCard
					icon={MessageSquare}
					title={data?.unanswered_consultations || 0}
					description="Consultas no leídas"
					className="[&>svg]:text-blue-normal [&>svg]:bg-success"
				/>
			</li>
		</ul>
	);
};
