import type { ElementType } from "react";

import { Badge } from "@src/components/ui/badge";
import { Card } from "@src/components/ui/card";
import { Heading } from "@src/components/ui/heading";
import type { Notification } from "@src/types/notification";
import {
	CalendarIcon,
	ClipboardCheckIcon,
	Clock,
	KeyIcon,
	PhoneIcon,
} from "lucide-react";

const STATUS_ICON_MAP: Record<string, ElementType> = {
	keys: KeyIcon,
	call: PhoneIcon,
	meeting: CalendarIcon,
	appraisal: ClipboardCheckIcon,
};

const STATUS_LABEL_MAP: Record<string, string> = {
	keys: "Entrega de llaves",
	call: "Llamada",
	meeting: "Reunión",
	appraisal: "Tasación",
	expiration: "Vencimiento",
	increase: "Aumento",
};

export default function NotificationCard({
	status,
	title,
	schedule,
}: Notification) {
	const IconComponent = status ? STATUS_ICON_MAP[status] : null;
	const statusLabel = status ? STATUS_LABEL_MAP[status] || status : null;

	return (
		<Card
			className={`grid gap-3 p-3 items-start shadow-none ${
				IconComponent ? "grid-cols-[2rem_1fr]" : "grid-cols-1"
			}`}
		>
			{IconComponent && (
				<div className="bg-muted w-8 h-8 rounded-sm grid place-content-center p-1">
					<IconComponent className="h-4 w-4" />
				</div>
			)}
			<div className="grid gap-2">
				{statusLabel && <Badge variant="outline">{statusLabel}</Badge>}
				{title && (
					<Heading
						variant="subtitle5"
						weight="semibold"
						className="line-clamp-1 text-foreground"
					>
						{title}
					</Heading>
				)}
				{schedule && (
					<div className="grid grid-cols-[0.75rem_1fr] gap-1 items-center">
						<Clock className="size-3" />
						<p className="text-foreground text-xs">{schedule}</p>
					</div>
				)}
			</div>
		</Card>
	);
}
