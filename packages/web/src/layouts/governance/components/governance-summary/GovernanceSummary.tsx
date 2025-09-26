import React from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { GovernanceSummaryInfo, TokenBalance } from "@repositories/governance";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";

import InfoBox from "../info-box/InfoBox";
import TokenChip from "../token-chip/TokenChip";
import Tooltip from "@components/common/tooltip/Tooltip";

import { formatOtherPrice } from "@utils/new-number-utils";
import { GovernanceSummaryWrapper, GovernanceSummaryTooltipContent } from "./GovernanceSummary.styles";
import { Divider } from "@components/common/divider/divider";
import { rawToDisplayAmount, toNumberFormat } from "@utils/number-utils";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import VideoGuideTrigger from "@components/common/video-guide-trigger/VideoGuideTrigger";

export interface DisplayCommunityPoolBalance {
  amount: number;
  usdValue: number;
  tokenInfo: TokenModel | null;
}

interface GovernanceSummaryProps {
  governanceSummary: GovernanceSummaryInfo;
  governanceCommunityPoolBalances: TokenBalance[];
  isLoading: boolean;
  onOpenVideoGuide: (type: "GOVERNANCE") => void;
}

const GovernanceSummary: React.FC<GovernanceSummaryProps> = ({
  governanceSummary,
  governanceCommunityPoolBalances,
  isLoading,
  onOpenVideoGuide,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  const { getGnotPath } = useGnotToGnot();
  const { getTokenUSDPrice, tokens } = useTokenData();

  const displayGovernanceSummary: GovernanceSummaryInfo = React.useMemo(() => {
    const { delegationInfo } = governanceSummary;
    const GNS_TOKEN_DECIMALS = GNS_TOKEN.decimals;

    return {
      ...governanceSummary,
      delegationInfo: {
        totalDelegationAmount: String(rawToDisplayAmount(delegationInfo.totalDelegationAmount, GNS_TOKEN_DECIMALS)),
        governanceDelegationAmount: String(
          rawToDisplayAmount(delegationInfo.governanceDelegationAmount, GNS_TOKEN_DECIMALS),
        ),
        launchpadDelegationAmount: String(
          rawToDisplayAmount(delegationInfo.launchpadDelegationAmount, GNS_TOKEN_DECIMALS),
        ),
      },
    };
  }, [governanceSummary]);

  const delegationinfo: GovernanceSummaryInfo["delegationInfo"] = React.useMemo(() => {
    return displayGovernanceSummary.delegationInfo;
  }, [displayGovernanceSummary.delegationInfo]);

  /**
   * A delimiter showing total delegated information.
   * @returns {boolean} A boolean value indicating whether to show the total delegated information.
   */
  const visibleTotalDelegateTooltip: boolean = React.useMemo(() => {
    return Number(delegationinfo.totalDelegationAmount) > 0;
  }, [delegationinfo]);
  /**
   * A delimiter showing community pool information.
   * @returns {boolean} A boolean value indicating whether to show the community pool information.
   */
  const visibleCommunityPoolTooltip: boolean = React.useMemo(() => {
    return governanceCommunityPoolBalances.length > 0;
  }, [governanceCommunityPoolBalances]);

  const communityPoolInfo: DisplayCommunityPoolBalance[] = React.useMemo(() => {
    return governanceCommunityPoolBalances
      .map(balance => {
        const tokenInfo = tokens.find(token => token.path === balance.path);

        if (!tokenInfo) {
          return {
            amount: 0,
            usdValue: 0,
            tokenInfo: null,
          };
        }

        const gnotPathInfo = getGnotPath(tokenInfo);
        const unwrappedTokenInfo: TokenModel = {
          ...tokenInfo,
          ...gnotPathInfo,
        };

        const displayAmount = rawToDisplayAmount(balance.amount, tokenInfo.decimals || 0);
        const usdValue = getTokenUSDPrice(balance.path, displayAmount) || 0;

        return {
          amount: displayAmount,
          usdValue,
          tokenInfo: unwrappedTokenInfo,
        };
      })
      .sort((a, b) => b.usdValue - a.usdValue);
  }, [governanceCommunityPoolBalances]);

  const handleOpenVideoGuide = React.useCallback(() => {
    onOpenVideoGuide(VIDEO_GUIDE_TYPES.GOVERNANCE);
  }, [onOpenVideoGuide]);

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
                        {formatOtherPrice(delegationinfo.governanceDelegationAmount, {
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
                        {formatOtherPrice(delegationinfo.launchpadDelegationAmount, {
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
                {formatOtherPrice(delegationinfo.totalDelegationAmount, {
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
                      <span>${toNumberFormat(governanceSummary.communityPoolUsd, 2)}</span>
                    </div>
                    {communityPoolInfo.map(balance => {
                      const { tokenInfo } = balance;
                      return (
                        <div className="value" key={`${balance.tokenInfo?.symbol}-token`}>
                          <div className="key">
                            <MissingLogo
                              url={tokenInfo?.logoURI || ""}
                              symbol={tokenInfo?.symbol || "-"}
                              width={20}
                              mobileWidth={20}
                            />
                            <span>{tokenInfo?.symbol || "-"}</span>
                          </div>
                          <div className="amount">{toNumberFormat(balance.amount, 0)}</div>
                        </div>
                      );
                    })}
                  </div>
                </GovernanceSummaryTooltipContent>
              }
            >
              <div className={visibleCommunityPoolTooltip ? "value-wrapper-for-hover" : "value-wrapper"}>
                {formatOtherPrice(governanceSummary.communityPoolUsd, {
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
          <VideoGuideTrigger text={`${t("common:guide.learnMore")} ▶`} onClick={handleOpenVideoGuide} />
        </div>
      )}
    </GovernanceSummaryWrapper>
  );
};

export default GovernanceSummary;
