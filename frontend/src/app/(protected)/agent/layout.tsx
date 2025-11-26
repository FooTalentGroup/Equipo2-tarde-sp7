import type { ReactNode } from "react";

// import { redirect } from "next/navigation";

// import { paths } from "@src/lib/paths";
// import { verifySession } from "@src/modules/auth";
// import { ROLES } from "@src/types/user";

type Props = {
	children: ReactNode;
};

export default async function AgentLayout({ children }: Props) {
	// const { isAuth, user } = await verifySession();

	// if (!isAuth || !user) {
	// 	redirect(paths.auth.login());
	// }

	// if (user.role !== ROLES.AGENT) {
	// 	redirect(paths.public.unauthorized());
	// }

	return <>{children}</>;
}
