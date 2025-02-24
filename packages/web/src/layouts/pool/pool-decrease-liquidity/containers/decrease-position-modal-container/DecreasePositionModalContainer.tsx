import React, { useCallback } from "react";

import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { TokenModel } from "@models/token/token-model";

import DecreasePositionModal from "../../components/decrease-position-modal/DecreasePositionModal";
import { IPooledTokenInfo } from "@hooks/pool/data/use-decrease-handle";

interface Props {
  amountInfo: {
    tokenA: TokenModel;
    tokenB: TokenModel;
    feeRate: string;
  };
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  calculateLiquidity: string;
  pooledTokenInfos: IPooledTokenInfo | null;
  confirm: () => void;
}

const DecreasePositionModalContainer: React.FC<Props> = ({
  confirm,
  amountInfo,
  maxPriceStr,
  minPriceStr,
  rangeStatus,
  calculateLiquidity,
  pooledTokenInfos,
}) => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return (
    <DecreasePositionModal
      confirm={confirm}
      close={close}
      amountInfo={amountInfo}
      maxPriceStr={maxPriceStr}
      minPriceStr={minPriceStr}
      rangeStatus={rangeStatus}
      calculateLiquidity={calculateLiquidity}
      pooledTokenInfos={pooledTokenInfos}
    />
  );
};

export default DecreasePositionModalContainer;
