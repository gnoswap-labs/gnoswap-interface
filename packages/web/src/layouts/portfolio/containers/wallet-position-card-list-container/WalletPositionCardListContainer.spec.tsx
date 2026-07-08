import { act, render } from "@testing-library/react";

import { usePositionData } from "@hooks/pool/data/use-position-data";

import WalletPositionCardListContainer from "./WalletPositionCardListContainer";

jest.mock("jotai", () => ({
  ...jest.requireActual("jotai"),
  useAtomValue: () => "light",
}));

const mockMyPositionCardList = jest.fn(() => <div data-testid="my-position-card-list" />);

jest.mock("@components/common/my-position-card-list/MyPositionCardList", () => ({
  __esModule: true,
  default: (props: unknown) => mockMyPositionCardList(props),
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

const openPositionData = {
  availableStake: false,
  isError: false,
  positions: [],
  totalPositionCount: 0,
  refetch: jest.fn(),
  checkStakedPool: jest.fn(),
  getPositions: jest.fn(() => []),
  isFetchedPosition: true,
  loading: false,
  isLoadingPool: false,
};

describe("WalletPositionCardListContainer", () => {
  beforeEach(() => {
    mockUsePositionData.mockReturnValue(openPositionData);
    mockMyPositionCardList.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("reuses the shared open position data instead of fetching open positions again", () => {
    render(<WalletPositionCardListContainer isClosed={false} openPositionData={openPositionData} />);

    expect(mockUsePositionData).toHaveBeenCalledWith(
      expect.objectContaining({
        withClosed: false,
        page: 1,
        queryOption: expect.objectContaining({ enabled: false }),
      }),
    );
  });

  it("requests open and closed positions when closed positions are shown", () => {
    render(<WalletPositionCardListContainer isClosed={true} openPositionData={openPositionData} />);

    expect(mockUsePositionData).toHaveBeenCalledWith(
      expect.objectContaining({
        withClosed: true,
        page: 1,
        queryOption: expect.objectContaining({ enabled: true }),
      }),
    );
  });

  it("fetches a paginated open position page after leaving the shared first page", () => {
    render(<WalletPositionCardListContainer isClosed={false} openPositionData={openPositionData} />);

    const lastProps = mockMyPositionCardList.mock.calls.at(-1)?.[0] as { movePage: (page: number) => void };

    act(() => {
      lastProps.movePage(2);
    });

    expect(mockUsePositionData).toHaveBeenLastCalledWith(
      expect.objectContaining({
        withClosed: false,
        page: 2,
        queryOption: expect.objectContaining({ enabled: true }),
      }),
    );
  });
});
