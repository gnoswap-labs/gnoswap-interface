import {
  RANGE_STATUS_OPTION,
  SwapFeeTierInfoMap,
  SwapFeeTierType
} from "@constants/option.constant";
import DecreasePositionModalContainer from "@containers/decrease-position-modal-container/DecreasePositionModalContainer";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

export interface Props {
  openModal: () => void;
}

export interface DecreasePositionModal {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  swapFeeTier: SwapFeeTierType | null;
  minPriceStr: string;
  maxPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  percent: number;
}

export const useDecreasePositionModal = ({
  tokenA,
  tokenB,
  swapFeeTier,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  percent,
}: DecreasePositionModal): Props => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const amountInfo = useMemo(() => {
    if (!tokenA || !tokenB || !swapFeeTier) {
      return null;
    }
    return {
      tokenA,
      tokenB,
      feeRate: SwapFeeTierInfoMap[swapFeeTier].rateStr,
    };
  }, [swapFeeTier, tokenA, tokenB]);

  const openModal = useCallback(() => {
    if (!amountInfo) {
      return;
    }
    setOpenedModal(true);
    setModalContent(
      <DecreasePositionModalContainer
        amountInfo={amountInfo}
        minPriceStr={minPriceStr}
        maxPriceStr={maxPriceStr}
        rangeStatus={rangeStatus}
        percent={percent}
      />,
    );
  }, [setModalContent, setOpenedModal, amountInfo]);

  return {
    openModal,
  };
};
