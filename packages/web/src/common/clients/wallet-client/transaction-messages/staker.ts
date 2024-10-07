import {
  PACKAGE_NFT_PATH,
  PACKAGE_STAKER_ADDRESS,
  PACKAGE_STAKER_PATH,
} from "@constants/environment.constant";
import { makeApproveMessage, makeTransactionMessage } from "./common";

export function makeApporveStakeTokenMessage(
  lpTokenId: string,
  caller: string,
) {
  return makeApproveMessage(
    PACKAGE_NFT_PATH,
    [PACKAGE_STAKER_ADDRESS, lpTokenId.toString()],
    caller,
  );
}

export function makeCollectRewardMessage(lpTokenId: string, caller: string) {
  return makeTransactionMessage({
    send: "",
    func: "CollectReward",
    packagePath: PACKAGE_STAKER_PATH,
    args: [
      lpTokenId.toString(),
      // The parameter is incorrect for the current contract version.
      // "true",
    ],
    caller,
  });
}

export function makeStakeMessage(lpTokenId: string, caller: string) {
  return makeTransactionMessage({
    send: "",
    func: "StakeToken",
    packagePath: PACKAGE_STAKER_PATH,
    args: [lpTokenId.toString()],
    caller,
  });
}

export function makeUnstakeMessage(
  lpTokenId: string,
  isGetWGNOT: boolean,
  caller: string,
) {
  return makeTransactionMessage({
    send: "",
    func: "UnstakeToken",
    packagePath: PACKAGE_STAKER_PATH,
    args: [
      lpTokenId.toString(),
      // `${!isGetWGNOT}`, // whether unwrap token, true will get GNOT : isGetWGNOT == true => wrap
    ],
    caller,
  });
}
