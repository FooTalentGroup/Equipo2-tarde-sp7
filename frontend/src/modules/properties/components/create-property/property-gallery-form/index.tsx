import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemPreview,
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
import * as Sortable from "@src/components/ui/sortable";
import { cn } from "@src/lib/utils";
import type { Property } from "@src/types/property";
import { Move, Plus, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface PropertyCharacteristicsProps {
	form: UseFormReturn<Property>;
}

export default function PropertyGalleryForm({
	form,
}: PropertyCharacteristicsProps) {
	return (
		<FormField
			control={form.control}
			name="gallery"
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<FileUpload
							value={field.value}
							onValueChange={field.onChange}
							accept="image/png, image/jpeg, image/avif"
							maxFiles={Infinity}
							maxSize={3 * 1024 * 1024}
							onFileReject={(_, message) => {
								let error = message;
								if (message === "File too large") {
									error =
										"El archivo es demasiado grande. El tamaño máximo es 3MB.";
								} else if (message === "File type not accepted") {
									error = "Tipo de archivo no aceptado.";
								}
								form.setError("gallery", {
									message: error,
								});
							}}
							multiple
						>
							<Sortable.Root
								value={field.value}
								onValueChange={field.onChange}
								getItemValue={(file) =>
									`${file.name}-${file.size}-${file.lastModified}`
								}
								orientation="mixed"
							>
								<div className="grid grid-cols-4 gap-4">
									<Sortable.Content asChild>
										<FileUploadList className="contents">
											{field.value.map((file, index) => {
												const fileId = `${file.name}-${file.size}-${file.lastModified}`;
												return (
													<Sortable.Item key={fileId} value={fileId} asChild>
														<FileUploadItem
															value={file}
															className={cn(
																"group relative aspect-square size-full overflow-hidden rounded-lg p-0",
																index === 0
																	? "border-tertiary border-4"
																	: "border",
															)}
														>
															<FileUploadItemPreview className="size-full rounded-none border-0 bg-transparent" />
															{index === 0 && (
																<Badge
																	variant="tertiary"
																	className="absolute top-0 left-0 rounded-tl-none! rounded-bl-none!"
																>
																	Imagen principal
																</Badge>
															)}
															<div className="absolute right-0 bottom-0 left-0 grid grid-cols-2 items-center justify-between bg-sidebar-accent opacity-0 h-8 transition-opacity group-hover:opacity-100">
																<Sortable.ItemHandle asChild>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="w-full  hover:transparent h-full rounded-none cursor-grab data-dragging:cursor-grabbing"
																	>
																		<Move className="size-4" />
																		<span className="sr-only">
																			Mover imagen
																		</span>
																	</Button>
																</Sortable.ItemHandle>
																<FileUploadItemDelete asChild>
																	<Button
																		variant="ghost"
																		size="icon"
																		className="w-full hover:transparent h-full rounded-none"
																	>
																		<Trash2 className="size-4" />
																		<span className="sr-only">Delete</span>
																	</Button>
																</FileUploadItemDelete>
															</div>
														</FileUploadItem>
													</Sortable.Item>
												);
											})}
										</FileUploadList>
									</Sortable.Content>
									<FileUploadDropzone className="aspect-square flex-col justify-center border-dashed bg-transparent p-0">
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
												<span className="sr-only">Agregar imagen </span>
											</Button>
										</FileUploadTrigger>
									</FileUploadDropzone>
								</div>
								<Sortable.Overlay>
									{(params) => {
										const file = field.value.find(
											(f) =>
												`${f.name}-${f.size}-${f.lastModified}` ===
												params.value,
										);
										if (!file) return null;
										return (
											<FileUploadItem
												value={file}
												className="relative aspect-square size-full overflow-hidden rounded-lg border p-0"
											>
												<FileUploadItemPreview className="size-full rounded-none border-0 bg-transparent" />
											</FileUploadItem>
										);
									}}
								</Sortable.Overlay>
							</Sortable.Root>
						</FileUpload>
					</FormControl>
					<FormDescription>
						Sube al menos 3 imágenes (PNG, JPG, AVIF) con un tamaño máximo de
						3MB.
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
