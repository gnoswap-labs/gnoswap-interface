import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React, { useMemo } from "react";
import { HoverTextWrapper, wrapper } from "./SelectStakeResult.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { PoolModel } from "@models/pool/pool-model";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import { useStakeData } from "@hooks/stake/use-stake-data";

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
  const { pooledTokenInfos } = useStakeData({ positions });

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
              <strong>{pooledTokenInfo.amountUSD}</strong>
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
