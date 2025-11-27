"use client";

import { Button } from "@src/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@src/components/ui/sheet";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@src/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@src/components/ui/tooltip";
import { Bell } from "lucide-react";

import {
	alertsAndReminders,
	contractsAndRentals,
	notificationsToday,
} from "./data";
import NotificationCard from "./notification-card";

export default function NotificationsSheet() {
	return (
		<div>
			<Sheet>
				<Tooltip>
					<TooltipTrigger asChild>
						<SheetTrigger asChild>
							<Button
								variant="ghost-blue"
								size="icon-lg"
								className="p-0 border-none"
							>
								<Bell className="size-6" />
							</Button>
						</SheetTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>Notificaciones</p>
					</TooltipContent>
				</Tooltip>

				<SheetContent>
					<SheetHeader>
						<SheetTitle>Notificaciones</SheetTitle>
						<SheetDescription className="sr-only">
							Make changes to your profile here. Click save when you&apos;re
							done.
						</SheetDescription>
					</SheetHeader>
					<div className="grid gap-6 px-4 lg:px-6">
						<Tabs defaultValue="account" className="gap-2.5">
							<TabsList className="w-full">
								<TabsTrigger value="today">Hoy</TabsTrigger>
								<TabsTrigger value="alerts">Alertas</TabsTrigger>
								<TabsTrigger value="contracts">Contratos</TabsTrigger>
							</TabsList>
							<TabsContent value="today" className="grid gap-2.5">
								{notificationsToday.map((notification, key: number) => (
									<NotificationCard key={`today-${key}`} {...notification} />
								))}
							</TabsContent>
							<TabsContent value="alerts" className="grid gap-2.5">
								{alertsAndReminders.map((notification, key: number) => (
									<NotificationCard key={`alert-${key}`} {...notification} />
								))}
							</TabsContent>
							<TabsContent value="contracts" className="grid gap-2.5">
								{contractsAndRentals.map((notification, key: number) => (
									<NotificationCard key={`contract-${key}`} {...notification} />
								))}
							</TabsContent>
						</Tabs>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
