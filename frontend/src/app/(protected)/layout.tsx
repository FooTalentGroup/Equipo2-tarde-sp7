import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import ProtectedHeader from "@src/components/protected-header";
import ProtectedSidebar from "@src/components/sidebars/protected-sidebar";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { paths } from "@src/lib/paths";
import { getCurrentUser, verifySession } from "@src/modules/auth";

type Props = {
	children: ReactNode;
};

export default async function AdminLayout({ children }: Props) {
	const { isAuth } = await verifySession();
	const user = await getCurrentUser();

	if (!isAuth) {
		redirect(paths.auth.login());
	}

	if (!user) {
		return null;
	}

	return (
		<SidebarProvider header={<ProtectedHeader />}>
			<ProtectedSidebar role={user.role} />
			<SidebarInset className="w-full bg-card flex flex-1 flex-col gap-8 p-8">
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
