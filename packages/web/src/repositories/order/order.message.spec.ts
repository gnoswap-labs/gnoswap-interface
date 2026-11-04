jest.mock("@constants/environment.constant", () => ({
  ...jest.requireActual("@constants/environment.constant"),
  WRAPPED_GNOT_PATH: "gno.land/r/gnoland/wugnot",
  WRAPPED_GNOT_PACKAGE_PATH: "gno.land/r/gnoland/wugnot",
  PACKAGE_DCA_ORDER_PATH: "dca_path",
  PACKAGE_DCA_ORDER_ADDRESS: "dca_address",
  PACKAGE_LIMIT_ORDER_PATH: "limit_path",
  PACKAGE_LIMIT_ORDER_ADDRESS: "limit_address",
}));

import type { TokenModel } from "@models/token/token-model";

import {
  getDcaDepositAmount,
  makeCancelDcaOrderMessages,
  makeCancelLimitOrderMessages,
  makeClaimDcaOrderMessages,
  makeCreateDcaOrderMessagesWithApproves,
  makeCreateLimitOrderMessagesWithApproves,
} from "./order.message";

const caller = "g1caller";

const gnsToken: TokenModel = {
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "",
  name: "GnoSwap",
  path: "gno.land/r/gnoswap/gns",
  wrappedPath: "gno.land/r/gnoswap/gns",
  decimals: 6,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "",
  priceID: "gno.land/r/gnoswap/gns",
  pkgPath: "gno.land/r/gnoswap/gns",
  routes: { funcs: { approve: { name: "Approve", args: ["$spender", "$amount"] } } },
};

const gnotToken: TokenModel = {
  type: "Native",
  chainId: "",
  createdAt: "",
  name: "Gno.land",
  path: "ugnot",
  wrappedPath: "gno.land/r/gnoland/wugnot",
  decimals: 6,
  symbol: "GNOT",
  displaySymbol: "GNOT",
  logoURI: "",
  priceID: "ugnot",
};

const wugnotToken: TokenModel = {
  ...gnotToken,
  type: "GRC20",
  path: "gno.land/r/gnoland/wugnot",
  priceID: "gno.land/r/gnoland/wugnot",
  symbol: "WUGNOT",
  displaySymbol: "WUGNOT",
};

describe("order.message.ts", () => {
  describe("getDcaDepositAmount", () => {
    it("multiplies the per-execution amount by the execution count", () => {
      expect(getDcaDepositAmount("750000000", 200)).toBe("150000000000");
    });
  });

  describe("makeCreateDcaOrderMessagesWithApproves", () => {
    it("approves the whole deposit to the DCA realm before creating the order", async () => {
      const messages = await makeCreateDcaOrderMessagesWithApproves({
        inputToken: gnsToken,
        outputToken: wugnotToken,
        interval: 3600,
        slotOffset: 0,
        amountPerExecution: "750000000",
        executionCount: 4,
        caller,
      });

      expect(messages).toHaveLength(2);
      expect(messages[0]).toMatchObject({
        caller,
        pkg_path: "gno.land/r/gnoswap/gns",
        func: "Approve",
        args: ["dca_address", "3000000000"],
      });
      expect(messages[1]).toMatchObject({
        caller,
        send: "",
        pkg_path: "dca_path",
        func: "CreateOrder",
        args: ["gno.land/r/gnoswap/gns", "gno.land/r/gnoland/wugnot", "3600", "0", "750000000", "4"],
      });
    });

    it("wraps native GNOT and approves the wrapped token in the same transaction", async () => {
      const messages = await makeCreateDcaOrderMessagesWithApproves({
        inputToken: gnotToken,
        outputToken: gnsToken,
        interval: 60,
        slotOffset: 0,
        amountPerExecution: "1000000",
        executionCount: 3,
        caller,
      });

      expect(messages).toHaveLength(3);
      // The approve is a MsgRun against the wrapped token.
      expect(messages[0]).toHaveProperty("package");
      expect(JSON.stringify(messages[0])).toContain("gno.land/r/gnoland/wugnot");
      expect(JSON.stringify(messages[0])).toContain("dca_address");
      expect(messages[1]).toMatchObject({
        caller,
        send: "3000000ugnot",
        pkg_path: "gno.land/r/gnoland/wugnot",
        func: "Deposit",
      });
      expect(messages[2]).toMatchObject({
        pkg_path: "dca_path",
        func: "CreateOrder",
        args: ["gno.land/r/gnoland/wugnot", "gno.land/r/gnoswap/gns", "60", "0", "1000000", "3"],
      });
    });

    it("skips the approve when the allowance is already unlimited", async () => {
      // Allowances above the repo-wide approve threshold are treated as unlimited.
      const fetchAllowance = jest.fn(async () => 2e18);

      const messages = await makeCreateDcaOrderMessagesWithApproves(
        {
          inputToken: gnsToken,
          outputToken: wugnotToken,
          interval: 3600,
          slotOffset: 0,
          amountPerExecution: "750000000",
          executionCount: 4,
          caller,
        },
        fetchAllowance,
      );

      expect(fetchAllowance).toHaveBeenCalledWith("gno.land/r/gnoswap/gns", caller, "dca_address");
      expect(messages).toHaveLength(1);
      expect(messages[0]).toMatchObject({ func: "CreateOrder" });
    });
  });

  describe("makeCreateLimitOrderMessagesWithApproves", () => {
    it("approves the making amount to the limit realm and serializes every argument", async () => {
      const messages = await makeCreateLimitOrderMessagesWithApproves({
        tokenIn: gnsToken,
        tokenOut: wugnotToken,
        makingAmount: "3000000",
        takingAmount: "3814800",
        slippageBps: 50,
        expiresAt: 1745866400,
        caller,
      });

      expect(messages).toHaveLength(2);
      expect(messages[0]).toMatchObject({ func: "Approve", args: ["limit_address", "3000000"] });
      expect(messages[1]).toMatchObject({
        pkg_path: "limit_path",
        func: "CreateOrder",
        args: ["gno.land/r/gnoswap/gns", "gno.land/r/gnoland/wugnot", "3000000", "3814800", "50", "1745866400"],
      });
    });

    it("wraps native GNOT before the limit order", async () => {
      const messages = await makeCreateLimitOrderMessagesWithApproves({
        tokenIn: gnotToken,
        tokenOut: gnsToken,
        makingAmount: "5000000",
        takingAmount: "4000000",
        slippageBps: 1000,
        expiresAt: 1745866400,
        caller,
      });

      expect(messages).toHaveLength(3);
      expect(messages[1]).toMatchObject({ func: "Deposit", send: "5000000ugnot" });
      expect(messages[2]).toMatchObject({ func: "CreateOrder" });
    });

    it("refuses a native GNOT amount below the wrap minimum instead of dropping the Deposit", async () => {
      const fetchAllowance = jest.fn().mockResolvedValue(0);

      await expect(
        makeCreateLimitOrderMessagesWithApproves(
          {
            tokenIn: gnotToken,
            tokenOut: gnsToken,
            makingAmount: "500",
            takingAmount: "500",
            slippageBps: 1000,
            expiresAt: 1745866400,
            caller,
          },
          fetchAllowance,
        ),
      ).rejects.toThrow("wrap minimum");
      await expect(
        makeCreateDcaOrderMessagesWithApproves(
          {
            inputToken: gnotToken,
            outputToken: gnsToken,
            interval: 60,
            slotOffset: 0,
            amountPerExecution: "499",
            executionCount: 2,
            caller,
          },
          fetchAllowance,
        ),
      ).rejects.toThrow("wrap minimum");
    });
  });

  it("builds cancel messages for both order types", () => {
    expect(makeCancelDcaOrderMessages({ orderId: "42", caller })).toEqual([
      expect.objectContaining({ pkg_path: "dca_path", func: "CancelOrder", args: ["42"] }),
    ]);
    expect(makeCancelLimitOrderMessages({ orderId: "7", caller })).toEqual([
      expect.objectContaining({ pkg_path: "limit_path", func: "CancelOrder", args: ["7"] }),
    ]);
  });

  it("cancels an earlier realm's order in that realm", () => {
    expect(
      makeCancelDcaOrderMessages({ orderId: "42", caller, packagePath: "gno.land/r/gnoswap/test/order/dca" }),
    ).toEqual([expect.objectContaining({ pkg_path: "gno.land/r/gnoswap/test/order/dca", func: "CancelOrder" })]);
    expect(
      makeCancelLimitOrderMessages({ orderId: "7", caller, packagePath: "gno.land/r/gnoswap/test/order/limit" }),
    ).toEqual([expect.objectContaining({ pkg_path: "gno.land/r/gnoswap/test/order/limit", func: "CancelOrder" })]);
  });

  it("builds the DCA claim message", () => {
    expect(makeClaimDcaOrderMessages({ orderId: "42", caller })).toEqual([
      expect.objectContaining({ pkg_path: "dca_path", func: "Claim", args: ["42"], send: "" }),
    ]);
  });
});
