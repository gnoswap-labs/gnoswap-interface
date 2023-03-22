import SelectTab from "./SelectTab";
import { render } from "@testing-library/react";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { RecoilRoot } from "recoil";

describe("SelectTab Component", () => {
  it("SelectTab render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <SelectTab
            selectIdx={0}
            list={["All", "Incentivized", "Non-Incentivized"]}
            onClick={() => {}}
          />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
