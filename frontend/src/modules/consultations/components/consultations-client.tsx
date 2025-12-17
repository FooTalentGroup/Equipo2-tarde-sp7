"use client";

import { useState } from "react";

import ConsultationFilters from "@src/modules/consultations/components/consultation-filters";
import ConsultationResults from "@src/modules/consultations/components/consultation-results";
import type { ConsultationFilterForm } from "@src/modules/consultations/types/consultation-filter";
import type { Consultation } from "@src/types/consultations";

interface Props {
	unreadCount: number;
	filters: ConsultationFilterForm;
	initialData: { data: Consultation[]; total: number };
}

export default function ConsultationsClient({
	unreadCount,
	filters,
	initialData,
}: Props) {
	const [isSelectionMode, setIsSelectionMode] = useState(false);

	const handleStartSelection = () => {
		setIsSelectionMode(true);
	};

	return (
		<>
			<div>
				<ConsultationFilters
					unreadCount={unreadCount}
					onStartSelection={handleStartSelection}
				/>
			</div>
			<ConsultationResults
				filters={filters}
				initialData={initialData}
				isSelectionMode={isSelectionMode}
				onCancelSelection={() => setIsSelectionMode(false)}
			/>
		</>
	);
}
