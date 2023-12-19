import React, { useCallback, useState } from "react";
import UnstakePositionModal from "@components/unstake/unstake-position-modal/UnstakePositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRouter } from "next/router";
import { PositionResponse } from "@containers/submit-position-modal-container/SubmitPositionModalContainer";
import { useNotice } from "@hooks/common/use-notice";
import { makeRandomId, parseJson } from "@utils/common";
import { TNoticeType } from "src/context/NoticeContext";
import PositionStatus from "@containers/submit-position-modal-container/PositionModalStatus";

interface UnstakePositionModalContainerProps {
  positions: PoolPositionModel[];
}

const UnstakePositionModalContainer = ({
  positions,
}: UnstakePositionModalContainerProps) => {
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();

  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [positionResult, setPositionResult] = useState<PositionResponse>(null);

  const { setNotice } = useNotice();

  const close = useCallback(() => {
    setPositionResult(null);
    setIsConfirm(false);
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = positions.map(position => position.id);

    setIsConfirm(true);
    setPositionResult(null);

    try {
      const result = await positionRepository.unstakePositions({
        lpTokenIds,
        caller: address,
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
  }, [account?.address, positionRepository, positions, setNotice]);

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
    <UnstakePositionModal
      positions={positions}
      close={close}
      onSubmit={onSubmit}
    />
  );
};

export default UnstakePositionModalContainer;
