import { getConsultations } from "../service/consultation-service";
import type { ConsultationFilterForm } from "../types/consultation-filter";
import ListConsultations from "./ListConsultations";

interface Props {
	filters: ConsultationFilterForm;
}

export default async function ConsultationResults({ filters }: Props) {
	const result = await getConsultations(filters);

	return <ListConsultations consultationsData={result.data} />;
}
