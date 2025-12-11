"use client";

import { Card, CardContent } from "@src/components/ui/card";
import { FileText } from "lucide-react";

interface ClientNotesProps {
	notes?: string;
}

export function ClientNotes({ notes }: ClientNotesProps) {
	return (
		<Card>
			<CardContent className="px-4 py-1">
				<h3 className="font-semibold text-lg text-slate-900 mb-4 flex items-center gap-2">
					<FileText className="h-5 w-5" />
					Notas
				</h3>
				<div className="bg-slate-50 p-4 rounded-lg">
					<p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
						{notes || "No hay notas registradas para este cliente."}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
