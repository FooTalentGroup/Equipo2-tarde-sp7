import Image from "next/image";

import { ImagePlaceholder } from "@src/components/ui/image-placeholder";
import type { PropertyDetail } from "@src/types/property-detail";
import { ImageIcon } from "lucide-react";

type Props = {
	property: PropertyDetail;
};

export default function PropertyMultimedia({ property }: Props) {
	if (!property.images || property.images.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center bg-card">
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
					<ImageIcon className="h-8 w-8" />
				</div>
				<h3 className="mb-1 text-lg font-medium text-foreground">
					Sin imágenes
				</h3>
				<p className="text-sm text-muted-foreground max-w-sm">
					Esta propiedad aún no tiene contenido multimedia disponible para
					mostrar.
				</p>
			</div>
		);
	}

	return (
		<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
			{property.images.map((image, index) => (
				<li key={image.id}>
					<figure className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
						{image.file_path ? (
							<Image
								src={image.file_path}
								alt={`${property.title} - Imagen ${index + 1}`}
								fill
								className="object-cover"
								sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
							/>
						) : (
							<ImagePlaceholder className="h-full w-full" />
						)}
					</figure>
				</li>
			))}
		</ul>
	);
}
