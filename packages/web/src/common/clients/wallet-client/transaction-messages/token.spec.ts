import { makeTransactionMessage } from "./common";
import { makeExpectedTransferRunMessage } from "./run.test-fixtures";
import { makeTransferGRC20TokenMessage } from "./token";

describe("makeTransferGRC20TokenMessage", () => {
  const fromAddress = "from";
  const toAddress = "to";

  it("uses a direct MsgCall for tokens registered in grc20-method-specs.json", () => {
    const message = makeTransferGRC20TokenMessage("gno.land/r/gnoswap/gns.GNS", "100", fromAddress, toAddress);

    expect(message).toEqual(
      makeTransactionMessage({
        caller: fromAddress,
        send: "",
        packagePath: "gno.land/r/gnoswap/gns",
        func: "Transfer",
        args: [toAddress, "100"],
      }),
    );
  });

  it("falls back to a grc20reg run message for unregistered tokens", () => {
    const tokenPath = "gno.land/r/demo/foo.FOO";

    const message = makeTransferGRC20TokenMessage(tokenPath, "100", fromAddress, toAddress);

    expect(message).toEqual(
      makeExpectedTransferRunMessage({ caller: fromAddress, tokenPath, toAddress, amount: "100" }),
    );
  });
});
