import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStar from "@components/common/icons/IconStar";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { PAGE_PATH_TYPE } from "@constants/page.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { useTokenData } from "@hooks/token/use-token-data";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PositionModel } from "@models/position/position-model";
import { TokenModel } from "@models/token/token-model";
import { checkGnotPath } from "@utils/common";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import { formatUsdNumber } from "@utils/stake-position-utils";

import { Divider, QuickPoolInfoWrapper } from "./QuickPoolInfo.styles";

interface Props {
  tokenPair: string[];
  stakedPositions: PositionModel[];
  unstakedPositions: PositionModel[];
  handleClickGotoStaking: (type: PAGE_PATH_TYPE) => void;
  pool: PoolDetailModel;
  isLoadingPool: boolean;
}

const QuickPoolInfo: React.FC<Props> = ({
  tokenPair,
  stakedPositions,
  unstakedPositions,
  handleClickGotoStaking,
  pool,
  isLoadingPool,
}) => {
  const { t } = useTranslation();

  const { getGnotPath } = useGnotToGnot();
  const { tokens } = useTokenData();

  console.log(pool);

  const tokenA = useMemo(
    () =>
      pool.tokenA.path
        ? {
            ...pool.tokenA,
            ...getGnotPath(pool.tokenA),
          }
        : ({
            ...tokens.find(item => item.path === checkGnotPath(tokenPair[0])),
            ...getGnotPath(
              tokens.find(item => item.path === checkGnotPath(tokenPair[0])),
            ),
          } as TokenModel),
    [pool.tokenA, getGnotPath, tokens, tokenPair],
  );

  const tokenB = useMemo(
    () =>
      pool.tokenB.path
        ? {
            ...pool.tokenB,
            ...getGnotPath(pool.tokenB),
          }
        : ({
            ...tokens.find(item => item.path === checkGnotPath(tokenPair[1])),
            ...getGnotPath(
              tokens.find(item => item.path === checkGnotPath(tokenPair[1])),
            ),
          } as TokenModel),
    [pool.tokenB, getGnotPath, tokens, tokenPair],
  );

  const canUnstake = useMemo(() => {
    return stakedPositions.length > 0;
  }, [stakedPositions]);

  const isStakable = useMemo(() => {
    return unstakedPositions.length > 0;
  }, [unstakedPositions]);

  const liquidityValue = useMemo((): string => {
    if (isLoadingPool || !pool.tvl) return "-";

    return formatUsdNumber(
      Math.round(Number(pool.tvl)).toString(),
      undefined,
      true,
    );
  }, [isLoadingPool, pool.tvl]);

  const volumeValue = useMemo((): string => {
    if (isLoadingPool || !pool.volume24h) return "-";

    return formatUsdNumber(
      Math.round(Number(pool.volume24h)).toString(),
      undefined,
      true,
    );
  }, [isLoadingPool, pool.volume24h]);

  const feeChangedStr = useMemo((): string => {
    if (isLoadingPool) return "-";

    return formatOtherPrice(pool.feeUsd24h);
  }, [isLoadingPool, pool.feeUsd24h]);

  const rewardTokens = useMemo(() => {
    return pool?.rewardTokens.reduce((acc, current) => {
      const existToken = acc.some(item => item.path === current.path);

      if (!existToken) {
        acc.push({
          ...current,
          logoURI: getGnotPath(current).logoURI,
          symbol: getGnotPath(current).symbol,
          path: getGnotPath(current).path,
        });
      }

      return acc;
    }, [] as TokenModel[]);
  }, [getGnotPath, pool?.rewardTokens]);

  const feeApr = useMemo(() => {
    if (isLoadingPool) return "-";

    return (
      <>
        {Number(pool.feeApr) > 100 && <IconStar size={20} />}
        {formatRate(pool.feeApr)}
      </>
    );
  }, [isLoadingPool, pool.feeApr]);

  const stakingApr = useMemo(() => {
    if (isLoadingPool) return "-";

    return (
      <>
        {Number(pool.stakingApr) > 100 && <IconStar size={20} />}{" "}
        {formatRate(pool.stakingApr)}
      </>
    );
  }, [isLoadingPool, pool.stakingApr]);

  function renderPositionInfo() {
    return (
      <div className="pool-info">
        <div>
          <div className="label">{t("AddPosition:positionStat.label.tvl")}</div>
          <div className="value">{liquidityValue}</div>
        </div>
        <div>
          <div className="label">{t("AddPosition:positionStat.label.vol")}</div>
          <div className="value">{volumeValue}</div>
        </div>
        <div>
          <div className="label">
            {t("AddPosition:positionStat.label.fee24")}
          </div>
          <div className="value">{feeChangedStr}</div>
        </div>
        <div>
          <div className="label">
            {t("AddPosition:positionStat.label.feeApr")}
          </div>
          <div className="value">
            {!isLoadingPool && (
              <DoubleLogo
                left={tokenA?.logoURI || ""}
                right={tokenB?.logoURI || ""}
                size={24}
                leftSymbol={tokenA?.symbol || ""}
                rightSymbol={tokenB?.symbol || ""}
              />
            )}
            <span className="fee-apr-value">{feeApr}</span>
          </div>
        </div>
        <div>
          <div className="label">
            {t("AddPosition:positionStat.label.stakingApr")}
          </div>
          <div className="value">
            <OverlapTokenLogo tokens={rewardTokens} size={24} />
            <span className="staking-apr-value">{stakingApr}</span>
          </div>
        </div>
      </div>
    );
  }

  const renderUnstakedPosition = () => {
    return (
      isStakable &&
      !isLoadingPool && (
        <div className="unstake-info">
          <div className="title">
            <div className="label">
              {t("AddPosition:positionStat.unstaked.title")}
            </div>
            <div
              className="value"
              onClick={() => handleClickGotoStaking("POOL_STAKE")}
            >
              {t("AddPosition:positionStat.unstaked.btn")}{" "}
              <IconStrokeArrowRight />
            </div>
          </div>
          {unstakedPositions.map((item, index) => (
            <div className="content" key={index}>
              <div className="label">
                {!isLoadingPool && (
                  <OverlapTokenLogo tokens={[tokenA, tokenB]} size={24} />
                )}
                ID #{item.id}
              </div>
              <div className="value">
                {formatOtherPrice(item.positionUsdValue)}
              </div>
            </div>
          ))}
        </div>
      )
    );
  };

  const renderStakedPosition = () => {
    return (
      canUnstake &&
      !isLoadingPool && (
        <div className="stake-info">
          <div className="title">
            <div className="label">
              {t("AddPosition:positionStat.staked.title")}
            </div>
            <div
              className="value"
              onClick={() => handleClickGotoStaking("POOL_UNSTAKE")}
            >
              {t("AddPosition:positionStat.staked.btn")}{" "}
              <IconStrokeArrowRight />
            </div>
          </div>
          {stakedPositions.map((item, index) => (
            <div className="content" key={index}>
              <div className="label">
                <OverlapTokenLogo tokens={[tokenA, tokenB]} size={24} />
                ID #{item.id}
              </div>
              <div className="value">
                {formatOtherPrice(item.positionUsdValue)}
              </div>
            </div>
          ))}
        </div>
      )
    );
  };

  return (
    <QuickPoolInfoWrapper>
      <div className="token-pair">
        <OverlapTokenLogo tokens={[tokenA, tokenB]} size={24} />
        <span className="token-name">{`${tokenA?.symbol}/${tokenB?.symbol}`}</span>
      </div>
      {renderPositionInfo()}
      {(isStakable || canUnstake) && !isLoadingPool && <Divider />}
      {renderUnstakedPosition()}
      {renderStakedPosition()}
    </QuickPoolInfoWrapper>
  );
};

export default QuickPoolInfo;
