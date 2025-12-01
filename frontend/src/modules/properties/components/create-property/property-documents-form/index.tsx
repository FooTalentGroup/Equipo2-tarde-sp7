import { Button } from "@src/components/ui/button";
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadList,
	FileUploadTrigger,
} from "@src/components/ui/file-upload";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@src/components/ui/form";
import type { Property } from "@src/types/property";
import { FileText, Plus, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface PropertyDocumentsProps {
	form: UseFormReturn<Property>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function PropertyDocumentsForm({
	form,
}: PropertyDocumentsProps) {
	return (
		<FormField
			control={form.control}
			name="documents.files"
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<FileUpload
							value={field.value || []}
							onValueChange={field.onChange}
							accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/png, image/jpeg"
							maxFiles={Infinity}
							maxSize={MAX_FILE_SIZE}
							onFileReject={(_, message) => {
								let error = message;
								if (message === "File too large") {
									error =
										"El archivo es demasiado grande. El tamaño máximo es 5MB.";
								} else if (message === "File type not accepted") {
									error = "Tipo de archivo no aceptado.";
								}
								form.setError("documents.files", {
									message: error,
								});
							}}
							multiple
						>
							<div className="grid gap-4">
								<FileUploadList>
									{field.value?.map((file, index) => (
										<FileUploadItem
											key={`${file.name}-${index}`}
											value={file}
											className="flex items-center justify-between p-2 border rounded-md"
										>
											<div className="flex items-center gap-2">
												<FileText className="size-5 text-muted-foreground" />
												<span className="text-sm font-medium truncate max-w-[200px]">
													{file.name}
												</span>
												<span className="text-xs text-muted-foreground">
													({(file.size / 1024 / 1024).toFixed(2)} MB)
												</span>
											</div>
											<FileUploadItemDelete asChild>
												<Button variant="ghost" size="icon" className="size-8">
													<Trash2 className="size-4" />
													<span className="sr-only">Eliminar</span>
												</Button>
											</FileUploadItemDelete>
										</FileUploadItem>
									))}
								</FileUploadList>

								<FileUploadDropzone className="h-32 flex-col justify-center border-dashed bg-transparent p-0">
									<FileUploadTrigger asChild>
										<Button
											variant="ghost"
											className="size-full flex-col gap-2 hover:bg-transparent"
										>
											<Plus className="size-8 text-muted-foreground" />
											<p className="font-normal text-xs">
												<span className="text-tertiary font-semibold underline">
													Click para subir
												</span>
												<br /> o arrastra y suelta
											</p>
											<span className="sr-only">Agregar documentos</span>
										</Button>
									</FileUploadTrigger>
								</FileUploadDropzone>
							</div>
						</FileUpload>
					</FormControl>
					<FormDescription>
						Sube documentos relevantes (PDF, Word, Imágenes) hasta 5MB.
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
