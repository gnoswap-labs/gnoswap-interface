import { StorageClient } from "@common/clients/storage-client";
import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena/adena-client";
import { AccountRepository } from "./account-repository";
import { AccountRepositoryImpl } from "./account-repository-impl";
import { AccountRepositoryMock } from "./account-repository-mock";
import { AxiosClient } from "@common/clients/network-client/axios-client";

let walletClient: WalletClient;
let localStorageClient: StorageClient;
let sessionStorageClient: StorageClient;
let accountRepository: AccountRepository;

const defaultAccountInfo = {
  status: "ACTIVE",
  address: "g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae",
  coins: "1000000000ugnot",
  publicKey: {
    "@type": "----",
    value: "----",
  },
  accountNumber: 1,
  sequence: 1,
  chainId: "test3",
};

beforeEach(() => {
  walletClient = new AdenaClient();
  localStorageClient = new MockStorageClient("LOCAL");
  sessionStorageClient = new MockStorageClient("SESSION");
  accountRepository = new AccountRepositoryImpl(
    walletClient,
    new AxiosClient(),
    localStorageClient,
    sessionStorageClient,
    null,
  );
  jest.clearAllMocks();
});

describe("get account", () => {
  it("success", async () => {
    walletClient.getAccount = jest.fn().mockResolvedValue({
      code: 0,
      status: "success",
      type: "GET_ACCOUNT",
      message: "Get account.",
      data: defaultAccountInfo,
    });

    const account = await accountRepository.getAccount();

    expect(account).toBeTruthy();
    expect(typeof account).toBe("object");
    expect(typeof account?.address).toBe("string");
  });

  it("not connected wallet error", async () => {
    walletClient.getAccount = jest.fn().mockResolvedValue({
      code: 1000,
      status: "failure",
      type: "NOT_CONNECTED",
      message: "Get account.",
      data: null,
    });
    let error: unknown = null;

    try {
      expect(await accountRepository.getAccount()).toThrowError();
    } catch (e) {
      error = e;
    }

    expect(error).toBeTruthy();
    expect(error).toMatchObject({ status: 1000 });
  });
});

describe("get balances", () => {
  it("uses the balances endpoint relative to the API base URL", async () => {
    const get = jest.fn().mockResolvedValue({
      status: 200,
      message: "OK",
      data: {
        message: "Success",
        data: [{ path: "gno.land/r/demo/token", amount: "100" }],
      },
    });
    accountRepository = new AccountRepositoryImpl(
      walletClient,
      { get } as unknown as AxiosClient,
      localStorageClient,
      sessionStorageClient,
      null,
    );

    const balances = await accountRepository.getBalances(defaultAccountInfo.address);

    expect(balances).toEqual([{ path: "gno.land/r/demo/token", amount: "100" }]);
    expect(get).toHaveBeenCalledWith({
      url: `/users/${defaultAccountInfo.address}/balances`,
    });
  });

  it("returns mock balances with the API item shape", async () => {
    const balances = await new AccountRepositoryMock(localStorageClient as StorageClient<unknown>).getBalances();

    expect(balances[0]).toEqual({
      path: "gno.land/r/demo/tong_token",
      amount: "123456",
    });
  });
});

describe("exists wallet", () => {
  it("exists is true", () => {
    walletClient.existsWallet = jest.fn().mockReturnValue(true);

    const response = accountRepository.existsWallet();

    expect(response).toBe(true);
  });

  it("non exists is false", () => {
    walletClient.existsWallet = jest.fn().mockReturnValue(false);

    const response = accountRepository.existsWallet();

    expect(response).toBe(false);
  });
});

describe("add establish site in wallet", () => {
  it("success", async () => {
    walletClient.addEstablishedSite = jest.fn().mockResolvedValue({
      status: "success",
      data: {},
      code: 0,
      message: "The connection has been successfully established.",
      type: "CONNECTION_SUCCESS",
    });

    const response = await accountRepository.addEstablishedSite();

    expect(response).toBeTruthy();
    expect(typeof response.code).toBe("number");
    expect(typeof response.status).toBe("string");
    expect(typeof response.type).toBe("string");
    expect(typeof response.message).toBe("string");
    expect(typeof response.data).toBe("object");
  });
});

describe("add establish site in wallet", () => {
  it("success", async () => {
    walletClient.sendTransaction = jest.fn().mockResolvedValue({
      status: "success",
      data: {},
      code: 0,
      message: "The connection has been successfully established.",
      type: "CONNECTION_SUCCESS",
    });

    const response = await accountRepository.sendTransaction({
      gasFee: 1,
      gasWanted: 1,
      messages: [],
    });

    expect(response).toBeTruthy();
    expect(typeof response.code).toBe("number");
    expect(typeof response.status).toBe("string");
    expect(typeof response.type).toBe("string");
    expect(typeof response.message).toBe("string");
    expect(typeof response.data).toBe("object");
  });
});
