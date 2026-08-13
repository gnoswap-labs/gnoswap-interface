import { render, screen } from "@testing-library/react";

import { useLoading } from "@hooks/common/use-loading";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useMakePoolPositions, useGetPositionsByAddress } from "@query/positions";
import { usePoolData } from "./use-pool-data";
import { usePositionData } from "./use-position-data";

jest.mock("@hooks/common/use-loading", () => ({
  useLoading: jest.fn(),
}));

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: jest.fn(),
}));

jest.mock("@query/positions", () => ({
  useGetPositionsByAddress: jest.fn(),
  useMakePoolPositions: jest.fn(),
}));

jest.mock("./use-pool-data", () => ({
  usePoolData: jest.fn(),
}));

const mockUseLoading = useLoading as jest.Mock;
const mockUseWallet = useWallet as jest.Mock;
const mockUseGetPositionsByAddress = useGetPositionsByAddress as jest.Mock;
const mockUseMakePoolPositions = useMakePoolPositions as jest.Mock;
const mockUsePoolData = usePoolData as jest.Mock;

const previousPositions = [{ id: 1 }];

const PositionDataProbe = () => {
  const { isFetchedPosition, isPositionDataAvailable, positions, totalPositionCount } = usePositionData({
    withClosed: true,
  });

  return (
    <div>
      <span data-testid="is-fetched">{String(isFetchedPosition)}</span>
      <span data-testid="is-data-available">{String(isPositionDataAvailable)}</span>
      <span data-testid="position-count">{String(totalPositionCount)}</span>
      <span data-testid="mapped-position-count">{String(positions.length)}</span>
    </div>
  );
};

describe("usePositionData", () => {
  beforeEach(() => {
    mockUseLoading.mockReturnValue({ isLoading: false });
    mockUseWallet.mockReturnValue({ account: { address: "g1address" }, connected: true });
    mockUsePoolData.mockReturnValue({ pools: [], loading: false, isFetchedPools: true });
    mockUseGetPositionsByAddress.mockReturnValue({
      data: { positions: previousPositions, totalCount: 43 },
      isFetched: false,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    mockUseMakePoolPositions.mockImplementation(
      (positions: unknown[] | undefined, _pools: unknown[], isFetchedPosition: boolean, isFetchedPools: boolean) => {
        const isFetched = isFetchedPosition && isFetchedPools;
        return {
          data: isFetched ? positions ?? [] : [],
          isFetched,
          isLoading: !isFetched,
        };
      },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("keeps previous positions available while a filtered query is transitioning", () => {
    render(<PositionDataProbe />);

    expect(screen.getByTestId("is-fetched")).toHaveTextContent("false");
    expect(screen.getByTestId("is-data-available")).toHaveTextContent("true");
    expect(screen.getByTestId("position-count")).toHaveTextContent("43");
    expect(screen.getByTestId("mapped-position-count")).toHaveTextContent("1");
    expect(mockUseMakePoolPositions).toHaveBeenCalledWith(previousPositions, [], true, true, "");
  });
});
