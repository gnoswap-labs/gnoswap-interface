import React from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";

import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { TokenModel } from "@models/token/token-model";

import { IPooledTokenInfo, IPriceRange } from "../../hooks/use-decrease-handle";
import DecreaseAmountPosition from "../decrease-select-position/DecreaseAmount";
import DecreaseSelectPosition from "../decrease-select-position/DecreaseSelectPosition";

import { DecreaseLiquidityWrapper } from "./DecreaseLiquidity.styles";

interface DecreaseLiquidityProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  fee: string;
  maxPriceStr: string;
  minPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
  onSubmit: () => void;
  percent: number;
  handlePercent: (value: number) => void;
  pooledTokenInfos: IPooledTokenInfo | null;
  isGetWGNOT: boolean;
  setIsGetWGNOT: () => void;
}

const DecreaseLiquidity: React.FC<DecreaseLiquidityProps> = ({
  tokenA,
  tokenB,
  fee,
  minPriceStr,
  maxPriceStr,
  rangeStatus,
  aprFee,
  priceRangeSummary,
  onSubmit,
  handlePercent,
  percent,
  pooledTokenInfos,
  isGetWGNOT,
  setIsGetWGNOT,
}) => {
  const { t } = useTranslation();

  return (
    <DecreaseLiquidityWrapper>
      <h3 className="title">{t("DecreaseLiquidity:title")}</h3>
      <article>
        <DecreaseSelectPosition
          aprFee={aprFee}
          tokenA={tokenA}
          tokenB={tokenB}
          fee={fee}
          minPriceStr={minPriceStr}
          maxPriceStr={maxPriceStr}
          rangeStatus={rangeStatus}
          priceRangeSummary={priceRangeSummary}
        />
      </article>
      <article>
        <DecreaseAmountPosition
          tokenA={tokenA}
          tokenB={tokenB}
          handlePercent={handlePercent}
          percent={percent}
          pooledTokenInfos={pooledTokenInfos}
          isGetWGNOT={isGetWGNOT}
          setIsGetWGNOT={setIsGetWGNOT}
        />
      </article>
      <Button
        onClick={onSubmit}
        text={t("DecreaseLiquidity:title")}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        className="button-confirm"
      />
    </DecreaseLiquidityWrapper>
  );
};

export default DecreaseLiquidity;
