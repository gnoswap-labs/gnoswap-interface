import { fireEvent, render, screen } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import Pagination from "./Pagination";

describe("Pagination", () => {
  it.each([
    [1, ["", "1", "2", "3", "...", "10", ""]],
    [5, ["", "1", "...", "4", "5", "6", "...", "10", ""]],
    [10, ["", "1", "...", "8", "9", "10", ""]],
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

  it.each([1, 5, 10])("supports zero siblings without losing page %i", currentPage => {
    const onPageChange = jest.fn();
    render(
      <GnoswapThemeProvider>
        <Pagination totalPage={10} currentPage={currentPage} siblingCount={0} onPageChange={onPageChange} />
      </GnoswapThemeProvider>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeLessThanOrEqual(7);
    expect(screen.getByRole("button", { name: String(currentPage) })).toHaveClass("selected");
    expect(buttons[0]).toHaveProperty("disabled", currentPage === 1);
    expect(buttons[buttons.length - 1]).toHaveProperty("disabled", currentPage === 10);
    fireEvent.click(buttons[currentPage === 10 ? 0 : buttons.length - 1]);
    expect(onPageChange).toHaveBeenCalledWith(currentPage === 10 ? 9 : currentPage + 1);
    fireEvent.click(screen.getByRole("button", { name: currentPage === 10 ? "1" : "10" }));
    expect(onPageChange).toHaveBeenLastCalledWith(currentPage === 10 ? 1 : 10);
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
