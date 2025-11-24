import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import AdminHeader from "@src/components/agent-header";
import AgentSidebar from "@src/components/sidebars/agent-sidebar";
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
			<AgentSidebar />
			<SidebarInset className="w-full bg-card flex flex-1 flex-col gap-8 p-8">
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
