import { PACKAGE_STAKER_PATH } from "@constants/environment.constant";
import { toNativePath } from "@utils/common";
import { makeGNOTSendAmount, makeTransactionMessage } from "./common";

export function makeCreateIncentiveMessage(
  poolPath: string,
  rewardTokenPath: string,
  rewardAmount: string,
  startTime: number,
  endTime: number,
  caller: string,
  isGNOT: boolean,
) {
  const send = makeGNOTSendAmount(isGNOT ? rewardAmount : 0);
  const tokenPath = isGNOT ? toNativePath(rewardTokenPath) : rewardTokenPath;

  return makeTransactionMessage({
    send: send,
    func: "CreateExternalIncentive",
    packagePath: PACKAGE_STAKER_PATH,
    args: [poolPath, tokenPath, rewardAmount, `${startTime}`, `${endTime}`],
    caller,
  });
}

export function makeRemoveIncentiveMessage(
  poolPath: string,
  rewardTokenPath: string,
  caller: string,
) {
  return makeTransactionMessage({
    send: "",
    func: "EndExternalIncentive",
    packagePath: PACKAGE_STAKER_PATH,
    args: [caller, poolPath, rewardTokenPath],
    caller,
  });
}
