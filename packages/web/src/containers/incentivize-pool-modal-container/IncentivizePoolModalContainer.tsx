import IncentivizePoolModal from "@components/incentivize/incentivize-pool-modal/IncentivizePoolModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import React, { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { EarnState } from "@states/index";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRouter } from "next/router";
import PositionStatus from "@containers/submit-position-modal-container/PositionModalStatus";
import { PositionResponse } from "@containers/submit-position-modal-container/SubmitPositionModalContainer";
import { useNotice } from "@hooks/common/use-notice";
import { makeRandomId, parseJson } from "@utils/common";
import { TNoticeType } from "src/context/NoticeContext";

const DAY_TIME = 24 * 60 * 60;

const IncentivizePoolModalContainer = () => {
  const router = useRouter();
  const clearModal = useClearModal();
  const { poolRepository } = useGnoswapContext();
  const [period] = useAtom(EarnState.period);
  const [startDate] = useAtom(EarnState.date);
  const [dataModal] = useAtom(EarnState.dataModal);
  const [pool] = useAtom(EarnState.pool);

  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [positionResult, setPositionResult] = useState<PositionResponse>(null);

  const { setNotice } = useNotice();

  const close = useCallback(() => {
    setPositionResult(null);
    setIsConfirm(false);
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(async () => {
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
    const startTime = new Date(startUTCDate).getTime();
    const endTime = startTime + period * DAY_TIME;

    setIsConfirm(true);
    setPositionResult(null);

    try {
      const result = await poolRepository.createExternalIncentive({
        poolPath: pool.path,
        rewardToken: dataModal.token,
        rewardAmount: dataModal.amount || "0",
        startTime,
        endTime,
      });

      setPositionResult({
        success: true,
        hash: result ?? "",
      });

      setNotice(null, {
        timeout: 50000,
        type: "pending",
        closeable: true,
        id: makeRandomId(),
      });

      setTimeout(() => {
        setNotice(null, {
          timeout: 50000,
          type: "success" as TNoticeType,
          closeable: true,
          id: makeRandomId(),
        });
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        const { code } = parseJson(error?.message);
        setPositionResult({
          success: code === 0 ? true : false,
          code,
        });

        if (code !== 4000) {
          setNotice(null, {
            timeout: 50000,
            type: "pending",
            closeable: true,
            id: makeRandomId(),
          });

          setTimeout(() => {
            setNotice(null, {
              timeout: 50000,
              type:
                code === 0
                  ? ("success" as TNoticeType)
                  : ("error" as TNoticeType),
              closeable: true,
              id: makeRandomId(),
            });
          }, 1000);
        }
      }
    }
  }, [
    dataModal?.amount,
    dataModal?.token,
    period,
    pool,
    poolRepository,
    setNotice,
    startDate.date,
    startDate.month,
    startDate.year,
  ]);

  const onCloseTransaction = () => {
    setIsConfirm(false);
    close();
    if (positionResult?.success) {
      router.back();
    }
  };

  if (isConfirm)
    return (
      <PositionStatus
        close={onCloseTransaction}
        positionResult={positionResult}
      />
    );

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
