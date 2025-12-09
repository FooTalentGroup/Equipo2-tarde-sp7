import { CreatePropertyConsultationDto } from "@/domain/dtos/consultations/create-property-consultation.dto";

describe("CreatePropertyConsultationDto", () => {
	describe("create - valid cases", () => {
		it("should create DTO with all required fields", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Estoy interesada en esta propiedad",
			});

			expect(error).toBeUndefined();
			expect(dto).toBeDefined();
			expect(dto?.property_id).toBe(1);
			expect(dto?.first_name).toBe("Ana");
			expect(dto?.last_name).toBe("Martínez");
			expect(dto?.phone).toBe("2211234567");
			expect(dto?.message).toBe("Estoy interesada en esta propiedad");
		});

		it("should accept property_id as string and convert to number", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: "5",
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Consulta sobre la propiedad",
			});

			expect(error).toBeUndefined();
			expect(dto?.property_id).toBe(5);
			expect(typeof dto?.property_id).toBe("number");
		});

		it("should trim whitespace from all fields", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "  Ana  ",
				last_name: "  Martínez  ",
				phone: "  2211234567  ",
				message: "  Estoy interesada  ",
				email: "  ana@example.com  ",
			});

			expect(error).toBeUndefined();
			expect(dto?.first_name).toBe("Ana");
			expect(dto?.last_name).toBe("Martínez");
			expect(dto?.message).toBe("Estoy interesada");
			expect(dto?.email).toBe("ana@example.com");
		});

		it("should normalize phone number", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				last_name: "Martínez",
				phone: "+54 (221) 123-4567",
				message: "Consulta sobre la propiedad",
			});

			expect(error).toBeUndefined();
			expect(dto?.phone).toBe("+542211234567");
		});

		it("should accept optional email", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Consulta sobre la propiedad",
				email: "ana@example.com",
			});

			expect(error).toBeUndefined();
			expect(dto?.email).toBe("ana@example.com");
		});

		it("should work without email", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Consulta sobre la propiedad",
			});

			expect(error).toBeUndefined();
			expect(dto?.email).toBeUndefined();
		});
	});

	describe("create - validation errors", () => {
		it("should fail without property_id", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Consulta",
			});

			expect(error).toBe("Property ID is required");
			expect(dto).toBeUndefined();
		});

		it("should fail with invalid property_id", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: "invalid",
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Consulta",
			});

			expect(error).toBe("Property ID must be a valid number");
			expect(dto).toBeUndefined();
		});

		it("should fail with property_id <= 0", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 0,
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Consulta",
			});

			expect(error).toBe("Property ID must be greater than 0");
			expect(dto).toBeUndefined();
		});

		it("should fail without first_name", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				last_name: "Martínez",
				phone: "2211234567",
				message: "Consulta",
			});

			expect(error).toBe("First name is required");
			expect(dto).toBeUndefined();
		});

		it("should fail without last_name", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				phone: "2211234567",
				message: "Consulta",
			});

			expect(error).toBe("Last name is required");
			expect(dto).toBeUndefined();
		});

		it("should fail without phone", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				last_name: "Martínez",
				message: "Consulta",
			});

			expect(error).toBe("Phone is required");
			expect(dto).toBeUndefined();
		});

		it("should fail without message", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
			});

			expect(error).toBe("Message is required");
			expect(dto).toBeUndefined();
		});

		it("should fail with message too short", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Hola",
			});

			expect(error).toBe("Message must be at least 10 characters");
			expect(dto).toBeUndefined();
		});

		it("should fail with invalid email format", () => {
			const [error, dto] = CreatePropertyConsultationDto.create({
				property_id: 1,
				first_name: "Ana",
				last_name: "Martínez",
				phone: "2211234567",
				message: "Consulta sobre la propiedad",
				email: "invalid-email",
			});

			expect(error).toBe("Invalid email format");
			expect(dto).toBeUndefined();
		});
	});
});
