import React from "react";
import Link from "next/link";
import { useTranslation, Trans } from "react-i18next";
import { css } from "@emotion/react";

import { ExtendedPoolStakingModel } from "@models/pool/pool-staking";
import { capitalize } from "@utils/string-utils";
import { useGetPoolDetailByPath } from "@query/pools";
import { getDateUtcToLocal } from "@common/utils/date-util";
import { toNumberFormat } from "@utils/number-utils";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { GNS_TOKEN } from "@common/values/token-constant";

import { IncentivizePoolHistoryBoxWrapper, historyTooltipContent } from "./IncentivizePoolHistoryBox.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { useRemoveExternalIncentive } from "@query/pools/use-remove-external-incentive";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

interface IncentivizePoolHistoryBoxProps {
  stakingData: ExtendedPoolStakingModel;
  poolPath: string;
}

const IncentivizePoolHistoryBox = ({ stakingData, poolPath }: IncentivizePoolHistoryBoxProps) => {
  const { t } = useTranslation();
  const { rpcProvider } = useGnoswapContext();

  const { rewardToken, startTimestamp, endTimestamp } = stakingData;

  const { data: pool = null } = useGetPoolDetailByPath(poolPath, {
    enabled: !!poolPath,
  });

  const { removeExternalIncentive } = useRemoveExternalIncentive(poolPath, rewardToken, startTimestamp, endTimestamp);

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

  const formatAmount = (amount: string | null) => {
    if (amount == null || amount === "") return "-";

    return toNumberFormat(Number(makeDisplayTokenAmount(GNS_TOKEN, amount)), GNS_TOKEN.decimals);
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
                <span css={tooltipConent}>
                  <Trans
                    ns="IncentivizePool"
                    components={{ br: <br /> }}
                    i18nKey={"incentiPool.history.tooltip.incentivizedAmount"}
                  />
                </span>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {toNumberFormat(stakingData.incentivizedAmount, 6)} {rewardToken.symbol}
          </div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.remainingAmount")}
            <Tooltip
              FloatingContent={
                <span css={tooltipConent}>
                  <Trans
                    ns="IncentivizePool"
                    components={{ br: <br /> }}
                    i18nKey={"incentiPool.history.tooltip.remainingAmount"}
                  />
                </span>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {toNumberFormat(stakingData.distributableAmount, 6)} {rewardToken.symbol}
          </div>
        </div>
        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.unvestedAmount")}
            <Tooltip
              FloatingContent={
                <span css={historyTooltipContent}>
                  <Trans
                    className="test"
                    ns="IncentivizePool"
                    components={{
                      br: <br />,
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
          <div className="value">-</div>
        </div>

        <div className="row">
          <div className="label">
            {t("IncentivizePool:incentiPool.history.label.depositAmount")}
            <Tooltip
              FloatingContent={
                <span css={tooltipConent}>
                  <Trans
                    ns="IncentivizePool"
                    components={{ br: <br /> }}
                    i18nKey={"incentiPool.history.tooltip.depositAmount"}
                  />
                </span>
              }
              placement="top"
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {formatAmount(stakingData.depositGnsAmount)} {GNS_TOKEN.symbol}
          </div>
        </div>

        {isClaimableTime && (
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

const tooltipConent = css`
  font-size: 14px;
`;

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
