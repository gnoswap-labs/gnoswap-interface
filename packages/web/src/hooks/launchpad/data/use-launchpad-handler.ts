import BigNumber from "bignumber.js";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { XGNS_TOKEN_PATH } from "@constants/environment.constant";
import { GNS_TOKEN } from "@common/values/token-constant";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { LaunchpadParticipationModel } from "@models/launchpad";
import { useGetMyDelegation } from "@query/governance";
import { useGetAllTokenPrices } from "@query/token";
import { DexEvent } from "@repositories/common";
import { LaunchpadState } from "@states/index";
import { toUnitFormat } from "@utils/number-utils";
import { makeRawTokenAmount } from "@utils/token-utils";
import { useReferral } from "@hooks/common/use-referral";
import { useTokenAmountInput } from "@hooks/token/data/use-token-amount-input";
import { isLaunchpadPoolEnded } from "@utils/launchpad-get-claimable";

type DepositButtonStateType =
  | "WALLET_LOGIN"
  | "SWITCH_NETWORK"
  | "ENTER_AMOUNT"
  | "AMOUNT_TOO_LOW"
  | "INSUFFICIENT_BALANCE"
  | "SELECT_POOL"
  | "IS_NOT_DEPOSIT_ALLOWED"
  | "DEPOSIT";

type DepositIDGroups = {
  endedPoolDepositIDs: string[];
  activePoolDepositIDs: string[];
};

function calculateUSDValueBy(
  amount: string | number | BigNumber,
  usdPrice: string | number | undefined,
): BigNumber | null {
  if (!usdPrice) {
    return null;
  }

  return BigNumber(amount).multipliedBy(usdPrice);
}

export const useLaunchpadHandler = () => {
  const { getCurrentReferralAddress, removeReferrerFromLocalStorage } = useReferral();

  const gnsAmountInput = useTokenAmountInput(GNS_TOKEN);

  const depositConditions = useAtomValue(LaunchpadState.depositConditions);
  const [, setIsShowConditionTooltip] = useAtom(LaunchpadState.isShowConditionTooltip);
  const selectPoolId = useAtomValue(LaunchpadState.selectLaunchpadPool);

  const { connected: connectedWallet, account, isSwitchNetwork, switchNetwork } = useWallet();
  const { displayBalanceMap } = useTokenData();

  const { launchpadRepository } = useGnoswapContext();
  const { data: tokenPriceMap } = useGetAllTokenPrices();
  const { t } = useTranslation();
  const { openModal } = useConnectWalletModal();
  const { data: myDelegationInfo } = useGetMyDelegation({
    address: account?.address || "",
  });
  const xGnsBalance = myDelegationInfo?.votingWeight;

  const [openedConfirmModal] = useState(false);
  const { processTx } = useBroadcastHandler();

  usePreventScroll(openedConfirmModal);

  // Util function
  function compareAmountFn(amountA: string | number | bigint, amountB: string | number | bigint) {
    const amountValueA = BigNumber(`${amountA}`.replace(/,/g, ""));
    const amountValueB = BigNumber(`${amountB}`.replace(/,/g, ""));

    if (amountValueA.isEqualTo(amountValueB)) {
      return 0;
    }

    return amountValueA.isGreaterThan(amountValueB) ? 1 : -1;
  }

  // Variables to determine if conditions are met to make a deposit
  const isDepositAllowed = depositConditions.every(condition => {
    if (condition.tokenPath === XGNS_TOKEN_PATH) {
      return Number(xGnsBalance) >= condition.leastTokenAmount;
    } else {
      const balance = displayBalanceMap[condition.tokenPath] || 0;
      return balance >= condition.leastTokenAmount;
    }
  });

  /**
   * Deposit GNS tokens to Launchpad.
   * Deposits allow you to receive tokens distributed by Launchpad projects as rewards.
   *
   * @param projectPoolID The Pool ID of the launchpad project.
   * @param depositAmount The amount of GNS tokens to deposit. Deposit the visible quantity, not in units. ex) 100.00123
   * @param emitCallback A callback function that runs when a transaction send event is successfully fired. You can proceed to update data with refetch.
   */
  const deposit = (projectPoolID: string, depositAmount: string, emitCallback: () => Promise<void>) => {
    if (!account) {
      return;
    }

    const displayAmount = Number(depositAmount).toLocaleString("en");
    const unitAmount = makeRawTokenAmount(GNS_TOKEN, depositAmount) || "0";

    const messageData = {
      tokenAAmount: displayAmount,
      tokenASymbol: GNS_TOKEN.symbol,
    };

    const currentReferralAddress = getCurrentReferralAddress();

    processTx(
      () =>
        launchpadRepository.depositLaunchpadPoolBy(
          projectPoolID,
          BigInt(unitAmount),
          account.address,
          currentReferralAddress,
        ),
      DexEvent.LAUNCHPAD_DEPOSIT,
      messageData,
      response => {
        if (!response) {
          return messageData;
        }
        return {
          ...messageData,
        };
      },
      emitCallback,
      undefined,
      removeReferrerFromLocalStorage,
    );
  };

  /**
   * Receive rewards for each deposit in Launchpad.
   * If the reward distribution period for the Project Pool has ended, you will also receive your deposited GNS.
   *
   * @param participationInfo The data model of the participation.
   * @param emitCallback A callback function that runs when a transaction send event is successfully fired. You can proceed to update data with refetch.
   */
  const claim = async (participationInfo: LaunchpadParticipationModel, emitCallback: () => Promise<void>) => {
    if (!account) {
      return;
    }

    const isWithdrawable = isLaunchpadPoolEnded(participationInfo.endTime);

    // Calculate the USD value of the Deposited USD available for withdrawal.
    const depositAmount = isWithdrawable ? participationInfo.depositAmount : 0;
    const depositUSDValue = calculateUSDValueBy(depositAmount, tokenPriceMap?.[GNS_TOKEN.path]?.usd);

    // Calculate the USD value of the claimable reward.
    const rewardAmount = participationInfo.claimableRewardAmount;
    const rewardUSDValue = calculateUSDValueBy(rewardAmount, tokenPriceMap?.[participationInfo.rewardTokenPath]?.usd);

    const hasUSDPrice = !!depositUSDValue?.isGreaterThan(0) || !!rewardUSDValue?.isGreaterThan(0);
    const usdValueStr = hasUSDPrice
      ? toUnitFormat(BigNumber(depositUSDValue || 0).plus(rewardUSDValue || 0), true)
      : "";

    const messageData = {
      tokenAAmount: usdValueStr,
    };

    processTx(
      () => {
        if (isWithdrawable) {
          return launchpadRepository.collectRewardWithDepositBydepositId(participationInfo.depositID, account.address);
        }
        return launchpadRepository.collectRewardBydepositId(participationInfo.depositID, account.address);
      },
      DexEvent.LAUNCHPAD_COLLECT_REWARD,
      messageData,
      response => {
        if (!response) {
          return messageData;
        }
        return {
          ...messageData,
        };
      },
      emitCallback,
    );
  };

  /**
   * Receive rewards for all deposits in Launchpad.
   * If the reward distribution period for the Project Pool has ended, you will also receive your deposited GNS.
   *
   * @param participationInfos The data model list of the participation.
   * @param emitCallback A callback function that runs when a transaction send event is successfully fired. You can proceed to update data with refetch.
   */
  const claimAll = async (participationInfos: LaunchpadParticipationModel[], emitCallback: () => Promise<void>) => {
    if (!account || participationInfos.length === 0) {
      return;
    }

    const participationInfo = participationInfos[0];

    const { endedPoolDepositIDs, activePoolDepositIDs } = participationInfos.reduce<DepositIDGroups>(
      (groups, info) => {
        if (isLaunchpadPoolEnded(info.endTime)) {
          groups.endedPoolDepositIDs.push(info.depositID);
        } else {
          groups.activePoolDepositIDs.push(info.depositID);
        }
        return groups;
      },
      { endedPoolDepositIDs: [], activePoolDepositIDs: [] },
    );

    const hasEndedPools = endedPoolDepositIDs.length > 0;

    // Calculate the USD value of the Deposited USD available for withdrawal.
    const depositAmount = endedPoolDepositIDs.reduce((accumulated, depositID) => {
      const info = participationInfos.find(p => p.depositID === depositID);
      if (!info) return accumulated;
      return BigNumber(accumulated).plus(info.depositAmount);
    }, BigNumber(0));

    const depositUSDValue = calculateUSDValueBy(depositAmount, tokenPriceMap?.[GNS_TOKEN.path]?.usd);

    // Calculate the USD value of the claimable reward.
    const rewardAmount = participationInfos.reduce((accumulated, current) => {
      return BigNumber(accumulated).plus(current.claimableRewardAmount);
    }, BigNumber(0));

    const rewardUSDValue = calculateUSDValueBy(rewardAmount, tokenPriceMap?.[participationInfo.rewardTokenPath]?.usd);

    const hasUSDPrice = !!depositUSDValue?.isGreaterThan(0) || !!rewardUSDValue?.isGreaterThan(0);
    const usdValueStr = hasUSDPrice
      ? toUnitFormat(BigNumber(depositUSDValue || 0).plus(rewardUSDValue || 0), true)
      : "";

    const messageData = {
      tokenAAmount: usdValueStr,
    };

    processTx(
      () => {
        if (hasEndedPools) {
          return launchpadRepository.collectRewardWithDepositByDepositIds(
            endedPoolDepositIDs,
            activePoolDepositIDs,
            account.address,
          );
        }
        return launchpadRepository.collectRewardByDepositIds(activePoolDepositIDs, account.address);
      },
      DexEvent.LAUNCHPAD_COLLECT_REWARD,
      messageData,
      response => {
        if (!response) {
          return messageData;
        }
        return {
          ...messageData,
        };
      },
      emitCallback,
    );
  };

  const DEPOSIT_MIN_AMOUNT = 1;

  const depositButtonState: DepositButtonStateType = useMemo(() => {
    if (!connectedWallet) {
      return "WALLET_LOGIN";
    }
    if (isSwitchNetwork) {
      return "SWITCH_NETWORK";
    }
    if (!Number(gnsAmountInput.amount)) {
      return "ENTER_AMOUNT";
    }
    if (compareAmountFn(gnsAmountInput.amount, gnsAmountInput.balance) > 0) {
      return "INSUFFICIENT_BALANCE";
    }
    if (selectPoolId === null) {
      return "SELECT_POOL";
    }
    if (Number(gnsAmountInput.amount) < DEPOSIT_MIN_AMOUNT) {
      return "AMOUNT_TOO_LOW";
    }
    if (!isDepositAllowed) {
      return "IS_NOT_DEPOSIT_ALLOWED";
    }
    return "DEPOSIT";
  }, [selectPoolId, connectedWallet, gnsAmountInput.amount, gnsAmountInput.balance, isSwitchNetwork, isDepositAllowed]);

  const depositButtonText = useMemo(() => {
    switch (depositButtonState) {
      case "WALLET_LOGIN":
        return t("common:btn.walletLogin");
      case "SWITCH_NETWORK":
        return t("Swap:swapButton.switchNetwork");
      case "ENTER_AMOUNT":
        return t("Launchpad:common.button.enterAmount");
      case "AMOUNT_TOO_LOW":
        return t("Launchpad:common.button.amountTooLow");
      case "INSUFFICIENT_BALANCE":
        return t("Launchpad:common.button.insufficientBalance");
      case "SELECT_POOL":
        return t("Launchpad:common.button.selectPool");
      case "IS_NOT_DEPOSIT_ALLOWED":
        return t("Launchpad:common.button.conditionsArentMet");
      case "DEPOSIT":
      default:
        return t("Launchpad:common.button.deposit");
    }
  }, [depositButtonState, t]);

  const isAvailableDeposit = useMemo(() => {
    return ["DEPOSIT", "IS_NOT_DEPOSIT_ALLOWED"].includes(depositButtonState);
  }, [depositButtonState]);

  const openConnectWallet = useCallback(() => {
    openModal();
  }, [openModal]);

  const showConditionTooltip = useCallback(() => {
    setIsShowConditionTooltip(true);
  }, [setIsShowConditionTooltip]);

  const hideConditionTooltip = useCallback(() => {
    setIsShowConditionTooltip(false);
  }, [setIsShowConditionTooltip]);

  return {
    gnsAmountInput,
    deposit,
    claim,
    claimAll,
    connectedWallet,
    depositButtonState,
    depositButtonText,
    openConnectWallet,
    isSwitchNetwork,
    switchNetwork,
    isAvailableDeposit,
    isDepositAllowed,
    showConditionTooltip,
    hideConditionTooltip,
  };
};
