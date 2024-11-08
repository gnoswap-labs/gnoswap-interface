import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { EXT_URL } from "@constants/external-url.contant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { GovernanceSummaryInfo } from "@repositories/governance";

import InfoBox from "../info-box/InfoBox";
import TokenChip from "../token-chip/TokenChip";
import Tooltip from "@components/common/tooltip/Tooltip";

import { formatOtherPrice } from "@utils/new-number-utils";
import {
  GovernanceSummaryWrapper,
  TotalDelegatedTooltipContent,
} from "./GovernanceSummary.styles";
import { Divider } from "@components/common/divider/divider";

interface GovernanceSummaryProps {
  governanceSummary: GovernanceSummaryInfo;
  isLoading: boolean;
}

const GovernanceSummary: React.FC<GovernanceSummaryProps> = ({
  governanceSummary,
  isLoading,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  const visibleTotalDelegateTooltip = React.useMemo(() => {
    return governanceSummary.totalDelegated > 0;
  }, [governanceSummary]);

  return (
    <GovernanceSummaryWrapper>
      <div className="info-wrapper">
        <InfoBox
          title={t("Governance:summary.totalDel.title")}
          value={
            <Tooltip
              forcedClose={!visibleTotalDelegateTooltip}
              placement="top"
              FloatingContent={
                <TotalDelegatedTooltipContent>
                  <div className="row">
                    <div className="label">
                      <span>
                        {t(
                          "Governance:summary.tooltip.totalDelegated.governanceSupply",
                        )}
                      </span>
                    </div>
                    <div className="value">
                      <div className="key">
                        {t(
                          "Governance:summary.tooltip.totalDelegated.delegatedGNS",
                        )}
                      </div>
                      <div className="amount"></div>
                    </div>
                  </div>
                  <Divider className="divider" />
                  <div className="row">
                    <div className="label">
                      <span>
                        {t(
                          "Governance:summary.tooltip.totalDelegated.launchpadSupply",
                        )}
                      </span>
                      <span>
                        {t(
                          "Governance:summary.tooltip.totalDelegated.nonVotable",
                        )}
                      </span>
                    </div>
                    <div className="value">
                      <div className="key">
                        {t(
                          "Governance:summary.tooltip.totalDelegated.participatedGNS",
                        )}
                      </div>
                      <div className="amount"></div>
                    </div>
                  </div>
                </TotalDelegatedTooltipContent>
              }
            >
              <div
                className={
                  visibleTotalDelegateTooltip
                    ? "value-wrapper-for-hover"
                    : "value-wrapper"
                }
              >
                {formatOtherPrice(governanceSummary.totalDelegated, {
                  isKMB: false,
                  usd: false,
                })}
                <TokenChip tokenInfo={GNS_TOKEN} />
              </div>
            </Tooltip>
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
          title={t("Governance:summary.apr.title")}
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
      {!isMobile && (
        <div className="link-button">
          <div>{t("Governance:summary.guide.guide")}</div>
          <Link href={EXT_URL.DOCS.XGNS} target="_blank">
            {t("common:learnMore")}
            <IconStrokeArrowRight className="link-icon" />
          </Link>
        </div>
      )}
    </GovernanceSummaryWrapper>
  );
};

export default GovernanceSummary;
