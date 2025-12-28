"use client";

import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Funnel, Mail } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { DeleteAllConsultationsAction } from "../ui/delete-all-consultations-action";

interface Props {
	unreadCount: number;
	onStartSelection?: () => void;
}

export default function ConsultationFilters({
	unreadCount,
	onStartSelection,
}: Props) {
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

	const activeFilter =
		isRead === "false" ? "unread" : startDate && endDate ? "last7" : "all";

	return (
		<div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-3 lg:mt-2">
			<div className="flex gap-3">
				<Button
					variant={activeFilter === "last7" ? "tertiary" : "outline"}
					onClick={handleLast7Days}
					className="flex items-center gap-2 border-gray-300"
				>
					<Funnel className="size-4" />
					Últimos 7 días
				</Button>

				<Button
					variant={activeFilter === "unread" ? "tertiary" : "outline"}
					onClick={handleUnread}
					className="flex items-center gap-2 border-gray-300"
				>
					<Mail className="size-4" />
					No leídos
					{unreadCount > 0 && (
						<Badge className="ml-1 bg-[#3B82F6] text-white text-xs rounded-full min-w-6 h-6 px-0.5 flex items-center justify-center leading-none">
							{unreadCount}
						</Badge>
					)}
				</Button>
			</div>

			<div className="flex gap-3">
				<Button
					variant={activeFilter === "all" ? "tertiary" : "outline"}
					onClick={handleAll}
					className="border-gray-300"
				>
					Todas
				</Button>

				<DeleteAllConsultationsAction onStartSelection={onStartSelection} />
			</div>
		</div>
	);
}
