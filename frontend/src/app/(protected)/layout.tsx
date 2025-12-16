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
		<SidebarProvider header={<ProtectedHeader />} className="">
			<ProtectedSidebar role={user.role} />
			<SidebarInset className="w-full rounded-l-2xl rounded-r-2xl md:rounded-r-none  rounded-b-none relative h-[calc(100dvh-(var(--admin-header-height-mobile)))] lg:h-[calc(100dvh-(var(--admin-header-height)))] border-t border-l border-r md:border-r-0 items-center border-tertiary bg-card lg:p-8 p-4 overflow-y-auto">
				<MainLayout
					size="lg"
					className="flex flex-1 flex-col gap-4 lg:gap-8 mx-0 w-full! px-0"
				>
					{children}
				</MainLayout>
			</SidebarInset>
		</SidebarProvider>
	);
}
