import { isInaccessible, render, screen } from "@testing-library/react";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import { usePositionData } from "@hooks/pool/data/use-position-data";

import WalletPositionCardListContainer from "./WalletPositionCardListContainer";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

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
  const size = { width: 1200, handleBreakpoint: jest.fn() };
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

jest.mock("@query/token", () => {
  const tokenPrices = {};
  return {
    useGetAllTokenPrices: () => ({ data: tokenPrices }),
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
      isPositionDataAvailable: true,
      loading: false,
      positions: [],
      totalPositionCount: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows an empty state when the fetched filter contains no positions", () => {
    render(
      <GnoswapThemeProvider>
        <WalletPositionCardListContainer isClosed={false} />
      </GnoswapThemeProvider>,
    );

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("common:noDataFound");
    expect(isInaccessible(status)).toBe(false);
    const icon = status.querySelector("svg");
    expect(icon).not.toBeNull();
    expect(isInaccessible(icon!)).toBe(true);
    expect(screen.queryByTestId("my-position-card-list")).not.toBeInTheDocument();
  });

  it.each([
    { isPositionDataAvailable: false, loading: true, totalPositionCount: 0 },
    { isPositionDataAvailable: true, loading: true, totalPositionCount: 0 },
    { isPositionDataAvailable: true, loading: false, totalPositionCount: 15 },
  ])("does not show an empty state for unavailable, loading, or nonempty data: %j", positionData => {
    mockUsePositionData.mockReturnValue({ positions: [], ...positionData });

    render(
      <GnoswapThemeProvider>
        <WalletPositionCardListContainer isClosed={true} />
      </GnoswapThemeProvider>,
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByTestId("my-position-card-list")).toBeInTheDocument();
  });
});
