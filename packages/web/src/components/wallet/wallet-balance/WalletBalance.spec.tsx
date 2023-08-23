import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalance from "./WalletBalance";
import { DEVICE_TYPE } from "@styles/media";

describe("WalletBalance Component", () => {
  it("WalletBalance render", () => {
    const mockProps = {
      connected: true,
      balanceSummaryInfo: {
        amount: "$1,000.00",
        changeRate: "+1.1%",
      },
      balanceDetailInfo: {
        availableBalance: "1.10%",
        stakedLP: "1.20%",
        unstakingLP: "1.30%",
        claimableRewards: "1.40%",
      },
      deposit: () => null,
      withdraw: () => null,
      claimAll: () => null,
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalance {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
