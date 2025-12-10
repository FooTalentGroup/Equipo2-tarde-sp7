import { ClientEntity } from "@/domain/entities/client.entity";

describe("ClientEntity", () => {
	const mockClientData = {
		id: 1,
		first_name: "Juan",
		last_name: "Pérez",
		email: "juan@example.com",
		phone: "+542211234567",
		dni: "12345678",
		address: "Calle 123",
		notes: "Cliente VIP",
		contact_category_id: 1,
		rental_interest: true,
		purchase_interest: false,
		registered_at: new Date("2024-01-01"),
	};

	describe("fromDatabaseObject", () => {
		it("should create entity from database object", () => {
			const entity = ClientEntity.fromDatabaseObject(mockClientData);

			expect(entity).toBeInstanceOf(ClientEntity);
			expect(entity.id).toBe(1);
			expect(entity.first_name).toBe("Juan");
			expect(entity.last_name).toBe("Pérez");
			expect(entity.email).toBe("juan@example.com");
			expect(entity.phone).toBe("+542211234567");
		});

		it("should handle optional fields", () => {
			const minimalData = {
				id: 2,
				first_name: "María",
				last_name: "González",
				phone: "2211234567",
				contact_category_id: 2,
				registered_at: new Date(),
			};

			const entity = ClientEntity.fromDatabaseObject(minimalData);

			expect(entity.id).toBe(2);
			expect(entity.email).toBeUndefined();
			expect(entity.dni).toBeUndefined();
			expect(entity.address).toBeUndefined();
		});
	});

	describe("toPublicObject", () => {
		it("should return public representation of client", () => {
			const entity = ClientEntity.fromDatabaseObject(mockClientData);
			const publicObj = entity.toPublicObject();

			expect(publicObj.id).toBe(1);
			expect(publicObj.first_name).toBe("Juan");
			expect(publicObj.last_name).toBe("Pérez");
			expect(publicObj.email).toBe("juan@example.com");
			expect(publicObj.phone).toBe("+542211234567");
		});

		it("should include all relevant fields", () => {
			const entity = ClientEntity.fromDatabaseObject(mockClientData);
			const publicObj = entity.toPublicObject();

			expect(publicObj).toHaveProperty("id");
			expect(publicObj).toHaveProperty("first_name");
			expect(publicObj).toHaveProperty("last_name");
			expect(publicObj).toHaveProperty("email");
			expect(publicObj).toHaveProperty("phone");
			expect(publicObj).toHaveProperty("dni");
			expect(publicObj).toHaveProperty("rental_interest");
			expect(publicObj).toHaveProperty("purchase_interest");
		});

		it("should handle null/undefined optional fields", () => {
			const dataWithNulls = {
				...mockClientData,
				email: null,
				dni: null,
				address: null,
				notes: null,
			};

			const entity = ClientEntity.fromDatabaseObject(dataWithNulls);
			const publicObj = entity.toPublicObject();

			expect(publicObj.email).toBeNull();
			expect(publicObj.dni).toBeNull();
		});
	});

	describe("fullName property", () => {
		it("should return concatenated first and last name", () => {
			const entity = ClientEntity.fromDatabaseObject(mockClientData);

			expect(entity.fullName).toBe("Juan Pérez");
		});
	});
});
