import { render } from "@testing-library/react";

import { usePositionData } from "@hooks/pool/data/use-position-data";

import WalletPositionCardListContainer from "./WalletPositionCardListContainer";

jest.mock("jotai", () => ({
  ...jest.requireActual("jotai"),
  useAtomValue: () => "light",
}));

jest.mock("@components/common/my-position-card-list/MyPositionCardList", () => ({
  __esModule: true,
  default: () => <div data-testid="my-position-card-list" />,
}));

jest.mock("@hooks/common/use-custom-router", () => ({
  __esModule: true,
  default: () => ({
    getPoolPath: jest.fn(),
    movePageWithPoolPath: jest.fn(),
  }),
}));

jest.mock("@hooks/common/use-window-size", () => {
  const size = { width: 1200 };
  return {
    useWindowSize: () => size,
  };
});

jest.mock("@hooks/pool/data/use-pool-data", () => {
  const pools: unknown[] = [];
  return {
    usePoolData: () => ({ pools, loading: false }),
  };
});

jest.mock("@hooks/pool/data/use-position-data", () => ({
  usePositionData: jest.fn(),
}));

jest.mock("@hooks/token/data/use-gnot-wugnot", () => {
  const getGnotPath = (token: unknown) => token;
  return {
    useGnotToGnot: () => ({ getGnotPath }),
  };
});

jest.mock("@hooks/token/data/use-token-data", () => {
  const tokenPrices = {};
  return {
    useTokenData: () => ({ tokenPrices }),
  };
});

jest.mock("@hooks/wallet/data/use-wallet", () => {
  const wallet = { connected: true };
  return {
    useWallet: () => wallet,
  };
});

jest.mock("@services/converters/position", () => ({
  PositionConverter: {
    convertPositions: jest.fn(positions => positions),
  },
}));

const mockUsePositionData = usePositionData as jest.Mock;

describe("WalletPositionCardListContainer", () => {
  beforeEach(() => {
    mockUsePositionData.mockReturnValue({
      isFetchedPosition: true,
      loading: false,
      positions: [],
      totalPositionCount: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("requests only open positions when closed positions are hidden", () => {
    render(<WalletPositionCardListContainer isClosed={false} />);

    expect(mockUsePositionData).toHaveBeenCalledWith(
      expect.objectContaining({
        withClosed: false,
        page: 1,
      }),
    );
  });

  it("requests open and closed positions when closed positions are shown", () => {
    render(<WalletPositionCardListContainer isClosed={true} />);

    expect(mockUsePositionData).toHaveBeenCalledWith(
      expect.objectContaining({
        withClosed: true,
        page: 1,
      }),
    );
  });
});
