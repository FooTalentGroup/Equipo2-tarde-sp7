"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";

import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@src/components/ui/carousel";
import { cn } from "@src/lib/utils";
import type { PropertyImage } from "@src/types/property-detail";

type Props = {
	images: PropertyImage[];
};

export default function PropertyGallery({ images }: Props) {
	const [api, setApi] = useState<CarouselApi | null>(null);
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCurrent(api.selectedScrollSnap());

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap());
		});
	}, [api]);

	const handleThumbClick = useCallback(
		(index: number) => {
			api?.scrollTo(index);
		},
		[api],
	);

	if (!images || images.length === 0) {
		return (
			<div className="flex h-[400px] w-full items-center justify-center rounded-lg bg-muted">
				<p className="">No hay imágenes disponibles</p>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-3">
			<Carousel setApi={setApi} className="w-full">
				<CarouselContent>
					{images.map((image, index) => (
						<CarouselItem key={image.id}>
							<figure className="border-0 shadow-none flex items-center justify-center p-0 relative overflow-hidden rounded-lg aspect-video h-[295px] xl:h-[400px] w-full">
								<Image
									src={image.file_path}
									alt={`Property image ${index + 1}`}
									fill
									className="object-cover w-full h-full"
									priority={index === 0}
								/>
							</figure>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			<Carousel
				className="w-full"
				opts={{
					align: "center",
				}}
			>
				<CarouselContent className="flex">
					{images.map((image, index) => (
						<CarouselItem
							key={image.id}
							className={cn("basis-1/4")}
							onClick={() => handleThumbClick(index)}
						>
							<figure
								className={cn(
									"shadow-none bg-transparent flex items-center justify-center relative overflow-hidden rounded-lg w-full aspect-video border border-transparent",
									index === current && "border-2 border-tertiary",
								)}
							>
								<Image
									src={image.file_path}
									alt={`Thumbnail ${index + 1}`}
									fill
									className="object-cover w-full"
								/>
							</figure>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="left-2" variant="white" />
				<CarouselNext className="right-2" variant="white" />
			</Carousel>
		</div>
	);
}
