import IncentivizePoolModal from "@components/incentivize/incentivize-pool-modal/IncentivizePoolModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback } from "react";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import useRouter from "@hooks/common/use-custom-router";
import {
  makeBroadcastIncentivizeMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import BigNumber from "bignumber.js";

const DAY_TIME = 24 * 60 * 60;
const MILLISECONDS = 1000;

const IncentivizePoolModalContainer = () => {
  const {
    broadcastSuccess,
    broadcastPending,
    broadcastError,
    broadcastRejected,
    broadcastLoading,
  } = useBroadcastHandler();
  const router = useRouter();
  const clearModal = useClearModal();
  const { poolRepository } = useGnoswapContext();
  const [period] = useAtom(EarnState.period);
  const [startDate] = useAtom(EarnState.date);
  const [dataModal] = useAtom(EarnState.dataModal);
  const [pool] = useAtom(EarnState.pool);
  const { openModal } = useTransactionConfirmModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(() => {
    if (!pool || !dataModal?.token) {
      return null;
    }
    const startUTCDate = Date.UTC(
      startDate.year,
      startDate.month - 1,
      startDate.date,
      0,
      0,
      0,
      0,
    );
    // `startTime` is current UTC time to Unix timestamp
    const startTime = new Date(startUTCDate).getTime() / MILLISECONDS;
    // `endTime` adds the period time to the start unix time.
    const endTime = startTime + period * DAY_TIME;

    const displayAmount = BigNumber(dataModal.amount).toFormat();

    broadcastLoading(
      makeBroadcastIncentivizeMessage("pending", {
        tokenAmount: displayAmount,
        tokenSymbol: dataModal?.token?.symbol,
      }),
    );

    return poolRepository
      .createExternalIncentive({
        poolPath: pool.poolPath,
        rewardToken: dataModal.token,
        rewardAmount: dataModal.amount || "0",
        startTime,
        endTime,
      })
      .then(response => {
        if (response) {
          if (response.code === 0) {
            broadcastPending();
            setTimeout(() => {
              broadcastSuccess(
                makeBroadcastIncentivizeMessage("success", {
                  tokenAmount: displayAmount,
                  tokenSymbol: dataModal?.token?.symbol,
                }),
              );
              openModal();
            }, 1000);
            const pathName = router.pathname;
            if (pathName === "/earn/incentivize") {
              router.push("/earn?back=q");
            } else {
              router.push(router.asPath.replace("/incentivize", ""));
            }
          } else if (
            response.code === 4000 &&
            response.type !== ERROR_VALUE.TRANSACTION_REJECTED.type
          ) {
            broadcastPending();
            setTimeout(() => {
              broadcastError(
                makeBroadcastIncentivizeMessage("error", {
                  tokenAmount: displayAmount,
                  tokenSymbol: dataModal?.token?.symbol,
                }),
              );
              openModal();
            }, 1000);
          } else {
            broadcastRejected(
              makeBroadcastIncentivizeMessage("error", {
                tokenAmount: displayAmount,
                tokenSymbol: dataModal?.token?.symbol,
              }),
            );
            openModal();
          }
        }
        return response;
      })
      .catch(e => {
        console.log(e);
        return null;
      });
  }, [
    poolRepository,
    dataModal,
    period,
    pool,
    router,
    startDate.date,
    startDate.month,
    startDate.year,
  ]);

  return (
    <IncentivizePoolModal
      close={close}
      onSubmit={onSubmit}
      data={dataModal}
      date={startDate}
      period={period}
      pool={pool}
    />
  );
};

export default IncentivizePoolModalContainer;
