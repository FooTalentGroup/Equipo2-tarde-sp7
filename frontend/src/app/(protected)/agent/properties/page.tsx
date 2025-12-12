import { Suspense } from "react";

import SectionHeading from "@src/components/section-heading";
import PropertiesSkeleton from "@src/modules/properties/components/properties-skeleton";
import PropertyFilterSheet from "@src/modules/properties/components/property-filter-sheet";
import PropertyResults from "@src/modules/properties/components/property-results";
import PropertySearch from "@src/modules/properties/components/property-search";

export const metadata = {
	title: "Propiedades",
	description: "Gestión de propiedades inmobiliarias",
};

export const dynamic = "force-dynamic";

type SearchParams = { [key: string]: string | string[] | undefined };

type Props = {
	searchParams: Promise<SearchParams>;
};

export default async function PropertiesPage({ searchParams }: Props) {
	const resolvedSearchParams = await searchParams;

	const filters = {
		property_type_id: resolvedSearchParams.property_type_id as string,
		min_price: resolvedSearchParams.min_price as string,
		max_price: resolvedSearchParams.max_price as string,
		search: resolvedSearchParams.search as string,
		includeArchived: resolvedSearchParams.includeArchived
			? resolvedSearchParams.includeArchived === "true"
			: undefined,
		operation_type_id: resolvedSearchParams.operation_type_id as string,
		featured_web: resolvedSearchParams.featured_web
			? resolvedSearchParams.featured_web === "true"
			: undefined,
		limit: Number(resolvedSearchParams.limit) || 20,
		offset: Number(resolvedSearchParams.offset) || 0,
	};

	return (
		<>
			<SectionHeading title="Propiedades" />
			<div className="flex justify-between items-center gap-4">
				<PropertySearch className="w-full lg:max-w-[400px]" />
				<PropertyFilterSheet />
			</div>
			<Suspense key={JSON.stringify(filters)} fallback={<PropertiesSkeleton />}>
				<PropertyResults filters={filters} />
			</Suspense>
		</>
	);
}
