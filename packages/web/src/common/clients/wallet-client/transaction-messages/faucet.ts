import { makeTransactionMessage, PACKAGE_FAUCET_PATH } from "./common";

export function makeFaucetMessage(caller: string) {
  return makeTransactionMessage({
    packagePath: PACKAGE_FAUCET_PATH,
    send: "",
    func: "Faucet",
    args: [caller],
    caller,
  });
}
