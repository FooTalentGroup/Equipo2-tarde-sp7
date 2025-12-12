import { CircleAlert, House, MessageSquare, UserCheck } from "lucide-react";

import { getDashboardInfo } from "../services/dashboard-info";
import { InfoAgentsCard } from "./info-agents-card";

export const InfoList = async () => {
	const data = await getDashboardInfo();

	return (
		<ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center">
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
			<li>
				<InfoAgentsCard
					icon={UserCheck}
					title={data?.new_leads_today || 0}
					description="Nuevos leads"
					className="[&>svg]:text-header [&>svg]:bg-muted"
				/>
			</li>
		</ul>
	);
};
