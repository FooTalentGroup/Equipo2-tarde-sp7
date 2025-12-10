module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/tests"],
	testMatch: ["**/*.spec.ts", "**/*.test.ts"],
	moduleFileExtensions: ["ts", "js", "json"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/*.d.ts",
		"!src/app.ts",
		"!src/config/**",
	],
	coverageDirectory: "coverage",
	testTimeout: 30000,
	verbose: true,
};
