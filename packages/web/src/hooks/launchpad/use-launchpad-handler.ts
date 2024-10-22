import { useCallback, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import BigNumber from "bignumber.js";

import { LaunchpadState } from "@states/index";
import { GNS_TOKEN } from "@common/values/token-constant";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { LaunchpadParticipationModel } from "@models/launchpad";
import { useGetLastedBlockHeight } from "@query/pools";
import { useGetAllTokenPrices } from "@query/token";
import { DexEvent } from "@repositories/common";
import { toUnitFormat } from "@utils/number-utils";
import { makeRawTokenAmount } from "@utils/token-utils";
import { useTranslation } from "react-i18next";
import { useLaunchpadModal } from "./use-launchpad-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { formatPrice } from "@utils/new-number-utils";
import { useGetMyDelegation } from "@query/governance";

type DepositButtonStateType =
  | "WALLET_LOGIN"
  | "SWITCH_NETWORK"
  | "ENTER_AMOUNT"
  | "AMOUNT_TOO_LOW"
  | "INSUFFICIENT_BALANCE"
  | "IS_NOT_DEPOSIT_ALLOWED"
  | "DEPOSIT";

export const useLaunchpadHandler = () => {
  const participateAmount = useAtomValue(LaunchpadState.participateAmount);
  const depositConditions = useAtomValue(LaunchpadState.depositConditions);
  const [, setIsShowConditionTooltip] = useAtom(
    LaunchpadState.isShowConditionTooltip,
  );

  const {
    connected: connectedWallet,
    account,
    isSwitchNetwork,
    switchNetwork,
  } = useWallet();
  const { displayBalanceMap } = useTokenData();

  const { openLaunchpadWaitingConfirmationModal } = useLaunchpadModal();
  const { launchpadRepository } = useGnoswapContext();
  const { data: blockHeight } = useGetLastedBlockHeight();
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

  const tokenGnsBalance = useMemo(() => {
    if (isSwitchNetwork) return "-";

    return formatPrice(displayBalanceMap?.[GNS_TOKEN.path], {
      isKMB: false,
      usd: false,
    });
  }, [isSwitchNetwork, displayBalanceMap]);

  // Util function
  function compareAmountFn(
    amountA: string | number | bigint,
    amountB: string | number | bigint,
  ) {
    const amountValueA = BigNumber(`${amountA}`.replace(/,/g, ""));
    const amountValueB = BigNumber(`${amountB}`.replace(/,/g, ""));

    if (amountValueA.isEqualTo(amountValueB)) {
      return 0;
    }

    return amountValueA.isGreaterThan(amountValueB) ? 1 : -1;
  }

  // Variables to determine if conditions are met to make a deposit
  const isDepositAllowed = depositConditions.every(condition => {
    if (condition.tokenPath === "gno.land/r/gnoswap/v2/gov/xgns") {
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
   * @param projectPoolId The Pool ID of the launchpad project.
   * @param depositAmount The amount of GNS tokens to deposit. Deposit the visible quantity, not in units. ex) 100.00123
   * @param emitCallback A callback function that runs when a transaction send event is successfully fired. You can proceed to update data with refetch.
   */
  const deposit = (
    projectPoolId: string,
    depositAmount: string,
    emitCallback: () => Promise<void>,
  ) => {
    if (!account) {
      return;
    }

    const displayAmount = Number(depositAmount).toLocaleString("en");
    const unitAmount = makeRawTokenAmount(GNS_TOKEN, depositAmount) || "0";

    const messageData = {
      tokenAAmount: displayAmount,
      tokenASymbol: GNS_TOKEN.symbol,
    };

    processTx(
      () =>
        launchpadRepository.depositLaunchpadPoolBy(
          projectPoolId,
          BigInt(unitAmount),
          account.address,
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
    );
  };

  /**
   * Receive rewards for each deposit in Launchpad.
   * If the reward distribution period for the Project Pool has ended, you will also receive your deposited GNS.
   *
   * @param participationInfo The data model of the participation.
   * @param emitCallback A callback function that runs when a transaction send event is successfully fired. You can proceed to update data with refetch.
   */
  const claim = (
    participationInfo: LaunchpadParticipationModel,
    emitCallback: () => Promise<void>,
  ) => {
    if (!account || !blockHeight) {
      return;
    }

    const isWithdraw = BigNumber(blockHeight).isGreaterThan(
      participationInfo.endBlockHeight,
    );

    const gnsUSDPrice = tokenPriceMap?.[GNS_TOKEN.priceID]?.usd || 0;
    const rewardUSDPrice =
      tokenPriceMap?.[participationInfo.rewardToken?.priceID || "-"]?.usd || 0;

    const depositUSDValue = isWithdraw
      ? BigNumber(participationInfo.depositAmount)
          .multipliedBy(gnsUSDPrice)
          .shiftedBy(-1 * GNS_TOKEN.decimals)
      : 0;
    const rewardUSDValue = participationInfo.rewardToken
      ? BigNumber(participationInfo.claimableRewardAmount)
          .multipliedBy(rewardUSDPrice)
          .shiftedBy(-1 * participationInfo.rewardToken.decimals)
      : null;

    const usdValue =
      rewardUSDValue !== null
        ? toUnitFormat(BigNumber(depositUSDValue).plus(rewardUSDValue), true)
        : "";

    const messageData = {
      tokenAAmount: usdValue,
    };

    processTx(
      () => {
        if (isWithdraw) {
          return launchpadRepository.collectRewardWithDepositByDepositId(
            participationInfo.depositId,
            account.address,
          );
        }
        return launchpadRepository.collectRewardByDepositId(
          participationInfo.depositId,
          account.address,
        );
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
  const claimAll = (
    participationInfos: LaunchpadParticipationModel[],
    emitCallback: () => Promise<void>,
  ) => {
    if (!account || !blockHeight || participationInfos.length === 0) {
      return;
    }

    const isWithdraw = participationInfos.some(participation =>
      BigNumber(blockHeight).isGreaterThan(participation.endBlockHeight),
    );

    const participationInfo = participationInfos[0];

    const gnsUSDPrice = tokenPriceMap?.[GNS_TOKEN.priceID]?.usd || 0;
    const rewardUSDPrice =
      tokenPriceMap?.[participationInfo.rewardToken?.priceID || "-"]?.usd || 0;

    const depositUSDValue = participationInfos.reduce(
      (accumulated, current) => {
        if (BigNumber(blockHeight).isGreaterThan(current.endBlockHeight)) {
          return accumulated;
        }
        return BigNumber(accumulated).plus(
          current.depositAmount * Number(gnsUSDPrice),
        );
      },
      BigNumber(0),
    );

    const rewardUSDValue = participationInfos.reduce((accumulated, current) => {
      return BigNumber(accumulated).plus(
        current.claimableRewardAmount * Number(rewardUSDPrice),
      );
    }, BigNumber(0));

    const usdValue =
      rewardUSDValue !== null
        ? toUnitFormat(BigNumber(depositUSDValue).plus(rewardUSDValue), true)
        : "";

    const messageData = {
      tokenAAmount: usdValue,
    };

    processTx(
      () => {
        if (isWithdraw) {
          return launchpadRepository.collectRewardWithDepositByProjectId(
            participationInfo.projectId,
            account.address,
          );
        }
        return launchpadRepository.collectRewardByProjectId(
          participationInfo.projectId,
          account.address,
        );
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
  const depositButtonState: DepositButtonStateType = useMemo(() => {
    if (!connectedWallet) {
      return "WALLET_LOGIN";
    }
    if (isSwitchNetwork) {
      return "SWITCH_NETWORK";
    }
    if (!Number(participateAmount)) {
      return "ENTER_AMOUNT";
    }
    if (Number(participateAmount) < 1) {
      return "AMOUNT_TOO_LOW";
    }
    if (compareAmountFn(participateAmount, tokenGnsBalance) > 0) {
      return "INSUFFICIENT_BALANCE";
    }
    if (!isDepositAllowed) {
      return "IS_NOT_DEPOSIT_ALLOWED";
    }
    return "DEPOSIT";
  }, [
    connectedWallet,
    participateAmount,
    isSwitchNetwork,
    isDepositAllowed,
    tokenGnsBalance,
  ]);

  const depositButtonText = useMemo(() => {
    switch (depositButtonState) {
      case "WALLET_LOGIN":
        return t("common:btn.walletLogin");
      case "SWITCH_NETWORK":
        return t("Swap:swapButton.switchNetwork");
      case "ENTER_AMOUNT":
        return "Enter Amount";
      case "AMOUNT_TOO_LOW":
        return "Amount Too Low";
      case "INSUFFICIENT_BALANCE":
        return "Insufficient Balance";
      case "IS_NOT_DEPOSIT_ALLOWED":
        return "Conditions Aren't Met";
      case "DEPOSIT":
      default:
        return "Deposit Now";
    }
  }, [depositButtonState, t]);

  const isAvailableDeposit = useMemo(() => {
    return ["DEPOSIT", "IS_NOT_DEPOSIT_ALLOWED"].includes(depositButtonState);
  }, [depositButtonState]);

  const openConnectWallet = useCallback(() => {
    openModal();
  }, [openModal]);

  const openLaunchpadWaitingConfirmationAction = useCallback(() => {
    openLaunchpadWaitingConfirmationModal();
  }, [openLaunchpadWaitingConfirmationModal]);

  const showConditionTooltip = useCallback(() => {
    setIsShowConditionTooltip(true);
  }, [setIsShowConditionTooltip]);

  const hideConditionTooltip = useCallback(() => {
    setIsShowConditionTooltip(false);
  }, [setIsShowConditionTooltip]);

  return {
    deposit,
    claim,
    claimAll,
    connectedWallet,
    depositButtonState,
    depositButtonText,
    openConnectWallet,
    isSwitchNetwork,
    switchNetwork,
    openLaunchpadWaitingConfirmationAction,
    isAvailableDeposit,
    isDepositAllowed,
    showConditionTooltip,
    hideConditionTooltip,
  };
};
