import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";
import React from "react";

import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import { TokenModel } from "@models/token/token-model";
import { PositionRewardsResponse } from "@repositories/position/response";
import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceContainer from "./WalletBalanceContainer";

const getPositionRewardsByAddress = jest.fn();
const getPositionSummaryByAddress = jest.fn();
const claimAll = jest.fn();
const token: TokenModel = {
  path: "gno.land/r/demo/usdc",
  type: "GRC20",
  address: "",
  chainId: "gnoland1",
  name: "USDC",
  symbol: "USDC",
  displaySymbol: "USDC",
  decimals: 6,
  logoURI: "",
  createdAt: "",
  priceID: "USDC",
};
const tokenData = {
  balances: { [token.path]: "100000000" },
  tokens: [token],
  loadingBalance: false,
  isLoadingBalanceData: false,
  hasBalanceData: true,
  hasTokenPriceData: true,
  updateBalances: jest.fn(),
};
const prices = { [token.path]: { pricesBefore: { latestPrice: 1 } } };
const rewards: PositionRewardsResponse = {
  claimed: { swapFee: [], internalReward: [], externalReward: [] },
  claimable: {
    swapFee: [{ tokenPath: token.path, amount: "7000000", usdValue: "7" }],
    internalReward: [],
    externalReward: [],
  },
  totalUsd: {
    claimed: { swapFee: "3", internalReward: "0", externalReward: "0", total: "3" },
    claimable: { swapFee: "7", internalReward: "0", externalReward: "0", total: "7" },
  },
  positionsWithSwapFee: ["1201"],
  positionsWithStakingReward: [],
};
const summary = { stakedUsd: "120", unstakedUsd: "30", stakedCount: 1201, unstakedCount: 2 };

jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ positionRepository: { getPositionRewardsByAddress, getPositionSummaryByAddress } }),
}));
jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({
    connected: true,
    isSwitchNetwork: false,
    loadingConnect: "done",
    account: { address: "g1address" },
    currentChainId: "gnoland1",
    availNetwork: true,
    walletType: { type: "ADENA", socialType: null },
  }),
}));
jest.mock("@hooks/common/use-address", () => ({ useAddress: () => ({ address: "g1address" }) }));
jest.mock("@hooks/common/use-window-size", () => ({
  useWindowSize: () => ({ breakpoint: DEVICE_TYPE.WEB, width: 1200, handleBreakpoint: jest.fn() }),
}));
jest.mock("@hooks/token/data/use-token-data", () => ({ useTokenData: () => tokenData }));
jest.mock("@hooks/pool/data/use-position", () => ({ usePosition: () => ({ claimAll }) }));
jest.mock("@query/positions", () => ({
  useGetPositionRewards: jest.requireActual("@query/positions/use-get-position-rewards").useGetPositionRewards,
  useGetPositionSummary: jest.requireActual("@query/positions/use-get-position-summary").useGetPositionSummary,
}));
jest.mock("@query/token", () => ({ useGetAllTokenPrices: () => ({ data: prices, isLoading: false }) }));
jest.mock("@query/address", () => ({ useGetAvgBlockTime: () => ({ data: { AvgBlockTime: 2 } }) }));
jest.mock("@hooks/common/use-broadcast-handler", () => ({
  useBroadcastHandler: () => ({
    broadcastSuccess: jest.fn(),
    broadcastError: jest.fn(),
    broadcastRejected: jest.fn(),
    broadcastLoading: jest.fn(),
  }),
}));
jest.mock("@hooks/common/use-message", () => ({ useMessage: () => ({ getMessage: jest.fn() }) }));
jest.mock("@hooks/common/use-prevent-scroll", () => ({ usePreventScroll: jest.fn() }));
jest.mock("@hooks/common/use-transaction-confirm-modal", () => ({
  useTransactionConfirmModal: () => ({ openModal: jest.fn() }),
}));
jest.mock("@hooks/common/use-transaction-event-store", () => ({
  useTransactionEventStore: () => ({ enqueueEvent: jest.fn() }),
}));
jest.mock("@hooks/wallet/data/useSendAsset", () => ({
  __esModule: true,
  default: () => ({ isConfirm: false, setIsConfirm: jest.fn(), onSubmit: jest.fn() }),
}));
jest.mock("@components/wallet/asset-receive-modal/AssetReceiveModal", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("../../components/asset-send-modal/AssetSendModal", () => ({ __esModule: true, default: () => null }));
jest.mock("@components/common/header/wallet-connector-button/wallet-connector-menu/WalletConnectorMenu", () => ({
  SocialWalletNotificationTooltip: () => null,
}));
jest.mock(
  "../../components/wallet-balance/wallet-balance-detail/sateked-positions-tooltip/StakedPositinosTooltipContent",
  () => ({ __esModule: true, default: () => null }),
);
jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({ getGnotPath: (value: TokenModel) => value }),
}));
jest.mock("@components/common/tooltip/Tooltip", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderBalance = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchInterval: false, cacheTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalanceContainer />
        </GnoswapThemeProvider>
      </JotaiProvider>
    </QueryClientProvider>,
  );
};

const detailRow = (label: string) => screen.getByText(label).closest(".wallet-detail-left-side")!;

describe("WalletBalanceContainer independent principal and reward requests", () => {
  beforeEach(() => {
    getPositionRewardsByAddress.mockReset();
    getPositionSummaryByAddress.mockReset();
    claimAll.mockReset().mockResolvedValue(null);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it("adds wallet, staked, unstaked and claimable balances from the two independent endpoints", async () => {
    getPositionRewardsByAddress.mockResolvedValue(rewards);
    getPositionSummaryByAddress.mockResolvedValue(summary);
    const { container } = renderBalance();
    await waitFor(() => expect(container.querySelector(".amount")).toHaveTextContent("$257"));
    expect(detailRow("Wallet:overral.stakedPosi.label")).toHaveTextContent("$120");
  });

  it("keeps principal totals visible when the reward request fails, without showing a fake total", async () => {
    getPositionRewardsByAddress.mockRejectedValue(new Error("reward offline"));
    getPositionSummaryByAddress.mockResolvedValue(summary);
    const { container } = renderBalance();
    await waitFor(() => expect(detailRow("Wallet:overral.stakedPosi.label")).toHaveTextContent("$120"));
    await waitFor(() => expect(container.querySelector(".amount")).toHaveTextContent("-"));
    expect(detailRow("Wallet:overral.claimableReward.label").querySelector(".value")).toHaveTextContent("-");
    expect(screen.queryByRole("button", { name: "Wallet:overral.claimAll.btn" })).not.toBeInTheDocument();
  });

  it("keeps rewards claimable when principal fails and passes the complete reward position IDs", async () => {
    getPositionRewardsByAddress.mockResolvedValue(rewards);
    getPositionSummaryByAddress.mockRejectedValue(new Error("summary offline"));
    const { container } = renderBalance();
    const button = await screen.findByRole("button", { name: "Wallet:overral.claimAll.btn" });
    expect(button).toBeEnabled();
    expect(detailRow("Wallet:overral.claimableReward.label")).toHaveTextContent("$7");
    await waitFor(() => expect(container.querySelector(".amount")).toHaveTextContent("-"));
    expect(detailRow("Wallet:overral.stakedPosi.label").querySelector(".value")).toHaveTextContent("-");
    fireEvent.click(button);
    expect(claimAll).toHaveBeenCalledWith({
      input: {
        swapFeeTokenPaths: [token.path],
        hasGnotStakingReward: false,
        positionsWithSwapFee: ["1201"],
        positionsWithStakingReward: [],
      },
    });
  });

  it("starts both requests together and does not let pending principal hide loaded rewards", async () => {
    let resolveSummary!: (value: typeof summary) => void;
    const promise = new Promise<typeof summary>(resolve => {
      resolveSummary = resolve;
    });
    getPositionSummaryByAddress.mockReturnValue(promise);
    getPositionRewardsByAddress.mockResolvedValue(rewards);
    const { container } = renderBalance();
    const button = await screen.findByRole("button", { name: "Wallet:overral.claimAll.btn" });
    expect(button).toBeEnabled();
    expect(getPositionRewardsByAddress).toHaveBeenCalledTimes(1);
    expect(getPositionSummaryByAddress).toHaveBeenCalledTimes(1);
    expect(detailRow("Wallet:overral.stakedPosi.label").querySelector(".loading")).not.toBeNull();
    expect(container.querySelector(".loading-wrapper")).not.toBeNull();
    await act(async () => {
      resolveSummary(summary);
    });
    await waitFor(() => expect(container.querySelector(".amount")).toHaveTextContent("$257"));
  });

  it("shows loaded principal while rewards are still pending and leaves the combined total loading", async () => {
    let resolve!: (value: PositionRewardsResponse) => void;
    const promise = new Promise<PositionRewardsResponse>(resolveReward => {
      resolve = resolveReward;
    });
    getPositionRewardsByAddress.mockReturnValue(promise);
    getPositionSummaryByAddress.mockResolvedValue(summary);
    const { container } = renderBalance();
    await waitFor(() => expect(detailRow("Wallet:overral.stakedPosi.label")).toHaveTextContent("$120"));
    expect(detailRow("Wallet:overral.claimableReward.label").querySelector(".loading")).not.toBeNull();
    expect(container.querySelector(".loading-wrapper")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Wallet:overral.claimAll.btn" })).not.toBeInTheDocument();
    await act(async () => {
      resolve(rewards);
    });
    await waitFor(() => expect(container.querySelector(".amount")).toHaveTextContent("$257"));
  });
});
