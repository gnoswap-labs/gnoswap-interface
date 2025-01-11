import { Document } from "./messages.utils";

export const createDocument = (
  accountSequence: number,
  accountNumber: number,
  chainId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[],
  gasWanted: number,
  gasFee?: number,
  memo?: string | undefined,
): Document => {
  return {
    msgs: [...messages],
    fee: {
      amount: [
        {
          amount: String(gasFee),
          denom: "ugnot",
        },
      ],
      gas: gasWanted.toString(),
    },
    chain_id: chainId,
    memo: memo || "",
    account_number: accountNumber.toString(),
    sequence: accountSequence.toString(),
  };
};
