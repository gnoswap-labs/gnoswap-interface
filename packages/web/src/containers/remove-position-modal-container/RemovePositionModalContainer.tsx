import RemovePositionModal from "@components/remove/remove-position-modal/RemovePositionModal";
import PositionStatus from "@containers/submit-position-modal-container/PositionModalStatus";
import { PositionResponse } from "@containers/submit-position-modal-container/SubmitPositionModalContainer";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useNotice } from "@hooks/common/use-notice";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { makeRandomId, parseJson } from "@utils/common";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import { TNoticeType } from "src/context/NoticeContext";

interface RemovePositionModalContainerProps {
  positions: PoolPositionModel[];
}

const RemovePositionModalContainer = ({
  positions,
}: RemovePositionModalContainerProps) => {
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();

  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [positionResult, setPositionResult] = useState<PositionResponse>(null);

  const { setNotice } = useNotice();

  const close = useCallback(() => {
    clearModal();
    setPositionResult(null);
    setIsConfirm(false);
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
      const result = await positionRepository.removeLiquidity({
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
    <RemovePositionModal
      positions={positions}
      close={close}
      onSubmit={onSubmit}
    />
  );
};

export default RemovePositionModalContainer;
