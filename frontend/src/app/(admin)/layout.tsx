import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import AdminHeader from "@src/components/layouts/header/admin-header";
import { AdminSidebar } from "@src/components/sidebars/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { paths } from "@src/lib/paths";
import { verifySession } from "@src/modules/auth";

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
			<SidebarInset className="w-full bg-card flex flex-1 flex-col gap-8 p-8">
				{children}
			</SidebarInset>
			{/* <NotificationSidebar /> */}
		</SidebarProvider>
	);
}
