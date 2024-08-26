import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import GovernanceDetailInfo from "./GovernanceDetailInfo";

describe("GovernanceDetailInfo Component", () => {
  it("GovernanceDetailInfo render", () => {
    const mockProps = {
      title: "DefaultTooltip",
      value: "$1.10",
      tooltip: "Hello world",
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <GovernanceDetailInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>
    );
  });
});
