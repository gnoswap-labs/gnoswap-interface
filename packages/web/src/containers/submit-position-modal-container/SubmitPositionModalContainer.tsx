import React, { useCallback, useState } from "react";
import SubmitPositionModal from "@components/stake/submit-position-modal/SubmitPositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import PositionStatus from "./PositionModalStatus";
import { makeRandomId, parseJson } from "@utils/common";
import { useNotice } from "@hooks/common/use-notice";
import { TNoticeType } from "src/context/NoticeContext";

interface SubmitPositionModalContainerProps {
  positions: PoolPositionModel[];
}

export type PositionResponse = {
  hash?: string;
  success: boolean;
  code?: number;
} | null;

const SubmitPositionModalContainer = ({
  positions,
}: SubmitPositionModalContainerProps) => {
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [positionResult, setPositionResult] = useState<PositionResponse>(null);

  const { setNotice } = useNotice();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(async () => {
    setIsConfirm(true);
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = positions.map(position => position.id);

    setNotice(null, {
      timeout: 50000,
      type: "pending",
      closeable: true,
      id: makeRandomId(),
    });

    try {
      const result = await positionRepository.stakePositions({
        lpTokenIds,
        caller: address,
      });
      setPositionResult({
        success: true,
        hash: result ?? "",
      });

      setNotice(null, {
        timeout: 50000,
        type: "success" as TNoticeType,
        closeable: true,
        id: makeRandomId(),
      });
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
            type:
              code === 0
                ? ("success" as TNoticeType)
                : ("error" as TNoticeType),
            closeable: true,
            id: makeRandomId(),
          });
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
    <SubmitPositionModal
      positions={positions}
      close={close}
      onSubmit={onSubmit}
    />
  );
};

export default SubmitPositionModalContainer;
