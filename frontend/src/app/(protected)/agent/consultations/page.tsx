import { Suspense } from "react";

import SectionHeading from "@src/components/section-heading";
import ConsultationFilters from "@src/modules/consultations/components/ConsultationFilters";
import ConsultationResults from "@src/modules/consultations/components/ConsultationResults";
/* import { getConsultations } from "@src/modules/consultations/service/consultation-service"; */
import ConsultationsSkeleton from "@src/modules/consultations/ui/ConsultationsSkeleton";

export const metadata = {
	title: "Consultas",
	description: "Gestión de consultas",
};

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
	searchParams: Promise<SearchParams>;
};

// page.tsx
export default async function ConsultationsPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;

	const filters = {
		consultation_type_id: resolvedSearchParams.consultation_type_id
			? parseInt(resolvedSearchParams.consultation_type_id as string, 10)
			: undefined,
		start_date: resolvedSearchParams.start_date as string,
		end_date: resolvedSearchParams.end_date as string,
		is_read:
			resolvedSearchParams.is_read === "true"
				? true
				: resolvedSearchParams.is_read === "false"
					? false
					: undefined,
		limit: resolvedSearchParams.limit
			? parseInt(resolvedSearchParams.limit as string, 10)
			: undefined,
		offset: resolvedSearchParams.offset
			? parseInt(resolvedSearchParams.offset as string, 10)
			: undefined,
	};

	// Fetch rápido solo para obtener el unreadCount
	/* const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value; */

	/* const quickData = await getConsultations({ is_read: false });
  const unreadCount = quickData.total; */

	return (
		<>
			<SectionHeading title="Consultas" separator={false} />
			<ConsultationFilters />
			{/* <ConsultationFilters unreadCount={unreadCount} /> */}
			<Suspense
				key={JSON.stringify(filters)}
				fallback={<ConsultationsSkeleton />}
			>
				<ConsultationResults filters={filters} />
			</Suspense>
		</>
	);
}
