import { NetworkClient } from "@common/clients/network-client";
import { PositionRepositoryImpl } from "./position-repository-impl";

describe("PositionRepositoryImpl", () => {
  it("uses withClosed without sending the legacy closed query", async () => {
    const get = jest.fn().mockResolvedValue({
      status: 200,
      message: "OK",
      data: { data: { positions: [], totalCount: 0 } },
    });
    const repository = new PositionRepositoryImpl({ get } as unknown as NetworkClient, null, null);

    const result = await repository.getPositionsByAddress("g1address", {
      poolPath: "gno.land%2Fr%2Fpool",
      page: 2,
      limit: 10,
      withClosed: false,
      withAvailableStake: true,
    });

    expect(result).toEqual({ positions: [], totalCount: 0 });
    expect(get).toHaveBeenCalledWith({
      url: "/users/g1address/position?poolPath=gno.land%2Fr%2Fpool&page=2&limit=10&withClosed=false&withAvailableStake=true",
    });
  });

  it("rejects a successful response without position data instead of reporting no positions", async () => {
    const get = jest.fn().mockResolvedValue({ status: 200, message: "OK", data: {} });
    const repository = new PositionRepositoryImpl({ get } as unknown as NetworkClient, null, null);

    await expect(repository.getPositionsByAddress("g1address")).rejects.toThrow("Invalid position list response");
  });

  it("sends stakedOnly when requested", async () => {
    const get = jest.fn().mockResolvedValue({
      status: 200,
      message: "OK",
      data: { data: { positions: [], totalCount: 0 } },
    });
    const repository = new PositionRepositoryImpl({ get } as unknown as NetworkClient, null, null);

    await repository.getPositionsByAddress("g1address", { poolPath: "gno.land%2Fr%2Fpool", stakedOnly: true });

    expect(get).toHaveBeenCalledWith({
      url: "/users/g1address/position?poolPath=gno.land%2Fr%2Fpool&stakedOnly=true",
    });
  });

  describe("getAllPositionsByAddress", () => {
    const createRepository = (pageSizes: number[], totalCount: number) => {
      const getPositionsByAddress = jest.fn();
      pageSizes.forEach(size => {
        getPositionsByAddress.mockResolvedValueOnce({
          positions: Array.from({ length: size }, (_, index) => ({ id: `${index}` })),
          totalCount,
        });
      });
      const repository = new PositionRepositoryImpl(null, null, null);
      repository.getPositionsByAddress = getPositionsByAddress;
      return { repository, getPositionsByAddress };
    };

    it("fetches pages until every position is loaded", async () => {
      const { repository, getPositionsByAddress } = createRepository([50, 50, 3], 103);

      const result = await repository.getAllPositionsByAddress("g1address", { poolPath: "pool", stakedOnly: true });

      expect(result.positions).toHaveLength(103);
      expect(result.totalCount).toBe(103);
      expect(getPositionsByAddress).toHaveBeenCalledTimes(3);
      expect(getPositionsByAddress).toHaveBeenNthCalledWith(3, "g1address", {
        poolPath: "pool",
        stakedOnly: true,
        page: 3,
        limit: 50,
      });
    });

    it("stops when a page is not full even if totalCount is larger", async () => {
      const { repository, getPositionsByAddress } = createRepository([50, 10], 200);

      const result = await repository.getAllPositionsByAddress("g1address");

      expect(result.positions).toHaveLength(60);
      expect(getPositionsByAddress).toHaveBeenCalledTimes(2);
    });

    it("stops after the last page when totalCount is an exact multiple of the page size", async () => {
      const { repository, getPositionsByAddress } = createRepository([50, 50], 100);

      const result = await repository.getAllPositionsByAddress("g1address");

      expect(result.positions).toHaveLength(100);
      expect(getPositionsByAddress).toHaveBeenCalledTimes(2);
    });
  });
});
