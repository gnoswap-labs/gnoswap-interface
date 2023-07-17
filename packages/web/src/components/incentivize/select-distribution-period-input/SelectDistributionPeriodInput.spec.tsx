import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import SelectDistributionPeriodInput, { SelectDistributionPeriodInputProps } from "./SelectDistributionPeriodInput";

describe('SelectDistributionPeriodInput Component', () => {
  it('SelectDistributionPeriodInput render', () => {
    const args: SelectDistributionPeriodInputProps = {
      title: 'Start Date',
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
          <SelectDistributionPeriodInput {...args} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});