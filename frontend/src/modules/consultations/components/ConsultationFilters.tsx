"use client";

import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Funnel, Mail } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { deleteAllConsultations } from "../service/consultation-service";
import { DeleteAllConsultationsAction } from "../ui/DeleteAllConsultationsAction";

interface Props {
	unreadCount: number;
}

export default function ConsultationFilters({ unreadCount }: Props) {
	const [startDate, setStartDate] = useQueryState(
		"start_date",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);
	const [endDate, setEndDate] = useQueryState(
		"end_date",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);
	const [isRead, setIsRead] = useQueryState(
		"is_read",
		parseAsString.withDefault("").withOptions({ shallow: false }),
	);

	const handleLast7Days = async () => {
		const today = new Date();
		const last7 = new Date();
		last7.setDate(today.getDate() - 7);

		const start = last7.toISOString().split("T")[0];
		const end = today.toISOString().split("T")[0];

		await Promise.all([setStartDate(start), setEndDate(end), setIsRead(null)]);
	};

	const handleUnread = async () => {
		await Promise.all([
			setIsRead("false"),
			setStartDate(null),
			setEndDate(null),
		]);
	};

	const handleAll = async () => {
		await Promise.all([setIsRead(null), setStartDate(null), setEndDate(null)]);
	};

	// Determinar filtro activo
	const activeFilter =
		isRead === "false" ? "unread" : startDate && endDate ? "last7" : "all";

	const handleDeleteAll = async () => {
		await deleteAllConsultations();
	};

	return (
		<div className="flex items-center gap-3 mt-2">
			{/* Últimos 7 días */}
			<Button
				variant={activeFilter === "last7" ? "tertiary" : "outline"}
				onClick={handleLast7Days}
				className="flex items-center gap-2 border-gray-300"
			>
				<Funnel className="size-4" />
				Últimos 7 días
			</Button>

			{/* No leídos */}
			<Button
				variant={activeFilter === "unread" ? "tertiary" : "outline"}
				onClick={handleUnread}
				className="flex items-center gap-2 border-gray-300"
			>
				<Mail className="size-4" />
				No leídos
				{unreadCount > 0 && (
					<Badge className="ml-1 bg-[#3B82F6] rounded-full text-white px-1.5 py-1 text-xs">
						{unreadCount}
					</Badge>
				)}
			</Button>

			{/* Todos */}
			<Button
				variant={activeFilter === "all" ? "tertiary" : "outline"}
				onClick={handleAll}
				className="border-gray-300"
			>
				Todas
			</Button>

			{/* Borrar todas */}
			<DeleteAllConsultationsAction onDeleteAll={handleDeleteAll} />
		</div>
	);
}
