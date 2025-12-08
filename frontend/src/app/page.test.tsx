import { render } from "@testing-library/react";
import { describe, test } from "vitest";

import Home from "./page";

describe("Home Page", () => {
	test("renders homepage", () => {
		render(<Home />);
	});
});
