import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider } from "jotai";

import type { TokenModel } from "@models/token/token-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";
import type { PositionRewardsResponse } from "@repositories/position/response";
import { DEVICE_TYPE } from "@styles/media";

import WalletBalanceDetail, { type WalletBalanceDetailProps } from "./WalletBalanceDetail";

// Mock @adena-wallet/sdk
jest.mock("@adena-wallet/sdk", () => ({
  makeMsgCallMessage: jest.fn(),
  makeMsgSendMessage: jest.fn(),
  TransactionBuilder: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@components/common/tooltip/Tooltip", () => ({
  __esModule: true,
  default: ({
    children,
    FloatingContent,
    forcedClose,
  }: {
    children: ReactNode;
    FloatingContent?: ReactNode;
    forcedClose?: boolean;
  }) => (
    <>
      {children}
      {!forcedClose && FloatingContent}
    </>
  ),
}));

jest.mock("@hooks/token/data/use-gnot-wugnot", () => ({
  useGnotToGnot: () => ({
    getGnotPath: (token: TokenModel) => token,
  }),
}));

describe("WalletBalanceDetail Component", () => {
  const usdcToken: TokenModel = {
    path: "gno.land/r/demo/usdc",
    tokenId: "gno.land/r/demo/usdc.USDC",
    type: "GRC20",
    address: "",
    chainId: "test-chain",
    name: "USDC",
    symbol: "USDC",
    displaySymbol: "USDC",
    decimals: 6,
    logoURI: "",
    createdAt: "",
    priceID: "USDC",
  };

  const atomToken: TokenModel = {
    path: "gno.land/r/demo/atom",
    tokenId: "gno.land/r/demo/atom.ATOM",
    type: "GRC20",
    address: "",
    chainId: "test-chain",
    name: "ATOM",
    symbol: "ATOM",
    displaySymbol: "ATOM",
    decimals: 18,
    logoURI: "",
    createdAt: "",
    priceID: "ATOM",
  };

  const baseProps: WalletBalanceDetailProps = {
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
    positionRewards: null,
    tokens: [],
    tokenPrices: {},
  };

  const renderWalletBalanceDetail = (props: Partial<WalletBalanceDetailProps> = {}) => {
    return render(
      <JotaiProvider>
        <GnoswapThemeProvider>
          <WalletBalanceDetail {...baseProps} {...props} />
        </GnoswapThemeProvider>
      </JotaiProvider>,
    );
  };

  it("WalletBalanceDetail render", () => {
    renderWalletBalanceDetail();
  });

  it("applies token decimals to claimed and claimable reward popup amounts", () => {
    const positionRewards: PositionRewardsResponse = {
      claimed: {
        swapFee: [
          { tokenPath: usdcToken.path, amount: "123456789", usdValue: "10" },
          { tokenPath: atomToken.path, amount: "1230000000000000000", usdValue: "2" },
        ],
        internalReward: [],
        externalReward: [],
      },
      claimable: {
        swapFee: [],
        internalReward: [{ tokenPath: usdcToken.path, amount: "7654321", usdValue: "3" }],
        externalReward: [],
      },
      totalUsd: {
        claimed: {
          swapFee: "12",
          internalReward: "0",
          externalReward: "0",
          total: "12",
        },
        claimable: {
          swapFee: "0",
          internalReward: "3",
          externalReward: "0",
          total: "3",
        },
      },
      positionsWithSwapFee: [],
      positionsWithStakingReward: [],
    };

    renderWalletBalanceDetail({
      positionRewards,
      tokens: [usdcToken, atomToken],
    });

    expect(screen.getByText("123.456789")).toBeInTheDocument();
    expect(screen.getByText("1.23")).toBeInTheDocument();
    expect(screen.getByText("7.654321")).toBeInTheDocument();
  });
});
