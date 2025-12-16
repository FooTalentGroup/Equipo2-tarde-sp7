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
			<div className="flex bg-muted h-64 w-full items-center justify-center rounded-lg lg:h-[500px]">
				<p className="">No hay imágenes disponibles</p>
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col gap-4 lg:h-[500px] lg:flex-row">
			<div className="relative w-full overflow-hidden rounded-2xl bg-muted lg:h-full">
				<Carousel setApi={setApi} className="w-full h-full">
					<CarouselContent className="h-full">
						{images.map((image, index) => (
							<CarouselItem key={image.id}>
								<figure className="relative flex aspect-video h-full w-full items-center justify-center overflow-hidden rounded-lg border-0 p-0 shadow-none">
									<Image
										src={image.file_path}
										alt={`Property image ${index + 1}`}
										fill
										className="h-full w-full object-cover"
										priority={index === 0}
									/>
								</figure>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="left-2 lg:hidden" variant="white" />
					<CarouselNext className="right-2 lg:hidden" variant="white" />
				</Carousel>
			</div>
			<Carousel
				orientation="vertical"
				className="hidden h-[500px] w-full max-w-xs lg:block"
				opts={{
					align: "start",
				}}
			>
				<CarouselContent className="-mt-1 flex h-[500px]">
					{images.map((image, index) => (
						<CarouselItem
							key={image.id}
							className={cn("basis-1/3 h-1/3 pt-3 px-1 pb-1")}
							onClick={() => handleThumbClick(index)}
						>
							<figure
								className={cn(
									"shadow-none bg-transparent flex items-center justify-center relative overflow-hidden rounded-lg w-full h-full aspect-video outline-transparent outline-4",
									index === current && "outline-tertiary",
								)}
							>
								<Image
									src={image.file_path}
									alt={`Thumbnail ${index + 1}`}
									fill
									className="object-cover w-full h-full"
								/>
							</figure>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious
					className="absolute top-0 left-1/2 -translate-x-1/2"
					variant="white"
				/>
				<CarouselNext
					className="absolute bottom-0 right-1/2 -translate-x-1/2"
					variant="white"
				/>
			</Carousel>
		</div>
	);
}
