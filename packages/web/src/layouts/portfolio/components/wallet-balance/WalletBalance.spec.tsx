import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import WalletBalance from "./WalletBalance";
import { DEVICE_TYPE } from "@styles/media";
import { WalletType } from "src/types/wallet.types";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionsByAddress: jest.fn() } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({ account: { address: "wallet-a" }, currentChainId: "chain-a", availNetwork: true }),
}));

describe("WalletBalance Component", () => {
  it("WalletBalance render", () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, cacheTime: 0 } } });
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
        loadingRewards: false,
        totalClaimedRewards: "0",
      },
      isSwitchNetwork: false,
      loadngTransactionClaim: false,
      positionRewards: null,
      positionSummary: null,
      tokens: [],
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
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <GnoswapThemeProvider>
            <WalletBalance {...mockProps} />
          </GnoswapThemeProvider>
        </JotaiProvider>
      </QueryClientProvider>,
    );
  });
});
