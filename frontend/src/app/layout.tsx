import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";

import "@src/styles/index.css";

import type { ReactNode } from "react";

import { Toaster } from "@src/components/ui/sonner";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
	variable: "--font-open-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "RedProp",
	description: "Aplicación de gestión de propiedades inmobiliarias",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="es">
			<body
				className={`${montserrat.variable} ${openSans.variable} antialiased`}
			>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
