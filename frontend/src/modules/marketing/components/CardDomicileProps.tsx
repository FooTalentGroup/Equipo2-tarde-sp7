import Image from "next/image";
import { domicileProp } from "./cardDomicileData";
import { MapPin } from "lucide-react";
export const CardDomicileProps = () => {
	return (
		<article className="bg-white rounded-sm p-3 space-y-2">
			<Image
				className="max-w-full object-fit rounded-sm"
				src={domicileProp.thumbnail}
				alt="A simple american house"
				width={300}
				height={200}
			/>
				<h1 className="font-bold text-lg">
					{domicileProp.titleProperty}
				</h1>
				<p className="text-lg text-green-700 font-bold rounded-full">
					{domicileProp.price}
				</p>
			<div className="flex items-center">
				<MapPin className="text-gray-600 mr-1" size={15} />
				<p className="text-gray-600 text-sm">{domicileProp.address}</p>
			</div>
			<div className="w-full h-0.5 bg-gray-100 my-3"></div>
		</article>
	);
};
