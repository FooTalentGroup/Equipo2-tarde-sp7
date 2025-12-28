"use client";

import { useRef, useState } from "react";

import { Button } from "@src/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import type { PropertyForm } from "@src/types/property";
import { Upload } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface PropertyDocumentationProps {
	form: UseFormReturn<PropertyForm>;
}

export default function PropertyDocumentation({
	form,
}: PropertyDocumentationProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const newFiles = Array.from(files);
			const fileNames = newFiles.map((file) => file.name);
			setUploadedFiles((prev) => [...prev, ...fileNames]);

			const currentFiles = form.getValues("documents.files") || [];
			form.setValue("documents.files", [...currentFiles, ...newFiles]);
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const removeFile = (index: number) => {
		const newFiles = uploadedFiles.filter((_, i) => i !== index);
		setUploadedFiles(newFiles);

		const currentFiles = form.getValues("documents.files") || [];
		const updatedFiles = currentFiles.filter((_, i) => i !== index);
		form.setValue("documents.files", updatedFiles);
	};

	return (
		<div className="grid gap-4">
			<FormField
				control={form.control}
				name="documents.files"
				render={() => (
					<FormItem>
						<FormLabel>Documentación (opcional)</FormLabel>
						<FormControl>
							<div className="grid gap-4">
								<input
									ref={fileInputRef}
									type="file"
									multiple
									accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
									onChange={handleFileUpload}
									className="hidden"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={handleButtonClick}
									className="w-fit"
								>
									<Upload className="mr-2 h-4 w-4" />
									Subir archivo
								</Button>

								{uploadedFiles.length > 0 && (
									<div className="grid gap-2">
										{uploadedFiles.map((file, index) => (
											<div
												key={index}
												className="flex items-center justify-between rounded-md border p-2"
											>
												<span className="text-sm">{file}</span>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => removeFile(index)}
												>
													Eliminar
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
