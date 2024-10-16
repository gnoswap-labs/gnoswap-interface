import BigNumber from "bignumber.js";
import { useState, useMemo, useCallback } from "react";

import { GNS_TOKEN } from "@common/values/token-constant";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWallet } from "@hooks/wallet/use-wallet";
import { LaunchpadParticipationModel } from "@models/launchpad";
import { useGetLastedBlockHeight } from "@query/pools";
import { useGetAllTokenPrices } from "@query/token";
import { DexEvent } from "@repositories/common";
import { toUnitFormat } from "@utils/number-utils";
import { makeRawTokenAmount } from "@utils/token-utils";
import { useTranslation } from "react-i18next";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useLaunchpadModal } from "./use-launchpad-modal";

type DepositButtonStateType = "WALLET_LOGIN" | "SWITCH_NETWORK" | "DEPOSIT";

export const useLaunchpadHandler = () => {
  const {
    connected: connectedWallet,
    account,
    isSwitchNetwork,
    switchNetwork,
  } = useWallet();
  const { openLaunchpadClaimAllModal, openLaunchpadWaitingConfirmationModal } =
    useLaunchpadModal();
  const { launchpadRepository } = useGnoswapContext();
  const { data: blockHeight } = useGetLastedBlockHeight();
  const { data: tokenPriceMap } = useGetAllTokenPrices();
  const { t } = useTranslation();
  const { openModal } = useConnectWalletModal();

  const [openedConfirmModal] = useState(false);
  const { processTx } = useBroadcastHandler();

  usePreventScroll(openedConfirmModal);

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

    const collectFn = isWithdraw
      ? launchpadRepository.collectRewardWithDepositByDepositId
      : launchpadRepository.collectRewardByDepositId;

    processTx(
      () => collectFn(participationInfo.depositId, account.address),
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

    const collectFn = isWithdraw
      ? launchpadRepository.collectRewardWithDepositByProjectId
      : launchpadRepository.collectRewardByProjectId;

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
      () => collectFn(participationInfo.projectId, account.address),
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
    return "DEPOSIT";
  }, [connectedWallet, isSwitchNetwork]);

  const depositButtonText = useMemo(() => {
    switch (depositButtonState) {
      case "WALLET_LOGIN":
        return t("common:btn.walletLogin");
      case "SWITCH_NETWORK":
        return t("Swap:swapButton.switchNetwork");
      case "DEPOSIT":
      default:
        return "Deposit Now";
    }
  }, [depositButtonState, t]);

  const openConnectWallet = useCallback(() => {
    openModal();
  }, [openModal]);

  const openLaunchpadClaimAllAction = useCallback(() => {
    openLaunchpadClaimAllModal();
  }, [openLaunchpadClaimAllModal]);

  const openLaunchpadWaitingConfirmationAction = useCallback(() => {
    openLaunchpadWaitingConfirmationModal();
  }, [openLaunchpadWaitingConfirmationModal]);

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
    openLaunchpadClaimAllAction,
    openLaunchpadWaitingConfirmationAction,
  };
};
