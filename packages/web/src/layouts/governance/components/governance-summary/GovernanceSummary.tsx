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
import { GovernanceSummaryWrapper, GovernanceSummaryTooltipContent } from "./GovernanceSummary.styles";
import { Divider } from "@components/common/divider/divider";
import { toNumberFormat } from "@utils/number-utils";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

interface GovernanceSummaryProps {
  governanceSummary: GovernanceSummaryInfo;
  isLoading: boolean;
}

const GovernanceSummary: React.FC<GovernanceSummaryProps> = ({ governanceSummary, isLoading }) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  /**
   * A delimiter showing total delegated information.
   * @returns {boolean} A boolean value indicating whether to show the total delegated information.
   */
  const visibleTotalDelegateTooltip = React.useMemo(() => {
    return governanceSummary.totalDelegated > 0;
  }, [governanceSummary]);
  /**
   * A delimiter showing community pool information.
   * @returns {boolean} A boolean value indicating whether to show the community pool information.
   */
  const visibleCommunityPoolTooltip = React.useMemo(() => {
    // return governanceSummary.communityPool > 0;

    // Todo: API is not returning community pool information.
    return false;
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
                <GovernanceSummaryTooltipContent>
                  <div className="row">
                    <div className="label">
                      <span>{t("Governance:summary.tooltip.totalDelegated.governanceSupply")}</span>
                    </div>
                    <div className="value">
                      <div className="key">{t("Governance:summary.tooltip.totalDelegated.delegatedGNS")}</div>
                      <div className="amount">
                        <MissingLogo symbol={GNS_TOKEN.symbol} width={20} url={GNS_TOKEN.logoURI} />
                        {formatOtherPrice(governanceSummary.governanceDelegated, {
                          isKMB: false,
                          usd: false,
                          decimals: 0,
                        })}
                      </div>
                    </div>
                  </div>
                  <Divider className="divider" />
                  <div className="row">
                    <div className="label">
                      <span>{t("Governance:summary.tooltip.totalDelegated.launchpadSupply")}</span>
                      <span>{t("Governance:summary.tooltip.totalDelegated.nonVotable")}</span>
                    </div>
                    <div className="value">
                      <div className="key">{t("Governance:summary.tooltip.totalDelegated.participatedGNS")}</div>
                      <div className="amount">
                        <MissingLogo symbol={GNS_TOKEN.symbol} width={20} url={GNS_TOKEN.logoURI} />
                        {formatOtherPrice(governanceSummary.launchpadDelegated, {
                          isKMB: false,
                          usd: false,
                          decimals: 0,
                        })}
                      </div>
                    </div>
                  </div>
                </GovernanceSummaryTooltipContent>
              }
            >
              <div className={visibleTotalDelegateTooltip ? "value-wrapper-for-hover" : "value-wrapper"}>
                {formatOtherPrice(governanceSummary.totalDelegated, {
                  isKMB: false,
                  usd: false,
                  decimals: 0,
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
          value={
            <Tooltip
              forcedClose={!visibleCommunityPoolTooltip}
              placement="top"
              FloatingContent={
                <GovernanceSummaryTooltipContent>
                  <div className="row">
                    <div className="label">
                      <span>{t("Governance:summary.tooltip.communityPool.title")}</span>
                      <span>${toNumberFormat(governanceSummary.communityPool, 2)}</span>
                    </div>
                    <div className="value">
                      <div className="key">
                        <MissingLogo symbol="EXA" width={20} />
                        <span>tokenSymbol</span>
                      </div>
                      <div className="amount"></div>
                    </div>
                    <div className="value">
                      <div className="key">
                        <MissingLogo symbol="EXA" width={20} />
                        <span>tokenSymbol</span>
                      </div>
                      <div className="amount"></div>
                    </div>
                  </div>
                </GovernanceSummaryTooltipContent>
              }
            >
              <div className={visibleCommunityPoolTooltip ? "value-wrapper-for-hover" : "value-wrapper"}>
                {formatOtherPrice(governanceSummary.communityPool, {
                  isKMB: false,
                })}
              </div>
            </Tooltip>
          }
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
