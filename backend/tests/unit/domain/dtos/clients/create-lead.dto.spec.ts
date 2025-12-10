import { CreateLeadDto } from "@/domain/dtos/clients/create-lead.dto";

describe("CreateLeadDto", () => {
	describe("create - valid cases", () => {
		it("should create DTO with all required fields", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "Juan",
				last_name: "Pérez",
				phone: "2211234567",
				email: "juan@example.com",
			});

			expect(error).toBeUndefined();
			expect(dto).toBeDefined();
			expect(dto?.first_name).toBe("Juan");
			expect(dto?.last_name).toBe("Pérez");
			expect(dto?.phone).toBe("2211234567");
			expect(dto?.email).toBe("juan@example.com");
		});

		it("should trim whitespace from all fields", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "  Juan  ",
				last_name: "  Pérez  ",
				phone: "  2211234567  ",
				email: "  juan@example.com  ",
				notes: "  Some notes  ",
			});

			expect(error).toBeUndefined();
			expect(dto?.first_name).toBe("Juan");
			expect(dto?.last_name).toBe("Pérez");
			expect(dto?.phone).toBe("2211234567");
			expect(dto?.email).toBe("juan@example.com");
			expect(dto?.notes).toBe("Some notes");
		});

		it("should accept optional fields", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "Juan",
				last_name: "Pérez",
				phone: "2211234567",
				email: "juan@example.com",
				notes: "Cliente VIP",
				consultation_type_id: 1,
				property_id: 5,
			});

			expect(error).toBeUndefined();
			expect(dto?.notes).toBe("Cliente VIP");
			expect(dto?.consultation_type_id).toBe(1);
			expect(dto?.property_id).toBe(5);
		});

		it("should accept consultation_type name instead of ID", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "Juan",
				last_name: "Pérez",
				phone: "2211234567",
				email: "juan@example.com",
				consultation_type: "Compra",
			});

			expect(error).toBeUndefined();
			expect(dto?.consultation_type).toBe("Compra");
			expect(dto?.consultation_type_id).toBeUndefined();
		});
	});

	describe("create - validation errors", () => {
		it("should fail without first_name", () => {
			const [error, dto] = CreateLeadDto.create({
				last_name: "Pérez",
				phone: "2211234567",
				email: "juan@example.com",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail without last_name", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "Juan",
				phone: "2211234567",
				email: "juan@example.com",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail without phone", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "Juan",
				last_name: "Pérez",
				email: "juan@example.com",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail without email (required for leads)", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "Juan",
				last_name: "Pérez",
				phone: "2211234567",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail with both consultation_type_id and consultation_type", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "Juan",
				last_name: "Pérez",
				phone: "2211234567",
				email: "juan@example.com",
				consultation_type_id: 1,
				consultation_type: "Compra",
			});

			expect(error).toBe(
				"Provide either consultation_type_id OR consultation_type name, not both",
			);
			expect(dto).toBeUndefined();
		});

		it("should fail with invalid consultation_type_id", () => {
			const [error, dto] = CreateLeadDto.create({
				first_name: "Juan",
				last_name: "Pérez",
				phone: "2211234567",
				email: "juan@example.com",
				consultation_type_id: "invalid",
			});

			expect(error).toBe("Consultation type ID must be a number");
			expect(dto).toBeUndefined();
		});
	});
});
