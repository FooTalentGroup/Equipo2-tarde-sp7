import { Heading } from "@src/components/ui/heading";
import ConsultationResults from "@src/modules/consultations/components/consultation-results";
export const metadata = {
	title: "Dashboard",
	description: "Gestión de propiedades inmobiliarias",
};

import { Suspense } from "react";

import Link from "next/link";

import { paths } from "@src/lib/paths";
import { getConsultations } from "@src/modules/consultations/service/consultation-service";
import ConsultationsSkeleton from "@src/modules/consultations/ui/consultations-skeleton";
import { InfoList } from "@src/modules/dashboard/components/info-list";

type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
	searchParams: Promise<SearchParams>;
};

export default async function DashboardPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;

	const filters = {
		consultation_type_id: resolvedSearchParams.consultation_type_id
			? parseInt(resolvedSearchParams.consultation_type_id as string, 10)
			: undefined,
		start_date: resolvedSearchParams.start_date as string,
		end_date: resolvedSearchParams.end_date as string,
		limit: 5,
		offset: 0,
	};

	const initialData = await getConsultations(filters);

	return (
		<>
			<InfoList />
			<section className="shadow-consultations p-4 rounded-md">
				<div className="flex justify-between items-center">
					<Heading
						variant="subtitle1"
						weight="medium"
						className="text-secondary-dark-active mb-2"
					>
						Nuevas Consultas
					</Heading>
					<Link href={paths.agent.inquiries.index()} className="text-secondary">
						Ver todas
					</Link>
				</div>
				<Suspense
					key={JSON.stringify(filters)}
					fallback={<ConsultationsSkeleton />}
				>
					<ConsultationResults filters={filters} initialData={initialData} />
				</Suspense>
			</section>
		</>
	);
}
