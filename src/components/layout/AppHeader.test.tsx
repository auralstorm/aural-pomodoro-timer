import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("renders only the floating primary navigation", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/focus"]}>
        <AppHeader />
      </MemoryRouter>,
    );

    const activeLink = screen.getByRole("link", { name: "专注" });

    expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(activeLink).toHaveClass("flex");
    expect(activeLink).toHaveClass("items-center");
    expect(activeLink).toHaveClass("gap-2");
    expect(container.querySelector('[data-slot="floating-nav-indicator"]')).toBeInTheDocument();
    expect(screen.queryByLabelText("番茄时钟首页")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("搜索任务、标签或笔记")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("查看通知")).not.toBeInTheDocument();
    expect(screen.queryByAltText("番茄小助手")).not.toBeInTheDocument();
  });
});
