import { fireEvent, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import Calendar from "./Calendar";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("Calendar", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(Date.UTC(2026, 8, 1)));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("rejects dates after maxDate while accepting the boundary", () => {
    const onClickDate = jest.fn();

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <Calendar
            selectedDate={{ year: 2026, month: 9, date: 3 }}
            minDate={{ year: 2026, month: 9, date: 3 }}
            maxDate={{ year: 2026, month: 9, date: 10 }}
            onClickDate={onClickDate}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );

    const maximumDate = screen.getByText("10");
    const afterMaximumDate = screen.getByText("11");

    expect(afterMaximumDate).toHaveClass("disable-date");

    fireEvent.click(afterMaximumDate);
    expect(onClickDate).not.toHaveBeenCalled();

    fireEvent.click(maximumDate);
    expect(onClickDate).toHaveBeenCalledWith({ year: 2026, month: 9, date: 10 });
  });
});
