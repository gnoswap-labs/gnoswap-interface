import IncreasePositionModal from "@components/common/increase-position-modal/IncreasePositionModal";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback } from "react";

interface Props {
  amountInfo: {
    tokenA: {
      info: TokenModel;
      amount: string;
      usdPrice: string;
    };
    tokenB: {
      info: TokenModel;
      amount: string;
      usdPrice: string;
    };
    feeRate: string;
  };
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  isDepositTokenA: boolean;
  isDepositTokenB: boolean;
  confirm: () => void;
}

const IncreasePositionModalContainer: React.FC<Props> = ({
  amountInfo,
  maxPriceStr,
  minPriceStr,
  rangeStatus,
  isDepositTokenA,
  isDepositTokenB,
  confirm,
}) => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return (
    <IncreasePositionModal
      confirm={confirm}
      close={close}
      amountInfo={amountInfo}
      maxPriceStr={maxPriceStr}
      minPriceStr={minPriceStr}
      rangeStatus={rangeStatus}
      isDepositTokenA={isDepositTokenA}
      isDepositTokenB={isDepositTokenB}
    />
  );
};

export default IncreasePositionModalContainer;
