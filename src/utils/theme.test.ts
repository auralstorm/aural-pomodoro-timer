import { describe, expect, it } from "vitest";

import { applyAppTheme } from "./theme";

describe("theme utilities", () => {
  it("applies the selected app theme to the document root", () => {
    const root = document.createElement("html");

    applyAppTheme("mint", root);

    expect(root.dataset.theme).toBe("mint");
    expect(root.classList.contains("dark")).toBe(false);
  });

  it("marks dark focus theme with the dark class", () => {
    const root = document.createElement("html");

    applyAppTheme("darkFocus", root);

    expect(root.dataset.theme).toBe("darkFocus");
    expect(root.classList.contains("dark")).toBe(true);
  });
});
