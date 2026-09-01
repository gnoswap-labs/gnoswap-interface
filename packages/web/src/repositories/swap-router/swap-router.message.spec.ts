import {
  getRunMessageBody,
  makeExpectedApproveRunMessage,
} from "@common/clients/wallet-client/transaction-messages/run.test-fixtures";
import type { TransactionMessage } from "@common/clients/wallet-client/transaction-messages/common";
import type { EstimatedRoute } from "@models/swap/swap-route-info";
import type { TokenModel } from "@models/token/token-model";

jest.mock("@constants/environment.constant", () => ({
  PACKAGE_GRC20_REGISTRY_PATH: "grc20reg_path",
  PACKAGE_ROUTER_ADDRESS: "router_address",
  PACKAGE_ROUTER_PATH: "router_path",
  WRAPPED_GNOT_PATH: "wugnot",
  WRAPPED_GNOT_PACKAGE_PATH: "wugnot",
}));

import {
  makeExactInSwapRouteMessageWithApproves,
  makeExactOutSwapRouteMessageWithApproves,
} from "@repositories/swap-router/swap-router.message";

const createTokenModel = (path: string, overrides?: Partial<TokenModel>): TokenModel => ({
  path,
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2024-01-24T15:12:21Z",
  name: path,
  symbol: path,
  displaySymbol: path,
  decimals: 6,
  logoURI: "",
  priceID: path,
  ...overrides,
});

const route: EstimatedRoute = {
  quote: 1,
  amountIn: 1_000_000n,
  amountOut: 2_000_000n,
  pools: [
    {
      tokenA: "token_in",
      tokenB: "token_out",
      fee: 3000,
      price: 1,
      tokenABalance: 0,
      tokenBBalance: 0,
      poolPath: "pool_path",
    },
  ],
};

const splitMessages = (messages: TransactionMessage[], approveCount: number) => ({
  approveMessages: messages.slice(0, approveCount),
  txMessages: messages.slice(approveCount, messages.length - approveCount),
  resetMessages: messages.slice(messages.length - approveCount),
});

describe("swap-router.message.ts", () => {
  it("approves only input token for exact-in swaps using exact input amount", async () => {
    const caller = "caller";
    const inputToken = createTokenModel("token_in");
    const outputToken = createTokenModel("token_out");
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeExactInSwapRouteMessageWithApproves(
      {
        inputToken,
        outputToken,
        tokenAmount: 1.25,
        estimatedRoutes: [route],
        tokenAmountLimit: 2,
        deadline: 123,
        caller,
        referrerAddress: null,
      },
      fetchAllowance,
    );

    const { approveMessages, txMessages, resetMessages } = splitMessages(messages, 1);

    expect(approveMessages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: "token_in", spenderAddress: "router_address", amount: "1250000" }],
      }),
    ]);
    expect(txMessages).toHaveLength(1);
    expect(txMessages[0]).toMatchObject({
      pkg_path: "router_path",
      func: "ExactInSwapRoute",
      args: ["token_in", "token_out", "1250000", "token_in:token_out:3000", "1", "2000000", "123", ""],
    });
    expect(resetMessages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: "token_in", spenderAddress: "router_address", amount: "0" }],
      }),
    ]);
    expect(messages.some(message => getRunMessageBody(message).includes("address(\"pool_address\")"))).toBe(false);
    expect(messages.some(message => getRunMessageBody(message).includes("grc20reg.Approve(0, cur, \"token_out\""))).toBe(
      false,
    );
  });

  it("approves only input token for exact-out swaps using max sent amount", async () => {
    const caller = "caller";
    const inputToken = createTokenModel("token_in");
    const outputToken = createTokenModel("token_out");
    const fetchAllowance = jest.fn(async () => 0);

    const messages = await makeExactOutSwapRouteMessageWithApproves(
      {
        inputToken,
        outputToken,
        tokenAmount: 2,
        estimatedRoutes: [route],
        tokenAmountLimit: 1.25,
        deadline: 123,
        caller,
        referrerAddress: null,
      },
      fetchAllowance,
    );

    const { approveMessages, txMessages, resetMessages } = splitMessages(messages, 1);

    expect(approveMessages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: "token_in", spenderAddress: "router_address", amount: "1250000" }],
      }),
    ]);
    expect(txMessages).toHaveLength(1);
    expect(txMessages[0]).toMatchObject({
      pkg_path: "router_path",
      func: "ExactOutSwapRoute",
      args: ["token_in", "token_out", "2000000", "token_in:token_out:3000", "1", "1250000", "123", ""],
    });
    expect(resetMessages).toEqual([
      makeExpectedApproveRunMessage({
        caller,
        approves: [{ tokenPath: "token_in", spenderAddress: "router_address", amount: "0" }],
      }),
    ]);
    expect(messages.some(message => getRunMessageBody(message).includes("address(\"pool_address\")"))).toBe(false);
    expect(messages.some(message => getRunMessageBody(message).includes("grc20reg.Approve(0, cur, \"token_out\""))).toBe(
      false,
    );
  });
});
