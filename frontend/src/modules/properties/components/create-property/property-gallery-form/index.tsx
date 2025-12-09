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
import type { PropertyForm } from "@src/types/property";
import { Move, Plus, Trash2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type Props = {
	form: UseFormReturn<PropertyForm>;
};

type FileWithId = File & { uniqueId?: string };

export default function PropertyGalleryForm({ form }: Props) {
	return (
		<FormField
			control={form.control}
			name="images.gallery"
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<FileUpload
							value={field.value}
							onValueChange={(newFiles) => {
								const filesWithIds = newFiles.map((file) => {
									const fileWithId = file as FileWithId;
									if (!fileWithId.uniqueId) {
										fileWithId.uniqueId = crypto.randomUUID();
									}
									return fileWithId;
								});
								field.onChange(filesWithIds);
							}}
							accept="image/png, image/jpeg, image/webp"
							maxFiles={Infinity}
							multiple
						>
							<Sortable.Root
								value={field.value || []}
								onValueChange={field.onChange}
								getItemValue={(item) => {
									const file = item as File & { uniqueId?: string };
									return (
										file.uniqueId ||
										`${file.name}-${file.size}-${file.lastModified}`
									);
								}}
								orientation="mixed"
							>
								<div className="grid grid-cols-4 gap-4">
									<Sortable.Content asChild>
										<FileUploadList className="contents">
											{field.value?.map((file, index) => {
												const fileWithId = file as File & { uniqueId?: string };
												const fileId =
													fileWithId.uniqueId ||
													`${file.name}-${file.size}-${file.lastModified}`;
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
															<FileUploadItemPreview
																className="size-full rounded-none border-0 bg-transparent"
																render={(file, fallback) => {
																	const customFile = file as File & {
																		preview?: string;
																	};
																	if (customFile.preview) {
																		return (
																			<img
																				src={customFile.preview}
																				alt={file.name}
																				className="size-full object-cover"
																			/>
																		);
																	}
																	return fallback();
																}}
															/>
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
									{(field.value?.length || 0) < 10 && (
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
									)}
								</div>
								<Sortable.Overlay>
									{(params) => {
										const file = field.value?.find((f) => {
											const fileWithId = f as File & { uniqueId?: string };
											const id =
												fileWithId.uniqueId ||
												`${f.name}-${f.size}-${f.lastModified}`;
											return id === params.value;
										});
										if (!file) return null;
										return (
											<FileUploadItem
												value={file}
												className="relative aspect-square size-full overflow-hidden rounded-lg border p-0"
											>
												<FileUploadItemPreview
													className="size-full rounded-none border-0 bg-transparent"
													render={(file, fallback) => {
														const customFile = file as File & {
															preview?: string;
														};
														if (customFile.preview) {
															return (
																<img
																	src={customFile.preview}
																	alt={file.name}
																	className="size-full object-cover"
																/>
															);
														}
														return fallback();
													}}
												/>
											</FileUploadItem>
										);
									}}
								</Sortable.Overlay>
							</Sortable.Root>
						</FileUpload>
					</FormControl>
					<FormDescription>
						Sube al menos 3 imágenes (PNG, JPG, WEBP) con un tamaño máximo de
						1MB.
					</FormDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
