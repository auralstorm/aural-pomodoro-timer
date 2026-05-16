import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FocusTaskList } from "./FocusTaskList";

describe("FocusTaskList empty-state layout", () => {
  it("stretches the empty state to fill the task preview area", () => {
    render(<FocusTaskList tasks={[]} />);

    const emptyStateHeading = screen.getByRole("heading", { name: "还没有任务" });
    const emptyStateRoot = emptyStateHeading.closest("div[class*='border-dashed']");

    expect(emptyStateRoot).toHaveClass("h-full", "w-full");
    expect(emptyStateRoot?.parentElement).toHaveClass("flex-1", "h-full", "items-stretch");
  });
});
