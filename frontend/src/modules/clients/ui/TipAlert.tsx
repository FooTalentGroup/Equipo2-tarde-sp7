import { Card, CardContent } from "@src/components/ui/card";
import { Info } from "lucide-react";

export default function TipAlert() {
	return (
		<Card className="w-[275px] h-fit rounded-xl border-none shadow-md/20 p-4 mt-4">
			<div className="flex items-start gap-3">
				<div className="flex p-2 items-center justify-center rounded-md bg-secondary-light/50 text-secondary">
					<Info className="h-5 w-5" />
				</div>

				<CardContent className="p-0">
					<h3 className="text-base font-medium">Consejo</h3>
					<p className="text-sm text-muted-foreground leading-snug">
						Completa todos los campos para tener una publicación más efectiva
					</p>
				</CardContent>
			</div>
		</Card>
	);
}
