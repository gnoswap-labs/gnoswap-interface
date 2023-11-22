import OneClickStakingModal from "@components/common/one-click-staking-modal/OneClickStakingModal";
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
  priceRangeInfo: {
    currentPrice: string;
    minPrice: string;
    minPriceLable: string;
    maxPrice: string;
    maxPriceLable: string;
    feeBoost: string;
    estimatedAPR: string;
  };
}

const OneClickStakingModalContainer:React.FC<Props> = ({
  amountInfo,
  priceRangeInfo,
}) => {
  const clearModal = useClearModal();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <OneClickStakingModal close={close} amountInfo={amountInfo} priceRangeInfo={priceRangeInfo} />;
};

export default OneClickStakingModalContainer;
