/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cx } from "@emotion/css";
import { useAtomValue } from "jotai";
import { Trans, useTranslation } from "react-i18next";

import { LaunchpadState } from "@states/index";
import { getTierDuration } from "@utils/launchpad-get-tier-number";
import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "@layouts/launchpad/launchpad-detail/LaunchpadDetail";
import { toNumberFormat } from "@utils/number-utils";
import { getClaimableDays } from "@utils/launchpad-get-claimable";

import { Divider } from "@components/common/divider/divider";
import { CardWrapper } from "./LaunchpadPoolListCard.styles";
import LaunchpadPoolTierChip from "@layouts/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import DepositConditionsTooltip from "@components/common/launchpad-tooltip/deposit-conditions-tooltip/DepositConditionsTooltip";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN } from "@common/values/token-constant";
import { formatRate } from "@utils/new-number-utils";

interface LaunchpadPoolListCardProps {
  data: LaunchpadPoolModel;
  idx: number;
  rewardInfo: ProjectRewardInfoModel;

  selectProjectPool: (poolId: number) => void;
}

const LaunchpadPoolListCard: React.FC<LaunchpadPoolListCardProps> = ({ data, idx, rewardInfo, selectProjectPool }) => {
  const { t } = useTranslation();

  const isShowConditionTooltip = useAtomValue(LaunchpadState.isShowConditionTooltip);
  const currentPoolId = useAtomValue(LaunchpadState.selectLaunchpadPool);

  const isActiveCard = React.useMemo(() => {
    return currentPoolId === data.id;
  }, [currentPoolId, data.id]);

  const aprStr = data.apr ? (
    <>
      {Number(data.apr) > 100 && "✨"}
      {formatRate(data.apr)} APR
    </>
  ) : (
    "-"
  );

  return (
    <CardWrapper
      className={cx({
        active: isActiveCard,
        ongoing: data.status === "ONGOING",
      })}
      onClick={() => {
        if (data.status === "ONGOING") {
          selectProjectPool(data.id);
        }
      }}
    >
      <div className="card-header">
        <div className="card-header-title">
          <span className="title">{t("Launchpad:poolList.title", { idx: idx })}</span>
          <div className="flex-section">
            <LaunchpadPoolTierChip poolTier={data.poolTier} />
            {data.status === "ENDED" && <div className="chip">{t("Launchpad:common.ended")}</div>}
          </div>
        </div>
        {isActiveCard && isShowConditionTooltip && <DepositConditionsTooltip />}
      </div>

      <div className="card-description">
        <Trans
          ns="Launchpad"
          i18nKey={"poolList.description"}
          components={{ br: <br /> }}
          values={{
            month: getTierDuration(data.poolTier, t, false),
            day: getClaimableDays(data.poolTier),
          }}
        />
      </div>

      <Divider />

      <div className="data">
        <div className="key">{t("Launchpad:poolList.col.participants")}</div>
        <div className={cx("value", { ended: data.status === "ENDED" })}>{data.participant || "-"}</div>
      </div>
      <div className="data">
        <div className="key">{t("Launchpad:poolList.col.apr")}</div>
        <div className={cx("value", { ended: data.status === "ENDED" })}>{aprStr}</div>
      </div>
      <div className="data">
        <div className="key">{t("Launchpad:poolList.col.totalDeposits")}</div>
        <div className={cx("value", { ended: data.status === "ENDED" })}>
          <img className="token-image" src="/gns.svg" alt={"GNS symbol image"} />
          {data.depositAmount ? `${toNumberFormat(data.depositAmount, 2)} ${LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN}` : "-"}
        </div>
      </div>
      <div className="data">
        <div className="key">{t("Launchpad:poolList.col.tokensDistributed")}</div>
        <div className={cx("value", { ended: data.status === "ENDED" })}>
          <MissingLogo
            symbol={rewardInfo.rewardTokenSymbol}
            url={rewardInfo.rewardTokenLogoURL}
            width={24}
            mobileWidth={24}
          />
          {data.distributedAmount ? `${toNumberFormat(data.distributedAmount, 2)}` : "-"} /{" "}
          {data.allocation ? `${toNumberFormat(data.allocation, 2)}` : "-"}
        </div>
      </div>
    </CardWrapper>
  );
};

export default LaunchpadPoolListCard;
