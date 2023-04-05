import Badge, { BADGE_TYPE } from "./Badge";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";

describe("Badge Component", () => {
  it("Badge render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Badge type={BADGE_TYPE.LINE} text="0.3%" />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
