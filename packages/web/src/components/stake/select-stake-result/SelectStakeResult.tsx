import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useMemo } from "react";
import { HoverTextWrapper, wrapper } from "./SelectStakeResult.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { useTokenData } from "@hooks/token/use-token-data";
import { formatNumberToLocaleString, numberToUSD } from "@utils/number-utils";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

interface SelectStakeResultProps {
  positions: PoolPositionModel[];
  isHiddenBadge?: boolean;
}

const HOVER_TEXT =
  "The estimated APR range is calculated by applying a dynamic multiplier to your staked position, based on the staking duration.";

const SelectStakeResult: React.FC<SelectStakeResultProps> = ({
  positions,
  isHiddenBadge = false,
}) => {
  const { tokenPrices } = useTokenData();

  const pooledTokenInfos = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce((accum, position) => accum + position.tokenABalance, 0n);
    const pooledTokenBAmount = positions.reduce((accum, position) => accum + position.tokenBBalance, 0n);
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;
    const tokenAAmount = makeDisplayTokenAmount(tokenA, Number(pooledTokenAAmount)) || 0;
    const tokenBAmount = makeDisplayTokenAmount(tokenB, Number(pooledTokenBAmount)) || 0;
    return [{
      token: tokenA,
      amount: tokenAAmount,
      amountUSD: numberToUSD(tokenAAmount * Number(tokenAPrice))
    }, {
      token: tokenB,
      amount: tokenBAmount,
      amountUSD: numberToUSD(tokenBAmount * Number(tokenBPrice))
    }];
  }, [positions, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (positions.length === 0) {
      return "-";
    }
    const totalUSDValue = positions.reduce((accum, position) => accum + Number(position.positionUsdValue), 0);
    return numberToUSD(totalUSDValue);
  }, [positions]);

  const stakingAPR = useMemo(() => {
    return "0%";
  }, []);

  if (positions.length === 0) return <></>;
  return (
    <div css={wrapper}>
      <ul className="pooled-section">
        {pooledTokenInfos.map((pooledTokenInfo, index) => (
          <li key={index}>
            <div className="main-info">
              <MissingLogo
                symbol={pooledTokenInfo.token.symbol}
                url={pooledTokenInfo.token.logoURI}
                width={24}
                mobileWidth={24}
              />
              <p>Pooled {pooledTokenInfo.token.symbol}</p>
              <strong>{formatNumberToLocaleString(pooledTokenInfo.amount)}</strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
      </ul>
      <div className="result-section">
        <div className="total-amount-box">
          <h5 className="total-amount-title">Total Amount</h5>
          {!isHiddenBadge && <Badge text={"21 days"} type={BADGE_TYPE.DARK_DEFAULT} />}
          <span className="result-value">{totalLiquidityUSD}</span>
        </div>
        <div className="apr-box">
          <h5 className="apr-title">Staking APR</h5>
          <div className="hover-info">
            <Tooltip placement="top" FloatingContent={<HoverTextWrapper>{HOVER_TEXT}</HoverTextWrapper>}>
              <IconInfo className="icon-info" />
            </Tooltip>
          </div>
          <span className="result-value">{stakingAPR}</span>
        </div>
      </div>
    </div>
  );
};

export default SelectStakeResult;
