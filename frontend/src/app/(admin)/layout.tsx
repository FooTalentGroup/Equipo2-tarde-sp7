import { redirect } from "next/navigation";

import AdminHeader from "@src/components/layouts/header/admin-header";
import { AppSidebar } from "@src/components/sidebars/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@src/components/ui/sidebar";
import { paths } from "@src/lib/paths";
import { verifySession } from "@src/modules/auth/lib/dal";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuth } = await verifySession();

	if (!isAuth) {
		redirect(paths.auth.login());
	}

	return (
		<SidebarProvider header={<AdminHeader />}>
			<AppSidebar />
			{/* <AdminHeader /> */}
			<SidebarInset>
				{/* <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Panel de Control</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header> */}

				<div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
