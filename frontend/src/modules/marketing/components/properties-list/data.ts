export type DomicileProp = {
	index: number;
	titleProperty: string;
	price: number;
	address: string;
	thumbnail: string;
};

type PropertiesList = DomicileProp[];

export const propertiesList: PropertiesList = [
	{
		index: 0,
		titleProperty: "Serenity Cottage Premium Caves",
		price: 400000,
		address: "123 Main St, Tulsa, OK 74136",
		thumbnail: "/images/american-house.webp",
	},
	{
		index: 1,
		titleProperty: "Hollywood Hills Modern Villa",
		price: 800000,
		address: "Los Angeles, CA 90001",
		thumbnail: "/images/american-house.webp",
	},
	{
		index: 2,
		titleProperty: "Miami Beachfront Condo",
		price: 800000,
		address: "Miami, FL 33101",
		thumbnail: "/images/american-house.webp",
	},
];
