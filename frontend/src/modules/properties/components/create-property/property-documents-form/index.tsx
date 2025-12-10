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
	FormLabel,
	FormMessage,
} from "@src/components/ui/form";
import { Separator } from "@src/components/ui/separator";
import { Switch } from "@src/components/ui/switch";
import type { PropertyForm } from "@src/types/property";
import { FileText, Trash2, Upload } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<PropertyForm>;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function PropertyDocumentsForm({ form }: Props) {
	return (
		<div className="grid gap-8">
			<FormField
				control={form.control}
				name="documents.files"
				render={({ field }) => (
					<FormItem>
						<FormLabel className="text-base font-semibold text-primary">
							Documentación (opcional)
						</FormLabel>
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
								<div className="grid gap-6">
									<FileUploadDropzone className="border-none bg-transparent p-0 w-fit">
										<FileUploadTrigger asChild>
											<Button
												variant="outline-blue-normal"
												className="gap-2 h-11 px-4"
											>
												<Upload className="size-4" />
												Subir archivo
											</Button>
										</FileUploadTrigger>
									</FileUploadDropzone>

									<FileUploadList className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										{field.value?.map((file, index) => (
											<FileUploadItem
												key={`${file.name}-${index}`}
												value={file}
												className="relative flex items-center p-4 gap-3 border rounded-xl bg-card shadow-sm transition-all hover:shadow-md"
											>
												<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
													<FileText className="size-5" />
												</div>
												<div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
													<span className="text-sm font-medium leading-none truncate pr-6">
														{file.name}
													</span>
													<span className="text-xs text-muted-foreground truncate">
														{(file.size / 1024 / 1024).toFixed(2)} MB
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold uppercase text-gray-500">
														{file.type.split("/")[1] || "FILE"}
													</span>
													<FileUploadItemDelete asChild>
														<Button
															variant="ghost"
															size="icon"
															className="size-6 text-muted-foreground hover:text-destructive absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 sm:size-8"
														>
															<Trash2 className="size-4" />
															<span className="sr-only">Eliminar</span>
														</Button>
													</FileUploadItemDelete>
												</div>
											</FileUploadItem>
										))}
									</FileUploadList>
								</div>
							</FileUpload>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<Separator />

			<FormField
				control={form.control}
				name="basic.featured_web"
				render={({ field }) => (
					<FormItem className="flex flex-row items-center justify-between">
						<div className="space-y-1">
							<FormLabel className="text-xl font-semibold text-primary">
								Publicar en la web
							</FormLabel>
							<FormDescription className="text-base">
								La propiedad aparecerá en la landing page
							</FormDescription>
						</div>
						<FormControl>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}
