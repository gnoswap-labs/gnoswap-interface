import { StorageClient } from "@common/clients/storage-client";
import { MockStorageClient } from "@common/clients/storage-client/mock-storage-client";
import { WalletClient } from "@common/clients/wallet-client";
import { AdenaClient } from "@common/clients/wallet-client/adena-client";
import { AdenaError } from "@common/errors/adena";
import { AccountRepository } from "./account-repository";
import { AccountRepositoryInstance } from "./account-repository-instance";

let walletClient: WalletClient;
let localStorageClient: StorageClient;
let accountRepository: AccountRepository;

const defaultAccountInfo = {
  status: "ACTIVE",
  address: "g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae",
  coins: "1000000000ugnot",
  publicKey: {
    "@type": "----",
    value: "----",
  },
  accountNumber: "1",
  sequence: "1",
  chainId: "test3",
};

beforeEach(() => {
  walletClient = new AdenaClient();
  localStorageClient = new MockStorageClient("LOCAL");
  accountRepository = new AccountRepositoryInstance(
    walletClient,
    localStorageClient,
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

    const response = await accountRepository.getAccount();

    expect(response).toBeTruthy();
    expect(typeof response.code).toBe("number");
    expect(typeof response.status).toBe("string");
    expect(typeof response.type).toBe("string");
    expect(typeof response.message).toBe("string");
    expect(typeof response.data).toBe("object");
    expect(typeof response.data.address).toBe("string");
  });

  it("not connected wallet error", async () => {
    walletClient.getAccount = jest.fn().mockResolvedValue({
      code: 1000,
      status: "failure",
      type: "NOT_CONNECTED",
      message: "Get account.",
      data: null,
    });
    let error: any = null;

    try {
      expect(await accountRepository.getAccount()).toThrowError();
    } catch (e) {
      error = e;
    }

    expect(error).toBeTruthy();
    expect(error?.status).toBe(1000);
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
