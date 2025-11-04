interface DomicileProp {
    titleProperty: string;
    price: string;
    address: string;
    thumbnail: string
}

export const domicileProp: DomicileProp = {
    titleProperty: "Serenity Cottage Premium Caves",
    price: (440000).toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
    address: '123 Main St, Tulsa, OK 74136',
    thumbnail: '/images/american-house.webp'
}