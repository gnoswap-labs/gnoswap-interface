import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceDetail, { WalletBalanceDetailProps } from "./WalletBalanceDetail";

describe("WalletBalanceDetail Component", () => {
  it("WalletBalanceDetail render", () => {
    const mockProps: WalletBalanceDetailProps = {
      balanceDetailInfo: {
        availableBalance: "324,324.34",
        stakedLP: "$2,453,251.20",
        unstakedLP: "$132,423.34",
        claimableRewards: "$1213.23",
        loadingBalance: false,
        loadingPositions: false,
        totalClaimedRewards: "$1213.23",
      },
      connected: true,
      claimAll: () => {
        return;
      },
      breakpoint: DEVICE_TYPE.WEB,
      isSwitchNetwork: false,
      loadngTransactionClaim: false,
      positions: [],
      tokenPrices: {}
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
