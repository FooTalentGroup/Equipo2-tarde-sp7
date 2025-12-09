import { notFound } from "next/navigation";

import SectionHeading from "@src/components/section-heading";
import CreatePropertyForm from "@src/modules/properties/components/create-property";
import { getPropertyById } from "@src/modules/properties/services/property-service";
import type {
	PropertyForm,
	PropertyType,
	VisibilityStatusType,
} from "@src/types/property";

type Props = {
	params: Promise<{ id?: string }>;
};

export default async function EditPropertyPage({ params }: Props) {
	const resolved = await params;
	const id = resolved?.id;

	if (!id) return notFound();

	const data = await getPropertyById(Number(id));

	if (!data) return notFound();

	const { property } = data;

	const defaultValues: PropertyForm = {
		basic: {
			title: property.title,
			description: property.description || "",
			property_type: property.property_type.id.toString() as PropertyType,
			property_status: property.property_status.name,
			visibility_status: property.visibility_status
				.name as VisibilityStatusType,
			featured_web: property.featured_web,
			publication_date: property.publication_date,
			owner_id: property.owner_id.toString(),
		},
		geography: {
			country: property.addresses[0]?.city?.province?.country?.name || "",
			province: property.addresses[0]?.city?.province?.name || "",
			city: property.addresses[0]?.city?.name || "",
		},
		address: {
			street: property.addresses[0]?.full_address || "",
			number: "",
			floor: "",
			postal_code: property.addresses[0]?.postal_code || "",
			neighborhood: property.addresses[0]?.neighborhood || "",
			latitude: property.addresses[0]?.latitude || 0,
			longitude: property.addresses[0]?.longitude || 0,
		},
		values: {
			prices: property.prices.map((p) => ({
				price: Number(p.price),
				currency_symbol: p.currency.symbol,
				operation_type: p.operation_type.name,
			})),
			expenses: property.expenses.map((e) => ({
				amount: Number(e.amount),
				currency_symbol: e.currency.symbol,
				frequency: e.frequency,
			})),
		},
		characteristics: {
			rooms_count: property.rooms_count,
			bedrooms_count: property.bedrooms_count,
			bathrooms_count: property.bathrooms_count,
			toilets_count: property.toilets_count,
			parking_spaces_count: property.parking_spaces_count,
			floors_count: property.floors_count,
			situation: property.situation?.name || "",
			age: property.age?.name || "",
			orientation: property.orientation?.name || "",
			disposition: property.disposition?.name || "",
			zoning: property.zoning || "",
		},
		surface: {
			land_area: Number(property.land_area),
			semi_covered_area: Number(property.semi_covered_area),
			covered_area: Number(property.covered_area),
			total_built_area: Number(property.total_built_area),
			uncovered_area: Number(property.uncovered_area),
			total_area: Number(property.total_area),
			zoning: property.zoning || "",
		},
		services: {
			services: property.services.map((s) => s.name),
		},
		internal: {
			branch_name: property.branch_name || "",
			appraiser: property.appraiser || "",
			producer: property.producer || "",
			maintenance_user: property.maintenance_user || "",
			keys_location: property.keys_location || "",
			internal_comments: property.internal_comments || "",
			social_media_info: property.social_media_info || "",
			operation_commission_percentage: Number(
				property.operation_commission_percentage,
			),
			producer_commission_percentage: Number(
				property.producer_commission_percentage,
			),
		},
		images: {
			gallery:
				property.images?.map((img) => ({
					name: img.file_path.split("/").pop() || "image",
					size: 0,
					type: img.media_type,
					lastModified: 0,
					uniqueId: img.id.toString(),
					preview: img.file_path,
					id: img.id,
				})) || [],
		},
		documents: {
			files: [],
		},
	};

	return (
		<>
			<SectionHeading title="Editar propiedad" />
			<CreatePropertyForm
				defaultValues={defaultValues}
				propertyId={property.id}
			/>
		</>
	);
}
