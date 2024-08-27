import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { EXT_URL } from "@constants/external-url.contant";
import { GovernanceSummaryInfo } from "@repositories/governance";

import GovernanceDetailInfo from "./governance-detail-info/GovernanceDetailInfo";

import { GovernanceSummaryWrapper, TokenChip } from "./GovernanceSummary.styles";
import { GNS_TOKEN } from "@common/values/token-constant";

interface GovernanceDetailProps {
  governanceSummary: GovernanceSummaryInfo;
  isLoading: boolean;
}

const GovernanceSummary: React.FC<GovernanceDetailProps> = ({
  governanceSummary,
  isLoading,
}) => {
  const {t} = useTranslation(); 
  
  return (
    <GovernanceSummaryWrapper>
      <div className="info-wrapper">
        <GovernanceDetailInfo
          title={t("Governance:summary.totalDel.title")}
          value={
            <>
              {governanceSummary.totalDeligated.toLocaleString("en")}
              <TokenChip>
                <MissingLogo symbol="GNS" url={GNS_TOKEN.logoURI} width={24} />
                GNS
              </TokenChip>
            </>
          }
          tooltip={t("Governance:summary.totalDel.tooltip")}
          isLoading={isLoading}
        />
        <GovernanceDetailInfo
          title={t("Governance:summary.delRatio.title")}
          value={`${governanceSummary.DeligatedRatio.toString()}%`}
          tooltip={t("Governance:summary.delRatio.tooltip")}
          isLoading={isLoading}
        />
        <GovernanceDetailInfo
          title={t("Governance:summary.apy.title")}
          value={`${governanceSummary.apy.toString()}%`}
          tooltip={t("Governance:summary.apy.tooltip")}
          isLoading={isLoading}
        />
        <GovernanceDetailInfo
          title={t("Governance:summary.commPool.title")}
          value={`$${governanceSummary.communityPool.toLocaleString("en")}`}
          tooltip={t("Governance:summary.commPool.tooltip")}
          isLoading={isLoading}
        />
      </div>
      <div className="link-button">
        <div>{t("Governance:summary.guide.guide")}</div>
        <Link href={EXT_URL.DOCS.GOVERNANCE} target="_blank">
          {t("Governance:summary.guide.link")}
          <IconStrokeArrowRight className="link-icon" />
        </Link>
      </div>
    </GovernanceSummaryWrapper>
  );};

export default GovernanceSummary;
