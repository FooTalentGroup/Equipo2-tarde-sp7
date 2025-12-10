import { CustomError } from "@/domain/errors/custom.error";

describe("CustomError", () => {
	describe("badRequest", () => {
		it("should create a 400 error with correct message", () => {
			const error = CustomError.badRequest("Invalid input");

			expect(error.message).toBe("Invalid input");
			expect(error.statusCode).toBe(400);
		});
	});

	describe("unauthorized", () => {
		it("should create a 401 error", () => {
			const error = CustomError.unauthorized("Not authenticated");

			expect(error.message).toBe("Not authenticated");
			expect(error.statusCode).toBe(401);
		});
	});

	describe("notFound", () => {
		it("should create a 404 error", () => {
			const error = CustomError.notFound("Resource not found");

			expect(error.message).toBe("Resource not found");
			expect(error.statusCode).toBe(404);
		});
	});

	describe("conflict", () => {
		it("should create a 409 error", () => {
			const error = CustomError.conflict("Duplicate entry");

			expect(error.message).toBe("Duplicate entry");
			expect(error.statusCode).toBe(409);
		});
	});

	describe("internalServerError", () => {
		it("should create a 500 error", () => {
			const error = CustomError.internalServerError("Server error");

			expect(error.message).toBe("Server error");
			expect(error.statusCode).toBe(500);
		});
	});
});
