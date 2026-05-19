import { GNS_TOKEN, GNOT_UNIT_DENOM } from "@common/values/token-constant";
import { isContractMessage } from "@common/clients/wallet-client/protocols";

import { makeTransferGNOTTokenMessages, makeTransferGRC20TokenMessages } from "./wallet.message";

describe("wallet messages", () => {
  it("preserves native transfer raw amounts as strings", () => {
    const rawAmount = "123456789012345678901234567890";

    const [message] = makeTransferGNOTTokenMessages({
      tokenAmount: rawAmount,
      fromAddress: "g1from",
      toAddress: "g1to",
    });

    expect(message).toEqual({
      amount: `${rawAmount}${GNOT_UNIT_DENOM}`,
      from_address: "g1from",
      to_address: "g1to",
    });
  });

  it("preserves GRC20 transfer raw amounts as strings", () => {
    const rawAmount = "123456789012345678901234567890";

    const [message] = makeTransferGRC20TokenMessages({
      token: GNS_TOKEN,
      tokenAmount: rawAmount,
      fromAddress: "g1from",
      toAddress: "g1to",
    });

    expect(isContractMessage(message)).toBe(true);
    if (isContractMessage(message)) {
      expect(message.args).toEqual(["g1to", rawAmount]);
    }
  });
});
