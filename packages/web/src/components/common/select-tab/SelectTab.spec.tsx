import SelectTab from "./SelectTab";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { Provider as JotaiProvider } from "jotai";

describe("SelectTab Component", () => {
  it("SelectTab render", () => {
    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <SelectTab
            selectType={"7D"}
            list={["All", "Incentivized", "Non-Incentivized"]}
            onClick={() => {}}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
