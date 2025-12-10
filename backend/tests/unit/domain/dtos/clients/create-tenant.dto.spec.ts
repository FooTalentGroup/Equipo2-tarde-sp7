import { CreateTenantDto } from "@/domain/dtos/clients/create-tenant.dto";

describe("CreateTenantDto", () => {
	describe("create - valid cases", () => {
		it("should create DTO with required fields only", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
				phone: "2211234567",
			});

			expect(error).toBeUndefined();
			expect(dto).toBeDefined();
			expect(dto?.first_name).toBe("Carlos");
			expect(dto?.last_name).toBe("Rodríguez");
			expect(dto?.phone).toBe("2211234567");
		});

		it("should create DTO with contract information", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
				phone: "2211234567",
				property_id: 5,
				contract_start_date: "2024-01-01",
				contract_end_date: "2025-01-01",
				monthly_amount: 50000,
				currency_type_id: 1,
			});

			expect(error).toBeUndefined();
			expect(dto?.property_id).toBe(5);
			expect(dto?.contract_start_date).toBe("2024-01-01");
			expect(dto?.contract_end_date).toBe("2025-01-01");
			expect(dto?.monthly_amount).toBe(50000);
			expect(dto?.currency_type_id).toBe(1);
		});

		it("should accept Date objects for contract dates", () => {
			const startDate = new Date("2024-01-01");
			const endDate = new Date("2025-01-01");

			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
				phone: "2211234567",
				contract_start_date: startDate,
				contract_end_date: endDate,
			});

			expect(error).toBeUndefined();
			expect(dto?.contract_start_date).toBe("2024-01-01");
			expect(dto?.contract_end_date).toBe("2025-01-01");
		});

		it("should trim whitespace from all fields", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "  Carlos  ",
				last_name: "  Rodríguez  ",
				phone: "  2211234567  ",
				email: "  carlos@example.com  ",
				property_address: "  Av. Libertad 456  ",
			});

			expect(error).toBeUndefined();
			expect(dto?.first_name).toBe("Carlos");
			expect(dto?.last_name).toBe("Rodríguez");
			expect(dto?.phone).toBe("2211234567");
			expect(dto?.email).toBe("carlos@example.com");
			expect(dto?.property_address).toBe("Av. Libertad 456");
		});

		it("should accept reminders and external reference", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
				phone: "2211234567",
				remind_increase: true,
				remind_contract_end: false,
				external_reference: "REF-2024-001",
			});

			expect(error).toBeUndefined();
			expect(dto?.remind_increase).toBe(true);
			expect(dto?.remind_contract_end).toBe(false);
			expect(dto?.external_reference).toBe("REF-2024-001");
		});
	});

	describe("create - validation errors", () => {
		it("should fail without first_name", () => {
			const [error, dto] = CreateTenantDto.create({
				last_name: "Rodríguez",
				phone: "2211234567",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail without last_name", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				phone: "2211234567",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail without phone", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
			});

			expect(error).toBeDefined();
			expect(dto).toBeUndefined();
		});

		it("should fail with both currency_type_id and currency_type", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
				phone: "2211234567",
				currency_type_id: 1,
				currency_type: "ARS",
			});

			expect(error).toBe(
				"Provide either currency_type_id OR currency_type name, not both",
			);
			expect(dto).toBeUndefined();
		});

		it("should fail with invalid date format", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
				phone: "2211234567",
				contract_start_date: "01/01/2024", // Invalid format
			});

			expect(error).toContain("Invalid contract_start_date format");
			expect(dto).toBeUndefined();
		});

		it("should fail when end_date is before start_date", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
				phone: "2211234567",
				contract_start_date: "2025-01-01",
				contract_end_date: "2024-01-01",
			});

			expect(error).toBe("Contract end date must be after start date");
			expect(dto).toBeUndefined();
		});

		it("should fail with negative monthly_amount", () => {
			const [error, dto] = CreateTenantDto.create({
				first_name: "Carlos",
				last_name: "Rodríguez",
				phone: "2211234567",
				monthly_amount: -1000,
			});

			expect(error).toBe("Monthly amount must be a positive number");
			expect(dto).toBeUndefined();
		});
	});
});
