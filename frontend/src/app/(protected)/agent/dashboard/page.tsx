import { Heading } from "@src/components/ui/heading";
import ConsultationResults from "@src/modules/consultations/components/ConsultationResults";
export const metadata = {
	title: "Dashboard",
	description: "Gestión de propiedades inmobiliarias",
};

import { Suspense } from "react";

import Link from "next/link";

import { paths } from "@src/lib/paths";
import ConsultationsSkeleton from "@src/modules/consultations/ui/ConsultationsSkeleton";
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
		is_read:
			resolvedSearchParams.is_read === "true"
				? true
				: resolvedSearchParams.is_read === "false"
					? false
					: undefined,
		limit: 5,
		offset: 0,
	};
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
						Consultas
					</Heading>
					<Link href={paths.agent.inquiries.index()} className="text-secondary">
						Ver todas
					</Link>
				</div>
				<Suspense
					key={JSON.stringify(filters)}
					fallback={<ConsultationsSkeleton />}
				>
					<ConsultationResults filters={filters} />
				</Suspense>
			</section>
		</>
	);
}
