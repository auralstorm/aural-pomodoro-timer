import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { SegmentedTabs } from "./SegmentedTabs";

type TabValue = "focus" | "shortBreak" | "longBreak";

const options = [
  { value: "focus", label: "专注" },
  { value: "shortBreak", label: "短休息" },
  { value: "longBreak", label: "长休息" },
] satisfies Array<{ value: TabValue; label: string }>;

function ControlledTabs() {
  const [value, setValue] = useState<TabValue>("focus");

  return <SegmentedTabs onChange={setValue} options={options} value={value} />;
}

describe("SegmentedTabs", () => {
  it("moves the active background with transform when selected tab changes", () => {
    const { container } = render(<ControlledTabs />);
    const indicator = container.querySelector("[data-slot='segmented-tabs-indicator']");

    expect(indicator).toHaveStyle({
      transform: "translateX(calc(var(--active-index) * 100%))",
    });
    expect(indicator?.parentElement).toHaveStyle("--active-index: 0");

    fireEvent.click(screen.getByRole("button", { name: "长休息" }));

    expect(indicator?.parentElement).toHaveStyle("--active-index: 2");
    expect(screen.getByRole("button", { name: "长休息" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
