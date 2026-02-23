import { renderHook } from "@testing-library/react";

import { usePositionData } from "@hooks/pool/data/use-position-data";

const mockUseGetPositionsByAddress = jest.fn();
const mockUseMakePoolPositions = jest.fn();

jest.mock("@hooks/wallet/data/use-wallet", () => ({
  useWallet: () => ({
    account: null,
    connected: false,
  }),
}));

jest.mock("@hooks/pool/data/use-pool-data", () => ({
  usePoolData: () => ({
    pools: [],
    loading: false,
  }),
}));

jest.mock("@hooks/common/use-loading", () => ({
  useLoading: () => ({
    isLoading: false,
  }),
}));

jest.mock("@query/positions", () => ({
  useGetPositionsByAddress: (...args: unknown[]) => mockUseGetPositionsByAddress(...args),
  useMakePoolPositions: (...args: unknown[]) => mockUseMakePoolPositions(...args),
}));

describe("usePositionData", () => {
  beforeEach(() => {
    mockUseGetPositionsByAddress.mockReturnValue({
      data: { positions: [], totalCount: 0 },
      refetch: jest.fn(),
      isError: false,
      isFetched: true,
      isLoading: false,
    });
    mockUseMakePoolPositions.mockReturnValue({
      data: [],
      isFetched: true,
      isLoading: false,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passes query options to useGetPositionsByAddress", () => {
    renderHook(() => usePositionData({ queryOption: { enabled: false } }));

    expect(mockUseGetPositionsByAddress).toHaveBeenCalledTimes(1);
    expect(mockUseGetPositionsByAddress.mock.calls[0][1]).toMatchObject({
      enabled: false,
    });
  });

  it("disables query when no address is available", () => {
    renderHook(() => usePositionData());

    expect(mockUseGetPositionsByAddress).toHaveBeenCalledTimes(1);
    expect(mockUseGetPositionsByAddress.mock.calls[0][1]).toMatchObject({
      enabled: false,
    });
  });
});
