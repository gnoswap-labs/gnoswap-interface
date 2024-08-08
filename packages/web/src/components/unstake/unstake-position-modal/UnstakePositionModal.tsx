import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconClose from "@components/common/icons/IconCancel";
import { useUnstakeData } from "@hooks/stake/use-unstake-data";
import { PoolPositionModel } from "@models/position/pool-position-model";
import React, { useCallback, useMemo } from "react";
import {
  Divider,
  RewardLogoSymbolWrapper,
  ToolTipContentWrapper,
  UnstakePositionModalWrapper,
  UnstakeWarningContentWrapper,
} from "./UnstakePositionModal.styles";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import WarningCard from "@components/common/warning-card/WarningCard";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import { useGetUnstakingFee } from "@query/pools";
import {
  formatOtherPrice,
  formatPoolPairAmount,
  formatRate,
} from "@utils/new-number-utils";
import { Trans, useTranslation } from "react-i18next";
import { isInRangePosition } from "@utils/stake-position-utils";
import RangeBadge from "@components/common/range-badge/RangeBadge";

interface Props {
  positions: PoolPositionModel[];
  close: () => void;
  onSubmit: () => void;
}

const UnstakePositionModal: React.FC<Props> = ({
  positions,
  close,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { unclaimedRewards, totalLiquidityUSD } = useUnstakeData({ positions });
  const { data: unstakingFee } = useGetUnstakingFee();
  const onClickClose = useCallback(() => {
    close();
  }, [close]);

  const currentPercent = useMemo(() => {
    const result =
      positions
        .flatMap(({ reward, usdValue }) =>
          reward.map(item => ({ ...item, usdValue: usdValue })),
        )
        .reduce(
          (acc, current) => {
            return {
              unstakeUsd:
                acc.unstakeUsd +
                Number(current.apr || 0) * Number(current.usdValue),
              allUsd: acc.allUsd + current.usdValue,
            };
          },
          {
            unstakeUsd: 0,
            allUsd: 0,
          },
        ) ?? 0;

    return formatRate(result.unstakeUsd / result.allUsd);
  }, [positions]);

  const swapFeePercent = useMemo(() => {
    const result =
      positions
        .flatMap(({ reward, usdValue }) =>
          reward
            .map(item => ({ ...item, usdValue: usdValue }))
            .filter(item => item.rewardType === "SWAP_FEE"),
        )
        .reduce(
          (acc, current) => {
            return {
              unstakeUsd:
                acc.unstakeUsd +
                Number(current.apr || 0) * Number(current.usdValue),
              allUsd: acc.allUsd + current.usdValue,
            };
          },
          {
            unstakeUsd: 0,
            allUsd: 0,
          },
        ) ?? 0;

    return formatRate(result.unstakeUsd / result.allUsd);
  }, [positions]);

  const inRange = useCallback(
    (position: PoolPositionModel) => isInRangePosition(position),
    [],
  );

  return (
    <UnstakePositionModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>{t("UnstakePosition:confStakeModal.title")}</h6>
          <div className="close-wrap" onClick={onClickClose}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="box-item">
            <h4>{t("UnstakePosition:confStakeModal.positionLst")}</h4>
            <div className="item-content">
              {positions.map((position, index) => (
                <div key={index}>
                  <div className="label-logo">
                    <DoubleLogo
                      left={position.pool.tokenA.logoURI}
                      right={position.pool.tokenB.logoURI}
                      size={24}
                      leftSymbol={position.pool.tokenA.symbol}
                      rightSymbol={position.pool.tokenB.symbol}
                    />
                    <div>{`${position.pool.tokenA.symbol}/${position.pool.tokenB.symbol}`}</div>
                    <Badge
                      className="unstake-bar"
                      type={BADGE_TYPE.DARK_DEFAULT}
                      text={`${Number(position.pool.fee) / 10000}%`}
                    />
                    <RangeBadge status={inRange(position) ? "IN" : "OUT"} />
                  </div>
                  <div className="value">
                    {formatOtherPrice(position.positionUsdValue, {
                      isKMB: false,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {unclaimedRewards.length > 0 && (
            <div className="box-item box-item-unclaim">
              <h4>{t("UnstakePosition:confStakeModal.unclaimedReward")}</h4>
              <div className="item-content">
                {unclaimedRewards.map((rewardInfo, index) => (
                  <div key={index} className="item-detail">
                    <div className="item-detail-wrapper">
                      <div className="label-logo">
                        <MissingLogo
                          className="image-logo"
                          symbol={rewardInfo.token.symbol}
                          url={rewardInfo.token.logoURI}
                          width={24}
                          mobileWidth={24}
                        />
                        <RewardLogoSymbolWrapper>
                          {rewardInfo.token.symbol}
                        </RewardLogoSymbolWrapper>
                      </div>
                      <div className="value">
                        {formatPoolPairAmount(rewardInfo.amount, {
                          decimals: rewardInfo.token.decimals,
                          isKMB: false,
                        })}
                      </div>
                    </div>
                    <div className="sub-value">{rewardInfo.amountUSD}</div>
                  </div>
                ))}
                <div className="protocal-wrapper">
                  <Divider />
                  <div className="protocol">
                    <div>
                      <span className="">{t("business:protocolFee.txt")}</span>
                      <Tooltip
                        placement="top"
                        FloatingContent={
                          <ToolTipContentWrapper width="251px">
                            {t("business:protocolFee.desc")}
                          </ToolTipContentWrapper>
                        }
                      >
                        <IconInfo />
                      </Tooltip>
                    </div>
                    <span className="white-text">
                      {unstakingFee ? `${(unstakingFee || 0) / 100}%` : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <Divider />
          <div className="box-item">
            <div className="item-content">
              <div>
                <div className="label-large">
                  {t("UnstakePosition:confStakeModal.totalAmt")}
                </div>
                <div className="value-large">{totalLiquidityUSD}</div>
              </div>
            </div>
          </div>
          <WarningCard
            title={t("UnstakePosition:confStakeModal.warning.title")}
            icon={<IconCircleExclamationMark />}
            content={
              <UnstakeWarningContentWrapper>
                <Trans
                  ns="UnstakePosition"
                  i18nKey="confStakeModal.warning.content"
                  components={{span: <span className="unstake-percent"/>}}
                  values={{
                    currentPercent,
                    swapFeePercent,
                  }}
                />
              </UnstakeWarningContentWrapper>
            }
          />
          <div>
            <Button
              text={t("UnstakePosition:confStakeModal.btn")}
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fullWidth: true,
              }}
              className="button-confirm"
              onClick={onSubmit}
            />
          </div>
        </div>
      </div>
    </UnstakePositionModalWrapper>
  );
};

export default UnstakePositionModal;
