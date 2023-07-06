import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalanceDetail from "./WalletBalanceDetail";

describe("WalletBalanceDetail Component", () => {
  it("WalletBalanceDetail render", () => {
    const mockProps = {
      balanceDetailInfo: {
        availableBalance: "1.10%",
        stakedLP: "1.20%",
        unstakingLP: "1.30%",
        claimableRewards: "1.40%",
      },
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalanceDetail {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
