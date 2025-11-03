import type { Property } from "./types";

// In-memory database for properties
let properties: Map<string, Property> = new Map();

// Initialize with some sample data
const sampleProperties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    description: "Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.",
    price: 350000,
    location: "Downtown, City Center",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    type: "apartment",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Spacious Family House",
    description: "Large family home with a beautiful garden and garage in a quiet neighborhood.",
    price: 575000,
    location: "Suburban Area, West Side",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    type: "house",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    title: "Luxury Beachfront Condo",
    description: "Exclusive condo with direct beach access and panoramic ocean views.",
    price: 890000,
    location: "Beachfront, East Coast",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    type: "condo",
    status: "available",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
];

// Initialize the map
sampleProperties.forEach(property => {
  properties.set(property.id, property);
});

// Helper to generate unique IDs
let nextId = 4;
function generateId(): string {
  return (nextId++).toString();
}

// Database operations
export const propertyDb = {
  getAll: (): Property[] => {
    return Array.from(properties.values());
  },

  getById: (id: string): Property | undefined => {
    return properties.get(id);
  },

  create: (propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">): Property => {
    const id = generateId();
    const now = new Date();
    const newProperty: Property = {
      ...propertyData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    properties.set(id, newProperty);
    return newProperty;
  },

  update: (id: string, propertyData: Partial<Omit<Property, "id" | "createdAt" | "updatedAt">>): Property | undefined => {
    const existing = properties.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: Property = {
      ...existing,
      ...propertyData,
      updatedAt: new Date(),
    };
    properties.set(id, updated);
    return updated;
  },

  delete: (id: string): boolean => {
    return properties.delete(id);
  },
};
