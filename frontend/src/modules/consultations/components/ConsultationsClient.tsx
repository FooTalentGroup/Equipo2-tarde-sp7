"use client";

import { useState } from "react";

import ConsultationFilters from "@src/modules/consultations/components/ConsultationFilters";
import ConsultationResults from "@src/modules/consultations/components/ConsultationResults";

interface Props {
	unreadCount: number;
	filters: any;
	initialData: any;
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
