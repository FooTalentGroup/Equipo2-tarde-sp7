import type { Property } from "@src/types/property";

import PropertyCardDefault from "./property-card-default";
import PropertyCardPublic from "./property-card-public";

export type Layout = "default" | "public";

const postCards = {
	default: PropertyCardDefault,
	public: PropertyCardPublic,
};

type Props = {
	property: Property;
	layout?: Layout;
	href?: string;
};

export default function PropertyCard({
	property,
	layout = "default",
	href,
}: Props) {
	const CurrentPropertyCard = postCards[layout];

	return <CurrentPropertyCard property={property} href={href} />;
}
