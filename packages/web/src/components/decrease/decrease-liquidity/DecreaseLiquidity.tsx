import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { TokenModel } from "@models/token/token-model";
import React from "react";
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
  pooledTokenInfos: any;
  isWrap: boolean;
  setIsWrap: () => void;
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
  isWrap,
  setIsWrap,
}) => {
  return (
    <DecreaseLiquidityWrapper>
      <h3 className="title">Decrease Liquidity</h3>
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
          isWrap={isWrap}
          setIsWrap={setIsWrap}
        />
      </article>
      <Button
        onClick={onSubmit}
        text="Decrease Liquidity"
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
