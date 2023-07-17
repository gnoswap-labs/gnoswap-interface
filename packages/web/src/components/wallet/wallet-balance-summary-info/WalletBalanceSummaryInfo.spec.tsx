import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalanceSummaryInfo from "./WalletBalanceSummaryInfo";

describe("WalletBalanceSummaryInfo Component", () => {
  it("WalletBalanceSummaryInfo render", () => {
    const mockProps = {
      balanceSummaryInfo: {
        amount: "1,000.00",
        changeRate: "+1.10%",
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalanceSummaryInfo {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
