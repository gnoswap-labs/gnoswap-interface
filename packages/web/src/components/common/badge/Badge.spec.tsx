import Badge from "./Badge";
import { render } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import GnoswapThemeProvider from "@/providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { BadgeHierarchy } from "./Badge.styles";

describe("Badge Component", () => {
  it("Badge render", () => {
    render(
      <RecoilRoot>
        <GnoswapThemeProvider>
          <Badge
            text="0.3%"
            style={{
              hierarchy: BadgeHierarchy.Primary,
            }}
          />
        </GnoswapThemeProvider>
      </RecoilRoot>,
    );
  });
});
