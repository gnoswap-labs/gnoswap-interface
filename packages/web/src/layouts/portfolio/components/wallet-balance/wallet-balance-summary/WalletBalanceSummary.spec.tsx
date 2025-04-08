import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalanceSummary from "./WalletBalanceSummary";
import { DEVICE_TYPE } from "@styles/media";
import { WalletType } from "src/types/wallet.types";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

describe("WalletBalanceSummary Component", () => {
  it("WalletBalanceSummary render", () => {
    const mockProps = {
      connected: true,
      balanceSummaryInfo: {
        amount: "$1,000.00",
        changeRate: "+1.1%",
        loading: false,
      },
      balanceDetailInfo: {
        availableBalance: "1.10%",
        stakedLP: "1.20%",
        unstakedLP: "1.30%",
        claimableRewards: "1.40%",
        loadingBalance: false,
        loadingPositions: false,
        totalClaimedRewards: "0",
      },
      isSwitchNetwork: false,
      loadngTransactionClaim: false,
      positions: [],
      tokenPrices: {},
      walletType: {
        type: "ADENA" as WalletType,
        socialType: null,
      },

      deposit: () => null,
      withdraw: () => null,
      claimAll: () => null,
      breakpoint: DEVICE_TYPE.WEB,
    };

    render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalanceSummary {...mockProps} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  });
});
