import SelectTab from "./SelectTabV2";
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
            list={[
              { display: "All", key: "all" },
              { display: "Incentivized", key: "Incentivized" },
              { display: "Non-Incentivized", key: "Incentivized" },
            ]}
            onClick={() => {}}
          />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
