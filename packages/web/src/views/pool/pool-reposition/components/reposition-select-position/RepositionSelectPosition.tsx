import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { formatPrice } from "@utils/new-number-utils";

import { IPriceRange } from "../../hooks/use-reposition-handle";

import { RepositionSelectPositionWrapper } from "./RepositionSelectPosition.styles";

export interface RepositionSelectPositionProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  fee: string;
  rangeStatus: RANGE_STATUS_OPTION;
  priceRangeSummary: IPriceRange;
  selectedPosition: PoolPositionModel | null;
  isLoadingPosition: boolean;
}

const RepositionSelectPosition: React.FC<RepositionSelectPositionProps> = ({
  tokenA,
  tokenB,
  fee,
  selectedPosition,
  isLoadingPosition,
}) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;

  const poolNameText = useMemo(() => {
    if (isLoadingPosition)
      return (
        <span
          css={pulseSkeletonStyle({
            w: 80,
          })}
        />
      );

    if (isMobile) return "";

    return (
      <>
        {tokenA?.symbol}/{tokenB?.symbol}
        <Badge text={fee} type={BADGE_TYPE.DARK_DEFAULT} />
      </>
    );
  }, [fee, isLoadingPosition, isMobile, tokenA?.symbol, tokenB?.symbol]);

  const priceText = useMemo(() => {
    if (isLoadingPosition)
      return (
        <div
          css={pulseSkeletonStyle({
            w: 80,
          })}
        />
      );

    return formatPrice(selectedPosition?.usdValue, {
      isKMB: false,
    });
  }, [isLoadingPosition, selectedPosition?.usdValue]);

  return (
    <RepositionSelectPositionWrapper>
      <h5>{t("Reposition:form.selectPosi.title")}</h5>
      <div className="select-position common-bg">
        <div className="pool-select-wrapper">
          <DoubleLogo
            left={tokenA?.logoURI || ""}
            right={tokenB?.logoURI || ""}
            size={24}
            leftSymbol={tokenB?.symbol}
            rightSymbol={tokenB?.symbol}
          />{" "}
          {poolNameText}
        </div>
        <p className="price-position">{priceText}</p>
      </div>
    </RepositionSelectPositionWrapper>
  );
};

export default RepositionSelectPosition;
