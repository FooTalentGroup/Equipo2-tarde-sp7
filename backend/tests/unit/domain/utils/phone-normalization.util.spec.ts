import { normalizePhone } from "@/domain/utils/phone-normalization.util";

describe("normalizePhone", () => {
	describe("normalization", () => {
		it("should remove spaces from phone number", () => {
			const result = normalizePhone("+54 221 123 4567");
			expect(result).toBe("+542211234567");
		});

		it("should remove hyphens from phone number", () => {
			const result = normalizePhone("+54-221-123-4567");
			expect(result).toBe("+542211234567");
		});

		it("should remove parentheses from phone number", () => {
			const result = normalizePhone("+54 (221) 123-4567");
			expect(result).toBe("+542211234567");
		});

		it("should handle phone with multiple special characters", () => {
			const result = normalizePhone("(221) 123-4567");
			expect(result).toBe("2211234567");
		});

		it("should handle already normalized phone", () => {
			const result = normalizePhone("+542211234567");
			expect(result).toBe("+542211234567");
		});
	});

	describe("edge cases", () => {
		it("should handle empty string", () => {
			const result = normalizePhone("");
			expect(result).toBe("");
		});

		it("should handle phone with only numbers", () => {
			const result = normalizePhone("2211234567");
			expect(result).toBe("2211234567");
		});

		it("should preserve plus sign at start", () => {
			const result = normalizePhone("+54 221 123 4567");
			expect(result).toContain("+");
			expect(result.indexOf("+")).toBe(0);
		});
	});
});
