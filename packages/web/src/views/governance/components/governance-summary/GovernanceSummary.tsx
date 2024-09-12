import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { EXT_URL } from "@constants/external-url.contant";
import { GovernanceSummaryInfo } from "@repositories/governance";

import InfoBox from "../info-box/InfoBox";
import TokenChip from "../token-chip/TokenChip";

import { GovernanceSummaryWrapper } from "./GovernanceSummary.styles";
import { formatOtherPrice } from "@utils/new-number-utils";

interface GovernanceSummaryProps {
  governanceSummary: GovernanceSummaryInfo;
  isLoading: boolean;
}

const GovernanceSummary: React.FC<GovernanceSummaryProps> = ({
  governanceSummary,
  isLoading,
}) => {
  const { t } = useTranslation(); 
  
  return (
    <GovernanceSummaryWrapper>
      <div className="info-wrapper">
        <InfoBox
          title={t("Governance:summary.totalDel.title")}
          value={
            <>
              {formatOtherPrice(governanceSummary.totalDelegated, {
                isKMB: false,
                usd: false,
              })}
              <TokenChip tokenInfo={GNS_TOKEN} />
            </>
          }
          tooltip={t("Governance:summary.totalDel.tooltip")}
          isLoading={isLoading}
        />
        <InfoBox
          title={t("Governance:summary.delRatio.title")}
          value={`${formatOtherPrice(governanceSummary.delegatedRatio, {
            isKMB: false,
            usd: false,
          })}%`}
          tooltip={t("Governance:summary.delRatio.tooltip")}
          isLoading={isLoading}
        />
        <InfoBox
          title={t("Governance:summary.apy.title")}
          value={`${formatOtherPrice(governanceSummary.apy, {
            isKMB: false,
            usd: false,
          })}%`}
          tooltip={t("Governance:summary.apy.tooltip")}
          isLoading={isLoading}
        />
        <InfoBox
          title={t("Governance:summary.commPool.title")}
          value={formatOtherPrice(governanceSummary.communityPool, {
            isKMB: false,
          })}
          tooltip={t("Governance:summary.commPool.tooltip")}
          isLoading={isLoading}
        />
      </div>
      <div className="link-button">
        <div>{t("Governance:summary.guide.guide")}</div>
        <Link href={EXT_URL.DOCS.XGNS} target="_blank">
          {t("Governance:summary.guide.link")}
          <IconStrokeArrowRight className="link-icon" />
        </Link>
      </div>
    </GovernanceSummaryWrapper>
  );};

export default GovernanceSummary;
