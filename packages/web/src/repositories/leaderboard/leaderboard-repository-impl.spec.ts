import { NetworkClient } from "@common/clients/network-client";
import { WalletClient } from "@common/clients/wallet-client";
import { SignedArbitraryData, WalletResponse } from "@common/clients/wallet-client/protocols";
import { CommonError } from "@common/errors";

import {
  LEADERBOARD_SET_HIDDEN_ACTION,
  LeaderboardRepositoryImpl,
  makeLeaderboardHiddenStateMessage,
} from "./leaderboard-repository-impl";
import { nullLeaderboardInfo } from "./response";

const ADDRESS = "g1jg8mtutu9khhfwc4nxmuhcpftf0pajdhfvsqf5";

const PROOF: SignedArbitraryData = {
  signed: {
    chain_id: "dev.gnoswap",
    account_number: "0",
    sequence: "0",
    fee: { amount: [], gas: "0" },
    msgs: [{ type: "sign/MsgSignData", value: { signer: ADDRESS, data: "e30=" } }],
    memo: "",
  },
  signature: {
    pubKey: { typeUrl: "/tm.PubKeySecp256k1", value: "A+FhNtsXHjLfSJk1lB8FbiL4mGPjc50Kt81J7EKDnJ2y" },
    signature: "AQ==",
  },
};

const signResponse = (overrides: Partial<WalletResponse<SignedArbitraryData>> = {}) => ({
  code: 0,
  status: "success",
  type: "SIGN_ARBITRARY",
  message: "",
  data: PROOF,
  ...overrides,
});

const setup = () => {
  const networkClient = { put: jest.fn() } as unknown as jest.Mocked<NetworkClient>;
  const walletClient = { signArbitrary: jest.fn() } as unknown as jest.Mocked<WalletClient>;

  return { networkClient, walletClient, repository: new LeaderboardRepositoryImpl(networkClient, walletClient) };
};

describe("makeLeaderboardHiddenStateMessage", () => {
  it("builds the JSON payload the API verifies, with a unix-second timestamp", () => {
    const message = makeLeaderboardHiddenStateMessage(ADDRESS, true, new Date(1760518800999));

    expect(JSON.parse(message)).toEqual({
      action: LEADERBOARD_SET_HIDDEN_ACTION,
      address: ADDRESS,
      hidden: true,
      issuedTimestamp: 1760518800,
    });
  });
});

describe("LeaderboardRepositoryImpl.updateLeaderboardHiddenState", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(1760518800000));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("signs the hidden-state payload and sends only the proof", async () => {
    const { networkClient, walletClient, repository } = setup();
    walletClient.signArbitrary.mockResolvedValue(signResponse());
    networkClient.put.mockResolvedValue({ data: { data: { success: true } } } as never);

    const response = await repository.updateLeaderboardHiddenState({ address: ADDRESS, request: { hidden: true } });

    expect(walletClient.signArbitrary).toHaveBeenCalledWith({
      signer: ADDRESS,
      data: makeLeaderboardHiddenStateMessage(ADDRESS, true, new Date(1760518800000)),
    });
    expect(networkClient.put).toHaveBeenCalledWith({
      url: `/leaderboard/${ADDRESS}`,
      body: { proof: PROOF },
    });
    expect(response).toEqual({ success: true });
  });

  it.each([
    ["rejected by the user", signResponse({ code: 4000, status: "failure", type: "SIGN_REJECTED", data: null })],
    [
      "unsupported by the extension",
      signResponse({ code: 4005, status: "failure", type: "UNSUPPORTED_TYPE", data: null }),
    ],
  ])("does not call the API when signing is %s", async (_, response) => {
    const { networkClient, walletClient, repository } = setup();
    walletClient.signArbitrary.mockResolvedValue(response);

    await expect(
      repository.updateLeaderboardHiddenState({ address: ADDRESS, request: { hidden: false } }),
    ).rejects.toBeInstanceOf(CommonError);
    expect(networkClient.put).not.toHaveBeenCalled();
  });

  it("requires a wallet client", async () => {
    const networkClient = { put: jest.fn() } as unknown as NetworkClient;
    const repository = new LeaderboardRepositoryImpl(networkClient, null);

    await expect(
      repository.updateLeaderboardHiddenState({ address: ADDRESS, request: { hidden: true } }),
    ).rejects.toBeInstanceOf(CommonError);
  });
});

const createRepository = (get: jest.Mock) => new LeaderboardRepositoryImpl({ get } as unknown as NetworkClient, null);

const createHttpError = (status: number) =>
  Object.assign(new Error(`request failed with status ${status}`), {
    isAxiosError: true,
    response: { status },
  });

describe("LeaderboardRepositoryImpl", () => {
  describe("getLeaderboard", () => {
    it("reads the most recent started round when no round is given", async () => {
      const get = jest.fn().mockResolvedValue({ data: { data: nullLeaderboardInfo } });

      await createRepository(get).getLeaderboard({ page: 1, limit: 100 });

      expect(get).toHaveBeenCalledWith({ url: "/leaderboard/rounds/users?limit=100&page=1" });
    });

    it("passes the requested round", async () => {
      const get = jest.fn().mockResolvedValue({ data: { data: nullLeaderboardInfo } });

      await createRepository(get).getLeaderboard({ roundId: 2, page: 1, limit: 10 });

      expect(get).toHaveBeenCalledWith({ url: "/leaderboard/rounds/users?roundId=2&limit=10&page=1" });
    });

    it("returns the empty leaderboard when no round has started (404)", async () => {
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
    it("reads the account in the most recent started round", async () => {
      const get = jest.fn().mockResolvedValue({ data: { data: { user: null } } });

      await createRepository(get).getLeaderboardByAddress("g1alice");

      expect(get).toHaveBeenCalledWith({ url: "/leaderboard/rounds/users/g1alice" });
    });

    it("passes the requested round", async () => {
      const get = jest.fn().mockResolvedValue({ data: { data: { user: null } } });

      await createRepository(get).getLeaderboardByAddress("g1alice", 3);

      expect(get).toHaveBeenCalledWith({ url: "/leaderboard/rounds/users/g1alice?roundId=3" });
    });

    it("returns null when no round has started (404)", async () => {
      const repository = createRepository(jest.fn().mockRejectedValue(createHttpError(404)));

      await expect(repository.getLeaderboardByAddress("g1alice")).resolves.toBeNull();
    });
  });
});
