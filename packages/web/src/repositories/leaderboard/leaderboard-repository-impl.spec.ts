import { NetworkClient } from "@common/clients/network-client";

import { LeaderboardRepositoryImpl } from "./leaderboard-repository-impl";
import { nullLeaderboardInfo } from "./response";

const createRepository = (get: jest.Mock) => new LeaderboardRepositoryImpl({ get } as unknown as NetworkClient);

const createHttpError = (status: number) =>
  Object.assign(new Error(`request failed with status ${status}`), {
    isAxiosError: true,
    response: { status },
  });

describe("LeaderboardRepositoryImpl", () => {
  describe("getLeaderboard", () => {
    it("reads the current active round when no round is given", async () => {
      const get = jest.fn().mockResolvedValue({ data: { data: nullLeaderboardInfo } });

      await createRepository(get).getLeaderboard({ page: 1, limit: 100 });

      expect(get).toHaveBeenCalledWith({ url: "/leaderboard/rounds/users?limit=100&page=1" });
    });

    it("passes the requested round", async () => {
      const get = jest.fn().mockResolvedValue({ data: { data: nullLeaderboardInfo } });

      await createRepository(get).getLeaderboard({ roundId: 2, page: 1, limit: 10 });

      expect(get).toHaveBeenCalledWith({ url: "/leaderboard/rounds/users?roundId=2&limit=10&page=1" });
    });

    it("returns the empty leaderboard when there is no active round (404)", async () => {
      const repository = createRepository(jest.fn().mockRejectedValue(createHttpError(404)));

      await expect(repository.getLeaderboard({ page: 1, limit: 10 })).resolves.toEqual(nullLeaderboardInfo);
    });

    it("rejects on other failures", async () => {
      const error = createHttpError(500);
      const repository = createRepository(jest.fn().mockRejectedValue(error));

      await expect(repository.getLeaderboard({ page: 1, limit: 10 })).rejects.toThrow(error);
    });
  });

  describe("getLeaderboardByAddress", () => {
    it("reads the account in the current active round", async () => {
      const get = jest.fn().mockResolvedValue({ data: { data: { user: null } } });

      await createRepository(get).getLeaderboardByAddress("g1alice");

      expect(get).toHaveBeenCalledWith({ url: "/leaderboard/rounds/users/g1alice" });
    });

    it("passes the requested round", async () => {
      const get = jest.fn().mockResolvedValue({ data: { data: { user: null } } });

      await createRepository(get).getLeaderboardByAddress("g1alice", 3);

      expect(get).toHaveBeenCalledWith({ url: "/leaderboard/rounds/users/g1alice?roundId=3" });
    });

    it("returns null when there is no active round (404)", async () => {
      const repository = createRepository(jest.fn().mockRejectedValue(createHttpError(404)));

      await expect(repository.getLeaderboardByAddress("g1alice")).resolves.toBeNull();
    });
  });
});
