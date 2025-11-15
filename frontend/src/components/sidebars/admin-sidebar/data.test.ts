import { navigation } from "@src/components/sidebars/admin-sidebar/data";
import { describe, expect, it } from "vitest";

describe("Navigation Data", () => {
	it("debe tener la estructura correcta", () => {
		expect(Array.isArray(navigation)).toBe(true);
		expect(navigation.length).toBeGreaterThan(0);
	});

	it("cada sección debe tener título o ítems", () => {
		navigation.forEach((section) => {
			expect(section).toHaveProperty("title");
			expect(section).toHaveProperty("items");
			expect(Array.isArray(section.items)).toBe(true);
			expect(section.items.length).toBeGreaterThanOrEqual(1);
		});
	});
});
