"use client";

import type { ReactNode } from "react";

import { NuqsAdapter } from "nuqs/adapters/next/app";

type Props = {
	children: ReactNode;
};

export default function RootLayout({ children }: Props) {
	return <NuqsAdapter>{children}</NuqsAdapter>;
}
