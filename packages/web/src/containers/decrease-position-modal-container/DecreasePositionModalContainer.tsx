import DecreasePositionModal from "@components/common/decrease-position-modal/DecreasePositionModal";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback } from "react";

interface Props {
  amountInfo: {
    tokenA: TokenModel;
    tokenB: TokenModel;
    feeRate: string;
  };
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  percent: number;
}

const DecreasePositionModalContainer: React.FC<Props> = ({
  amountInfo,
  maxPriceStr,
  minPriceStr,
  rangeStatus,
  percent,
}) => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return (
    <DecreasePositionModal
      close={close}
      amountInfo={amountInfo}
      maxPriceStr={maxPriceStr}
      minPriceStr={minPriceStr}
      rangeStatus={rangeStatus}
      percent={percent}
    />
  );
};

export default DecreasePositionModalContainer;
