import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useMemo } from "react";
import { HoverTextWrapper, wrapper } from "./SelectStakeResult.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useTokenData } from "@hooks/token/use-token-data";
import { formatNumberToLocaleString } from "@utils/number-utils";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { PoolModel } from "@models/pool/pool-model";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";

interface SelectStakeResultProps {
  positions: PoolPositionModel[];
  isHiddenBadge?: boolean;
  pool?: PoolModel;
}

const HOVER_TEXT =
  "The estimated APR range is calculated by applying a dynamic multiplier to your staked position, based on the staking duration.";

const SelectStakeResult: React.FC<SelectStakeResultProps> = ({
  positions,
  isHiddenBadge = false,
  pool,
}) => {
  const { tokenPrices } = useTokenData();

  const pooledTokenInfos = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce(
      (accum, position) => accum + Number(position.tokenABalance),
      0,
    );
    const pooledTokenBAmount = positions.reduce(
      (accum, position) => accum + Number(position.tokenBBalance),
      0,
    );
    const tokenAPrice = tokenPrices[tokenA.priceID]?.usd || 0;
    const tokenBPrice = tokenPrices[tokenB.priceID]?.usd || 0;
    const tokenAAmount = Number(pooledTokenAAmount) || 0;
    const tokenBAmount = Number(pooledTokenBAmount) || 0;

    const priceAEmpty =
      !tokenAPrice || positions.every(item => !item.tokenABalance);
    const priceBEmpty =
      !tokenBAmount || positions.every(item => !item.tokenBBalance);

    return [
      {
        token: tokenA,
        amount: tokenAAmount,
        amountUSD: priceAEmpty
          ? formatOtherPrice(tokenAAmount * Number(tokenAPrice), {
              isKMB: false,
            })
          : "-",
      },
      {
        token: tokenB,
        amount: tokenBAmount,
        amountUSD: priceBEmpty
          ? formatOtherPrice(tokenBAmount * Number(tokenBPrice), {
              isKMB: false,
            })
          : "-",
      },
    ];
  }, [positions, tokenPrices]);

  const totalLiquidityUSD = useMemo(() => {
    if (
      positions.length === 0 ||
      positions.every(item => !item.positionUsdValue)
    ) {
      return "-";
    }
    const totalUSDValue = positions.reduce(
      (accum, position) => accum + Number(position.positionUsdValue),
      0,
    );
    return formatOtherPrice(totalUSDValue, {
      isKMB: false,
    });
  }, [positions]);

  const stakingAPR = useMemo(() => {
    if (!pool?.stakingApr) return "-";

    if (!Number(pool?.stakingApr || 0)) return "0%";

    return `${formatRate(Number(pool?.stakingApr || 0) * 0.3)} ~ ${formatRate(
      pool?.stakingApr,
    )}`;
  }, [pool?.stakingApr]);

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
              <strong>
                {formatNumberToLocaleString(pooledTokenInfo.amount)}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
      </ul>
      <div className="result-section">
        <div className="total-amount-box">
          <h5 className="total-amount-title">Total Amount</h5>
          {!isHiddenBadge && (
            <Badge text={"21 days"} type={BADGE_TYPE.DARK_DEFAULT} />
          )}
          <span className="result-value">{totalLiquidityUSD}</span>
        </div>
        <div className="apr-box">
          <h5 className="apr-title">Staking APR</h5>
          <div className="hover-info">
            <Tooltip
              placement="top"
              FloatingContent={
                <HoverTextWrapper>{HOVER_TEXT}</HoverTextWrapper>
              }
            >
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
