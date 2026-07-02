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
});
