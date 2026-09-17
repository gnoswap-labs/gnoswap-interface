import { makeTransactionMessage } from "./common";
import { makeExpectedTransferRunMessage } from "./run.test-fixtures";
import { makeTransferGRC20TokenMessage } from "./token";

describe("makeTransferGRC20TokenMessage", () => {
  const fromAddress = "from";
  const toAddress = "to";

  it("uses resource route metadata to build a direct MsgCall", () => {
    const message = makeTransferGRC20TokenMessage(
      {
        path: "gno.land/r/example/factory.FOO",
        pkgPath: "gno.land/r/example/factory",
        routes: {
          funcs: {
            transfer: { name: "VoucherSend", args: ["FOO", "$to", "$$literal", "$amount"] },
          },
        },
      },
      "100",
      fromAddress,
      toAddress,
    );

    expect(message).toEqual(
      makeTransactionMessage({
        caller: fromAddress,
        send: "",
        packagePath: "gno.land/r/example/factory",
        func: "VoucherSend",
        args: ["FOO", toAddress, "$literal", "100"],
      }),
    );
  });

  it("falls back to a grc20reg run message for unregistered tokens", () => {
    const tokenPath = "gno.land/r/demo/foo.FOO";

    const message = makeTransferGRC20TokenMessage({ path: tokenPath }, "100", fromAddress, toAddress);

    expect(message).toEqual(
      makeExpectedTransferRunMessage({ caller: fromAddress, tokenPath, toAddress, amount: "100" }),
    );
  });

  it("rejects a transfer explicitly omitted from route metadata", () => {
    expect(() =>
      makeTransferGRC20TokenMessage(
        {
          path: "gno.land/r/example/locked.LOCKED",
          pkgPath: "gno.land/r/example/locked",
          routes: { funcs: {} },
        },
        "100",
        fromAddress,
        toAddress,
      ),
    ).toThrow("Failed to build the GRC20 route");
  });
});
