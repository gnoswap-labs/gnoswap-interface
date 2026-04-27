import Link from "next/link";
import React from "react";
import { Trans, useTranslation } from "react-i18next";

import { getDateUtcToLocal } from "@common/utils/date-util";
import { GNS_TOKEN } from "@common/values/token-constant";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { ExtendedPoolStakingModel } from "@models/pool/pool-staking";
import { useGetPoolDetailByPath } from "@query/pools";
import { toNumberFormat } from "@utils/number-utils";
import { capitalize } from "@utils/string-utils";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconInfo from "@components/common/icons/IconInfo";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRemoveExternalIncentive } from "@query/pools/use-remove-external-incentive";
import { historyTooltipContent, IncentivizePoolHistoryBoxWrapper } from "./IncentivizePoolHistoryBox.styles";

interface IncentivizePoolHistoryBoxProps {
  stakingData: ExtendedPoolStakingModel;
  poolPath: string;
}

const IncentivizePoolHistoryBox = ({ stakingData, poolPath }: IncentivizePoolHistoryBoxProps) => {
  const { t } = useTranslation();
  const { rpcProvider } = useGnoswapContext();

  const { rewardToken, incentiveId } = stakingData;

  const { data: pool = null } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });

  const { removeExternalIncentive } = useRemoveExternalIncentive(poolPath, incentiveId ?? "");

  const currentPool = React.useMemo(() => {
    const temp = pool ? PoolMapper.toPoolSelectItemInfo(pool) : null;
    return temp;
  }, [pool]);

  const isSelected = currentPool != null;

  const doubleLogos = React.useMemo(() => {
    if (!isSelected) {
      return { left: "", right: "" };
    }
    return {
      left: currentPool.tokenA.logoURI,
      right: currentPool.tokenB.logoURI,
      leftSymbol: currentPool.tokenA.symbol,
      rightSymbol: currentPool.tokenB.symbol,
    };
  }, [currentPool, isSelected]);

  const feeRateStr = React.useMemo(() => {
    return currentPool?.feeRate ? currentPool.feeRate : "-";
  }, [currentPool]);

  const formatAmount = (amount: string | null, decimals: number = GNS_TOKEN.decimals) => {
    if (amount == null || amount === "") return "-";

    return toNumberFormat(amount, decimals);
  };

  const isClaimableTime = React.useMemo(() => {
    const endDate = new Date(stakingData.endTimestamp);
    const now = new Date();
    return now > endDate;
  }, [stakingData]);

  const renderDataMapping = () => {
    return (
      <>
        <div className="row">
          <div className="label">{t("IncentivizePool:incentiPool.history.label.token")}</div>
          <div className="value">
            <MissingLogo symbol={rewardToken.symbol} width={24} url={rewardToken.logoURI} />
            <span>{rewardToken.symbol}</span>
            <Chip text={capitalize(stakingData.incentiveType)} />
          </div>
        </div>
        <div className="row">
          <div className="label">{t("IncentivizePool:incentiPool.history.label.pool")}</div>
          <div className="value">
            <DoubleLogo {...doubleLogos} size={24} />
            <span>
              {doubleLogos.leftSymbol}/{doubleLogos.rightSymbol}
            </span>
            <Chip text={feeRateStr} height={24} />
          </div>
        </div>
        <div className="row">
          <div className="label">{t("IncentivizePool:incentiPool.history.label.startDate")}</div>
          <div className="value">{getDateUtcToLocal(stakingData.startTimestamp).value}</div>
        </div>
        <div className="row">
          <div className="label">{t("IncentivizePool:incentiPool.history.label.endDate")}</div>
          <div className="value">{getDateUtcToLocal(stakingData.endTimestamp).value}</div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.incentivizedAmount")}
            <Tooltip
              FloatingContent={
                <span css={historyTooltipContent}>
                  {t("IncentivizePool:incentiPool.history.tooltip.incentivizedAmount")}
                </span>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {formatAmount(stakingData.incentivizedAmount, rewardToken.decimals)} {rewardToken.symbol}
          </div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.remainingAmount")}
            <Tooltip
              FloatingContent={
                <span css={historyTooltipContent}>
                  {t("IncentivizePool:incentiPool.history.tooltip.remainingAmount")}
                </span>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {formatAmount(stakingData.remainingAmount, rewardToken.decimals)} {rewardToken.symbol}
          </div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.unvestedAmount")}
            <Tooltip
              FloatingContent={
                <span css={historyTooltipContent}>
                  <Trans
                    ns="IncentivizePool"
                    components={{
                      link: (
                        <Link
                          href="https://docs.gnoswap.io/core-concepts/liquidity-mining#warm-up-periods"
                          target="_blank"
                        >
                          <IconOpenLink />
                        </Link>
                      ),
                    }}
                    i18nKey={"incentiPool.history.tooltip.unvestedAmount"}
                  />
                </span>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {formatAmount(stakingData.unvestedAmount, rewardToken.decimals)} {rewardToken.symbol}
          </div>
        </div>

        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.claimableUnvestedAmount")}
            <Tooltip
              FloatingContent={
                <span css={historyTooltipContent}>
                  {t("IncentivizePool:incentiPool.history.tooltip.claimableUnvestedAmount")}
                </span>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {formatAmount(stakingData.claimableUnvestedAmount, rewardToken.decimals)} {rewardToken.symbol}
          </div>
        </div>

        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.depositAmount")}
            <Tooltip
              FloatingContent={
                <span css={historyTooltipContent}>
                  {t("IncentivizePool:incentiPool.history.tooltip.depositAmount")}
                </span>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {formatAmount(stakingData.depositGnsAmount, GNS_TOKEN.decimals)} {GNS_TOKEN.symbol}
          </div>
        </div>

        {isClaimableTime && !!incentiveId && (
          <div className="button-wrapper">
            <Button
              text={"Claim"}
              style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
              onClick={() => removeExternalIncentive({ rpcProvider })}
            />
          </div>
        )}
      </>
    );
  };

  return <IncentivizePoolHistoryBoxWrapper>{renderDataMapping()}</IncentivizePoolHistoryBoxWrapper>;
};

interface ChipProps {
  text: string;
  height?: number;
}

const Chip = ({ text, height }: ChipProps) => {
  return (
    <div className="chip" style={{ height: height ? height : "none" }}>
      {text}
    </div>
  );
};

export default IncentivizePoolHistoryBox;
