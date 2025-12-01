import type { Property } from "@src/types/property";

export const mockProperties: Property[] = [
	{
		basic: {
			title: "Moderno departamento en Palermo",
			property_type: "apartment",
			property_status: "available",
			description: "Hermoso departamento en el corazón de Palermo",
		},
		geography: {
			country: "Argentina",
			province: "Buenos Aires",
			city: "Palermo",
		},
		address: {
			street: "Av. Santa Fe",
			number: "2456",
			postal_code: "C1425",
		},
		values: {
			prices: [
				{
					price: 125000,
					currency_symbol: "USD",
					operation_type: "Venta",
					owner_id: "Juan Pérez",
				},
			],
			expenses: [
				{
					amount: 15000,
					currency_symbol: "ARS",
					frequency: "Mensual",
				},
			],
		},
		characteristics: {
			rooms_count: 4,
			floors_count: 1,
			bedrooms_count: 2,
			age: "5",
			bathrooms_count: 3,
			toilets_count: 0,
			parking_spaces_count: 0,
		},
		surface: {
			land_area: 0,
			covered_area: 0,
			semi_covered_area: 0,
			total_built_area: 0,
			uncovered_area: 0,
			total_area: 0,
		},
		services: {
			services: [],
		},
		images: {
			gallery: [],
		},
		internal: {},
	},
	{
		basic: {
			title: "Casa en Belgrano con jardín",
			property_type: "house",
			property_status: "available",
		},
		geography: {
			country: "Argentina",
			province: "Buenos Aires",
			city: "Belgrano",
		},
		address: {
			street: "Juramento",
			number: "3145",
			postal_code: "C1428",
		},
		values: {
			prices: [
				{
					price: 350000,
					currency_symbol: "USD",
					operation_type: "Venta",
					owner_id: "María González",
				},
			],
			expenses: [
				{
					amount: 25000,
					currency_symbol: "ARS",
					frequency: "Mensual",
				},
			],
		},
		characteristics: {
			rooms_count: 4,
			floors_count: 2,
			bedrooms_count: 3,
			age: "10",
			bathrooms_count: 2,
			toilets_count: 1,
			parking_spaces_count: 2,
		},
		surface: {
			land_area: 0,
			covered_area: 0,
			semi_covered_area: 0,
			total_built_area: 0,
			uncovered_area: 0,
			total_area: 0,
		},
		services: {
			services: [],
		},
		images: {
			gallery: [],
		},
		internal: {},
	},
	{
		basic: {
			title: "Loft en Recoleta",
			property_type: "apartment",
			property_status: "available",
		},
		geography: {
			country: "Argentina",
			province: "Buenos Aires",
			city: "Recoleta",
		},
		address: {
			street: "Av. Callao",
			number: "1234",
			postal_code: "C1023",
		},
		values: {
			prices: [
				{
					price: 180000,
					currency_symbol: "USD",
					operation_type: "Venta",
					owner_id: "Carlos Martínez",
				},
			],
			expenses: [
				{
					amount: 18000,
					currency_symbol: "ARS",
					frequency: "Mensual",
				},
			],
		},
		characteristics: {
			rooms_count: 2,
			floors_count: 1,
			bedrooms_count: 1,
			age: "2",
			bathrooms_count: 1,
			toilets_count: 0,
			parking_spaces_count: 0,
		},
		surface: {
			land_area: 0,
			covered_area: 0,
			semi_covered_area: 0,
			total_built_area: 0,
			uncovered_area: 0,
			total_area: 0,
		},
		services: {
			services: [],
		},
		images: {
			gallery: [],
		},
		internal: {},
	},
	{
		basic: {
			title: "Departamento con vista al río",
			property_type: "apartment",
			property_status: "available",
		},
		geography: {
			country: "Argentina",
			province: "Buenos Aires",
			city: "Núñez",
		},
		address: {
			street: "Av. del Libertador",
			number: "5678",
			postal_code: "C1429",
		},
		values: {
			prices: [
				{
					price: 280000,
					currency_symbol: "USD",
					operation_type: "Venta",
					owner_id: "Ana Rodríguez",
				},
			],
			expenses: [
				{
					amount: 22000,
					currency_symbol: "ARS",
					frequency: "Mensual",
				},
			],
		},
		characteristics: {
			rooms_count: 4,
			floors_count: 1,
			bedrooms_count: 3,
			age: "8",
			bathrooms_count: 2,
			toilets_count: 1,
			parking_spaces_count: 1,
		},
		surface: {
			land_area: 0,
			covered_area: 0,
			semi_covered_area: 0,
			total_built_area: 0,
			uncovered_area: 0,
			total_area: 0,
		},
		services: {
			services: [],
		},
		images: {
			gallery: [],
		},
		internal: {},
	},
	{
		basic: {
			title: "Monoambiente en Caballito",
			property_type: "apartment",
			property_status: "available",
		},
		geography: {
			country: "Argentina",
			province: "Buenos Aires",
			city: "Caballito",
		},
		address: {
			street: "Av. Rivadavia",
			number: "6789",
			postal_code: "C1406",
		},
		values: {
			prices: [
				{
					price: 65000,
					currency_symbol: "USD",
					operation_type: "Venta",
					owner_id: "Pedro López",
				},
			],
			expenses: [
				{
					amount: 8000,
					currency_symbol: "ARS",
					frequency: "Mensual",
				},
			],
		},
		characteristics: {
			rooms_count: 1,
			floors_count: 1,
			bedrooms_count: 1,
			age: "15",
			bathrooms_count: 1,
			toilets_count: 0,
			parking_spaces_count: 0,
		},
		surface: {
			land_area: 0,
			covered_area: 0,
			semi_covered_area: 0,
			total_built_area: 0,
			uncovered_area: 0,
			total_area: 0,
		},
		services: {
			services: [],
		},
		images: {
			gallery: [],
		},
		internal: {},
	},
	{
		basic: {
			title: "Penthouse en Puerto Madero",
			property_type: "ph",
			property_status: "available",
		},
		geography: {
			country: "Argentina",
			province: "Buenos Aires",
			city: "Puerto Madero",
		},
		address: {
			street: "Juana Manso",
			number: "1200",
			postal_code: "C1107",
		},
		values: {
			prices: [
				{
					price: 580000,
					currency_symbol: "USD",
					operation_type: "Venta",
					owner_id: "Roberto Fernández",
				},
			],
			expenses: [
				{
					amount: 45000,
					currency_symbol: "ARS",
					frequency: "Mensual",
				},
			],
		},
		characteristics: {
			rooms_count: 5,
			floors_count: 2,
			bedrooms_count: 4,
			age: "3",
			bathrooms_count: 3,
			toilets_count: 2,
			parking_spaces_count: 3,
		},
		surface: {
			land_area: 0,
			covered_area: 0,
			semi_covered_area: 0,
			total_built_area: 0,
			uncovered_area: 0,
			total_area: 0,
		},
		services: {
			services: [],
		},
		images: {
			gallery: [],
		},
		internal: {},
	},
	{
		basic: {
			title: "Departamento en Villa Urquiza",
			property_type: "apartment",
			property_status: "available",
		},
		geography: {
			country: "Argentina",
			province: "Buenos Aires",
			city: "Villa Urquiza",
		},
		address: {
			street: "Triunvirato",
			number: "4567",
			postal_code: "C1431",
		},
		values: {
			prices: [
				{
					price: 95000,
					currency_symbol: "USD",
					operation_type: "Venta",
					owner_id: "Laura Sánchez",
				},
			],
			expenses: [
				{
					amount: 10000,
					currency_symbol: "ARS",
					frequency: "Mensual",
				},
			],
		},
		characteristics: {
			rooms_count: 2,
			floors_count: 1,
			bedrooms_count: 1,
			age: "12",
			bathrooms_count: 1,
			toilets_count: 0,
			parking_spaces_count: 0,
		},
		surface: {
			land_area: 0,
			covered_area: 0,
			semi_covered_area: 0,
			total_built_area: 0,
			uncovered_area: 0,
			total_area: 0,
		},
		services: {
			services: [],
		},
		images: {
			gallery: [],
		},
		internal: {},
	},
	{
		basic: {
			title: "Casa quinta en San Isidro",
			property_type: "house",
			property_status: "available",
		},
		geography: {
			country: "Argentina",
			province: "Buenos Aires",
			city: "San Isidro",
		},
		address: {
			street: "Av. Centenario",
			number: "890",
			postal_code: "B1642",
		},
		values: {
			prices: [
				{
					price: 450000,
					currency_symbol: "USD",
					operation_type: "Venta",
					owner_id: "Diego Torres",
				},
			],
			expenses: [
				{
					amount: 30000,
					currency_symbol: "ARS",
					frequency: "Mensual",
				},
			],
		},
		characteristics: {
			rooms_count: 6,
			floors_count: 2,
			bedrooms_count: 5,
			age: "20",
			bathrooms_count: 3,
			toilets_count: 2,
			parking_spaces_count: 4,
		},
		surface: {
			land_area: 0,
			covered_area: 0,
			semi_covered_area: 0,
			total_built_area: 0,
			uncovered_area: 0,
			total_area: 0,
		},
		services: {
			services: [],
		},
		images: {
			gallery: [],
		},
		internal: {},
	},
];
