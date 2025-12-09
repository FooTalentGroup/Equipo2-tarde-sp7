import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import MainLayout from "@src/components/layouts/main-layout";
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
			<SidebarInset className="w-full rounded-l-2xl border-t border-l border-tertiary bg-card  p-8">
				<MainLayout size="lg" className="flex flex-1 flex-col gap-8">
					{children}
				</MainLayout>
			</SidebarInset>
		</SidebarProvider>
	);
}
