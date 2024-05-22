import {
  makeApproveMessage,
  makeGNOTSendAmount,
  makeTransactionMessage,
  PACKAGE_POOL_ADDRESS,
  PACKAGE_STAKER_ADDRESS,
  PACKAGE_STAKER_PATH,
} from "./common";

export function makePoolTokenApproveMessage(
  packagePath: string,
  amount: string,
  caller: string,
) {
  return makeApproveMessage(
    packagePath,
    [PACKAGE_POOL_ADDRESS, amount],
    caller,
  );
}

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

  return makeTransactionMessage({
    send: send,
    func: "CreateExternalIncentive",
    packagePath: PACKAGE_STAKER_PATH,
    args: [
      poolPath,
      rewardTokenPath,
      rewardAmount,
      `${startTime}`,
      `${endTime}`,
    ],
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

export function makeStakerApproveMessage(
  tokenPath: string,
  amount: string,
  caller: string,
) {
  return makeApproveMessage(
    tokenPath,
    [PACKAGE_STAKER_ADDRESS, amount],
    caller,
  );
}
