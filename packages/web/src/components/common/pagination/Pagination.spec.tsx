import { fireEvent, render, screen } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it.each([
    [1, ["", "1", "2", "3", "4", "5", "...", "10", ""]],
    [5, ["", "1", "...", "4", "5", "6", "...", "10", ""]],
    [10, ["", "1", "...", "6", "7", "8", "9", "10", ""]],
  ])("keeps the selected page and boundaries visible on page %i", (currentPage, labels) => {
    render(
      <GnoswapThemeProvider>
        <Pagination totalPage={10} currentPage={currentPage} siblingCount={1} onPageChange={jest.fn()} />
      </GnoswapThemeProvider>,
    );
    expect(screen.getAllByRole("button").map(button => button.textContent)).toEqual(labels);
    expect(screen.getByRole("button", { name: String(currentPage) })).toHaveClass("selected");
    screen.getAllByRole("button", { name: "..." }).forEach(button => expect(button).toBeDisabled());
  });

  it.each([
    [0, true, 7],
    [1, false, 9],
    [2, false, 11],
  ])("keeps every page stable with %i siblings", (siblingCount, compact, controlCount) => {
    const onPageChange = jest.fn();
    const view = (currentPage: number) => (
      <GnoswapThemeProvider>
        <Pagination
          totalPage={10}
          currentPage={currentPage}
          siblingCount={siblingCount}
          compact={compact}
          onPageChange={onPageChange}
        />
      </GnoswapThemeProvider>
    );
    const { rerender } = render(view(1));
    for (let currentPage = 1; currentPage <= 10; currentPage++) {
      rerender(view(currentPage));
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(controlCount);
      expect(screen.getByRole("button", { name: String(currentPage) })).toHaveClass("selected");
      expect(buttons[0]).toHaveProperty("disabled", currentPage === 1);
      expect(buttons[buttons.length - 1]).toHaveProperty("disabled", currentPage === 10);
      buttons.forEach(button => {
        onPageChange.mockClear();
        fireEvent.click(button);
        const page = Number(button.textContent);
        if (button.hasAttribute("disabled")) {
          expect(onPageChange).not.toHaveBeenCalled();
        } else {
          expect(onPageChange).toHaveBeenCalledTimes(1);
          expect(onPageChange).toHaveBeenCalledWith(
            page || (button === buttons[0] ? currentPage - 1 : currentPage + 1),
          );
        }
      });
    }
  });

  it.each([
    [1, ["", "1", "2", "3", "...", "10", ""]],
    [5, ["", "1", "...", "5", "...", "10", ""]],
    [10, ["", "1", "...", "8", "9", "10", ""]],
  ])("fills the mobile edge range on page %i", (currentPage, labels) => {
    render(
      <GnoswapThemeProvider>
        <Pagination totalPage={10} currentPage={currentPage} siblingCount={0} compact onPageChange={jest.fn()} />
      </GnoswapThemeProvider>,
    );
    expect(screen.getAllByRole("button").map(button => button.textContent)).toEqual(labels);
  });

  it.each([
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 0],
    [1, 0],
    [0, 2],
    [2, 2],
  ])("preserves valid ranges with %i siblings and %i boundaries", (siblingCount, boundaryCount) => {
    const view = (totalPage: number, currentPage: number) => (
      <GnoswapThemeProvider>
        <Pagination
          totalPage={totalPage}
          currentPage={currentPage}
          siblingCount={siblingCount}
          boundaryCount={boundaryCount}
          onPageChange={jest.fn()}
        />
      </GnoswapThemeProvider>
    );
    const { rerender } = render(view(1, 1));
    for (const totalPage of [1, 2, 3, 4, 5, 6, 7, 8, 10, 20]) {
      const expectedCount = Math.min(totalPage, 2 * boundaryCount + 2 * siblingCount + 3) + 2;
      for (let currentPage = 1; currentPage <= totalPage; currentPage++) {
        rerender(view(totalPage, currentPage));
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(expectedCount);
        const labels = buttons.slice(1, -1).map(button => button.textContent);
        const pages = labels.filter(label => label !== "...").map(Number);
        expect(pages).toEqual([...new Set(pages)].sort((a, b) => a - b));
        expect(pages.every(page => page >= 1 && page <= totalPage)).toBe(true);
        expect(screen.getByRole("button", { name: String(currentPage) })).toHaveClass("selected");
        if (totalPage + 2 === expectedCount) {
          expect(pages).toEqual(Array.from({ length: totalPage }, (_, index) => index + 1));
        }
        labels.forEach((label, index) => {
          if (label === "...") {
            const before = index === 0 ? 0 : Number(labels[index - 1]);
            const after = index === labels.length - 1 ? totalPage + 1 : Number(labels[index + 1]);
            expect(after - before).toBeGreaterThan(2);
            expect(buttons[index + 1]).toBeDisabled();
          }
        });
      }
    }
  });

  it("prevents every page change while disabled", () => {
    const onPageChange = jest.fn();
    render(
      <GnoswapThemeProvider>
        <Pagination totalPage={10} currentPage={5} disabled onPageChange={onPageChange} />
      </GnoswapThemeProvider>,
    );
    screen.getAllByRole("button").forEach(button => {
      expect(button).toBeDisabled();
      fireEvent.click(button);
    });
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
