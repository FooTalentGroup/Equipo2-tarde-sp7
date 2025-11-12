import Image from "next/image";

import { MapPin } from "lucide-react";

import type { DomicileProp } from "./data";

export const PropertyCard = ({ property }: { property: DomicileProp }) => {
	return (
		<article className="bg-white rounded-sm p-3 space-y-2">
			<Image
				className="max-w-full object-fit rounded-sm"
				src={property.thumbnail}
				alt="A simple american house"
				width={300}
				height={200}
			/>
			<h1 className="font-bold text-lg">{property.titleProperty}</h1>
			<p className="text-lg text-green-700 font-bold rounded-full">
				{property.price.toLocaleString("en-US", {
					style: "currency",
					currency: "USD",
				})}
			</p>
			<div className="flex items-center">
				<MapPin className="text-gray-600 mr-1" size={15} />
				<p className="text-gray-600 text-sm">{property.address}</p>
			</div>
			<div className="w-full h-0.5 bg-gray-100 my-3"></div>
		</article>
	);
};
