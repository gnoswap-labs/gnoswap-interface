import React, { useMemo } from "react";
import {
  GnotCollectSwitchWrapper,
  RemoveLiquiditySelectResultWrapper,
} from "./RemoveLiquiditySelectResult.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { Divider } from "@components/common/divider/divider";
import Switch from "@components/common/switch/Switch";
import { GNOT_TOKEN } from "@common/values/token-constant";
import { formatPoolPairAmount } from "@utils/new-number-utils";
import { useTranslation } from "react-i18next";
import { usePositionsRewards } from "@hooks/position/use-positions-rewards";

interface RemoveLiquiditySelectResultProps {
  positions: PoolPositionModel[];
  isWrap: boolean;
  setIsWrap: () => void;
}

const RemoveLiquiditySelectResult: React.FC<
  RemoveLiquiditySelectResultProps
> = ({ positions, isWrap, setIsWrap }) => {
  const { t } = useTranslation();

  const { pooledTokenInfos, unclaimedFees, totalLiquidityUSD } =
    usePositionsRewards({ positions });

  const hasGnotToken = useMemo(() => {
    const anyGnotPooledToken = pooledTokenInfos.some(
      item => item.token.path === GNOT_TOKEN.path,
    );
    const anyGnotUnclaimedToken = unclaimedFees.some(
      item => item.token.path === GNOT_TOKEN.path,
    );

    return anyGnotPooledToken || anyGnotUnclaimedToken;
  }, [pooledTokenInfos, unclaimedFees]);

  if (positions.length === 0) return <></>;

  return (
    <RemoveLiquiditySelectResultWrapper>
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
              <p>
                {t("RemovePosition:overview.pooled")}{" "}
                {pooledTokenInfo.token.symbol}
              </p>
              <strong>
                {formatPoolPairAmount(pooledTokenInfo.amount, {
                  decimals: pooledTokenInfo.token.decimals,
                })}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
        {unclaimedFees.map((pooledTokenInfo, index) => (
          <li key={index}>
            <div className="main-info">
              <MissingLogo
                symbol={pooledTokenInfo.token.symbol}
                url={pooledTokenInfo.token.logoURI}
                width={24}
                mobileWidth={24}
              />
              <p>
                {t("RemovePosition:overview.unclaimed")}{" "}
                {pooledTokenInfo.token.symbol}
              </p>
              <strong>
                {formatPoolPairAmount(pooledTokenInfo.amount, {
                  decimals: pooledTokenInfo.token.decimals,
                })}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
        {hasGnotToken && (
          <>
            <Divider />
            <GnotCollectSwitchWrapper>
              <div>{t("RemovePosition:overview.collectAsSwitch")}</div>
              <Switch checked={isWrap} onChange={setIsWrap} />
            </GnotCollectSwitchWrapper>
          </>
        )}
      </ul>
      <div className="total-section">
        <h5>{t("RemovePosition:overview.totalAmt")}</h5>
        <span className="total-value">{totalLiquidityUSD}</span>
      </div>
    </RemoveLiquiditySelectResultWrapper>
  );
};

export default RemoveLiquiditySelectResult;
