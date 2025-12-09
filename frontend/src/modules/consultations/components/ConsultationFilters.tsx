"use client";

import { Button } from "@src/components/ui/button";
import { Funnel, Mail, Trash2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export default function ConsultationFilters() {
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

	// Este lo dejamos para después cuando tengas el endpoint
	const handleDeleteAll = () => {
		console.log("TODO: Implementar delete all");
	};

	return (
		<div className="flex items-center gap-3 mb-3">
			{/* Últimos 7 días */}
			<Button
				variant={activeFilter === "last7" ? "tertiary" : "outline"}
				onClick={handleLast7Days}
				className="flex items-center gap-2"
			>
				<Funnel className="size-4" />
				Últimos 7 días
			</Button>

			{/* No leídos */}
			<Button
				variant={activeFilter === "unread" ? "tertiary" : "outline"}
				onClick={handleUnread}
				className="flex items-center gap-2"
			>
				<Mail className="size-4" />
				No leídos
				{/* El contador lo obtendremos del server component */}
			</Button>

			{/* Todos */}
			<Button
				variant={activeFilter === "all" ? "tertiary" : "outline"}
				onClick={handleAll}
			>
				Todas
			</Button>

			{/* Borrar todas */}
			<Button
				variant="outline"
				className="ml-auto flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-500"
				onClick={handleDeleteAll}
			>
				<Trash2 className="size-4" />
				Borrar todas
			</Button>
		</div>
	);
}
