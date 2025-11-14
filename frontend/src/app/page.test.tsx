import { describe, test } from "vitest"
import { render } from "@testing-library/react"

import Home from "./page"

describe("Home Page", () => {
  test("renders homepage", () => {
  render(<Home />)
})
})