import { CreateOwnerDto } from "@/domain/dtos/clients/create-owner.dto";

describe("CreateOwnerDto", () => {
	describe("create - valid cases", () => {
		it("should create DTO with required fields only", () => {
			const [error, dto] = CreateOwnerDto.create({
				first_name: "María",
				last_name: "González",
				phone: "2211234567",
			});

			expect(error).toBeUndefined();
			expect(dto).toBeDefined();
			expect(dto?.first_name).toBe("María");
			expect(dto?.last_name).toBe("González");
			expect(dto?.phone).toBe("2211234567");
		});

		it("should create DTO with all fields", () => {
			const [error, dto] = CreateOwnerDto.create({
				first_name: "María",
				last_name: "González",
				phone: "2211234567",
				email: "maria@example.com",
				dni: "12345678",
				address: "Calle 123",
				notes: "Propietaria de 3 inmuebles",
				property_id: 10,
			});

			expect(error).toBeUndefined();
			expect(dto?.email).toBe("maria@example.com");
			expect(dto?.dni).toBe("12345678");
			expect(dto?.address).toBe("Calle 123");
			expect(dto?.notes).toBe("Propietaria de 3 inmuebles");
			expect(dto?.property_id).toBe(10);
		});

		it("should trim whitespace from all fields", () => {
			const [error, dto] = CreateOwnerDto.create({
				first_name: "  María  ",
				last_name: "  González  ",
				phone: "  2211234567  ",
				email: "  maria@example.com  ",
				dni: "  12345678  ",
				address: "  Calle 123  ",
			});

			expect(error).toBeUndefined();
			expect(dto?.first_name).toBe("María");
			expect(dto?.last_name).toBe("González");
			expect(dto?.phone).toBe("2211234567");
			expect(dto?.email).toBe("maria@example.com");
			expect(dto?.dni).toBe("12345678");
			expect(dto?.address).toBe("Calle 123");
		});

		it("should accept owner without email (optional)", () => {
			const [error, dto] = CreateOwnerDto.create({
				first_name: "María",
				last_name: "González",
				phone: "2211234567",
			});

			expect(error).toBeUndefined();
			expect(dto?.email).toBeUndefined();
		});
	});

	describe("create - validation errors", () => {
		it("should fail without first_name", () => {
			const [error, dto] = CreateOwnerDto.create({
				last_name: "González",
				phone: "2211234567",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail without last_name", () => {
			const [error, dto] = CreateOwnerDto.create({
				first_name: "María",
				phone: "2211234567",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail without phone", () => {
			const [error, dto] = CreateOwnerDto.create({
				first_name: "María",
				last_name: "González",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});
	});
});
