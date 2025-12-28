import type { ReactNode } from "react";

import PublicHeader from "@src/components/public-header";

type Props = {
	children: ReactNode;
};

export default async function MarketingLayout({ children }: Props) {
	return (
		<>
			<PublicHeader />
			<main className="bg-card">{children}</main>
		</>
	);
}
