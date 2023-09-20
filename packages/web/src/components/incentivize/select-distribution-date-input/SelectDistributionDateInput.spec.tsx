import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SelectDistributionDateInput, { SelectDistributionDateInputProps } from "./SelectDistributionDateInput";

describe("SelectDistributionDateInput Component", () => {
  it("SelectDistributionDateInput render", () => {
    const args: SelectDistributionDateInputProps = {
      title: "Start Date",
      date: {
        year: 2023,
        month: 10,
        date: 1
      },
      setDate: () => { return; },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectDistributionDateInput {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});