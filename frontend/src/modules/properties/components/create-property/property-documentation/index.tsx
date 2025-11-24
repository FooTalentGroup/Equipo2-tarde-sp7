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
import type { PropertyData } from "@src/types/property";
import { Upload } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface PropertyDocumentationProps {
	form: UseFormReturn<PropertyData>;
}

export default function PropertyDocumentation({
	form,
}: PropertyDocumentationProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const fileNames = Array.from(files).map((file) => file.name);
			setUploadedFiles((prev) => [...prev, ...fileNames]);
			form.setValue("documents", [...uploadedFiles, ...fileNames]);
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const removeFile = (index: number) => {
		const newFiles = uploadedFiles.filter((_, i) => i !== index);
		setUploadedFiles(newFiles);
		form.setValue("documents", newFiles);
	};

	return (
		<div className="grid gap-4">
			<FormField
				control={form.control}
				name="documents"
				render={({ field }) => (
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
