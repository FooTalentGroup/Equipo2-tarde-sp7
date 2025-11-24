import NotificationCard from "@src/components/agent-header/notifications-sheet/notification-card";
import { Button } from "@src/components/ui/button";
import { Heading } from "@src/components/ui/heading";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
} from "@src/components/ui/sidebar";
import { ArrowRight } from "lucide-react";

import {
	alertsAndReminders,
	contractsAndRentals,
	notificationsToday,
} from "./data";

export default function NotificationSidebar() {
	return (
		<Sidebar className="border-0!" side="right" width="18rem">
			<SidebarContent className="gap-2 py-6">
				<SidebarGroup className="gap-4">
					<Heading variant="subtitle3" className="font-bold">
						Hoy
					</Heading>
					<SidebarGroupContent className="space-y-2">
						{notificationsToday.map((notification, key: number) => (
							<NotificationCard key={`today-${key}`} {...notification} />
						))}
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="gap-4">
					<Heading variant="subtitle3" className="font-bold">
						Alertas y Recordatorios
					</Heading>
					<SidebarGroupContent className="space-y-2">
						{alertsAndReminders.map((notification, key: number) => (
							<NotificationCard key={`alert-${key}`} {...notification} />
						))}
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="gap-4">
					<Heading variant="subtitle3" className="font-bold">
						Contratos y Alquileres
					</Heading>
					<SidebarGroupContent className="space-y-2">
						{contractsAndRentals.map((notification, key: number) => (
							<NotificationCard key={`contract-${key}`} {...notification} />
						))}
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="gap-4 py-0">
					<Button variant="link" className="gap-0 ml-auto px-0!">
						Ver todos los eventos
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
