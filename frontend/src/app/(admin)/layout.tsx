import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import AdminHeader from "@src/components/layouts/header/admin-header";
import { AdminSidebar } from "@src/components/sidebars/admin-sidebar";
import NotificationSidebar from "@src/components/sidebars/notification-sidebar";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { paths } from "@src/lib/paths";
import { verifySession } from "@src/modules/auth/lib/dal";

type Props = {
	children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
	const { isAuth } = await verifySession();

	if (!isAuth) {
		redirect(paths.auth.login());
	}

	return (
		<SidebarProvider header={<AdminHeader />}>
			<AdminSidebar />
			<SidebarInset className="w-full flex flex-1 flex-col gap-4 px-4 py-5">
				{children}
			</SidebarInset>
			<NotificationSidebar />
		</SidebarProvider>
	);
}
