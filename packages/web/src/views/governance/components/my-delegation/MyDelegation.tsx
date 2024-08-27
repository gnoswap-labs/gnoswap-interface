import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import IconSwap from "@components/common/icons/IconSwap";
import Tooltip from "@components/common/tooltip/Tooltip";
import { MyDelegationInfo } from "@repositories/governance";

import InfoBox from "../info-box/InfoBox";

import TokenChip from "../token-chip/TokenChip";
import {
  MyDelegationTooltipContent,
  MyDelegationWrapper,
} from "./MyDelegation.styles";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

interface MyDelegationProps {
  myDelegationInfo: MyDelegationInfo;
  isLoading: boolean;
}

const MyDelegation: React.FC<MyDelegationProps> = ({
  myDelegationInfo,
  isLoading,
}) => {
  const { t } = useTranslation(); 
  
  const [showUndel, setShowUndel] = useState(false);

  const hasUndel = !!myDelegationInfo.undeligatedAmount;

  const votingWeightInfos = myDelegationInfo.delegations.filter(
    item => !item.unlockDate,
  );
  const undeligationInfos = myDelegationInfo.delegations.filter(
    item => item.unlockDate,
  );

  return (
    <MyDelegationWrapper>
      <div className="my-delegation-title">{t("Governance:myDel.title")}</div>
      <div className="info-wrapper">
        <InfoBox
          title={t("Governance:myDel.availBal.title")}
          value={
            <>
              {myDelegationInfo.availableBalance.toLocaleString("en")}
              <TokenChip tokenInfo={GNS_TOKEN} />
            </>
          }
          tooltip={t("Governance:myDel.availBal.tooltip")}
          isLoading={isLoading}
        />
        <InfoBox
          title={
            hasUndel && showUndel
              ? t("Governance:myDel.undel.title")
              : t("Governance:myDel.votingWeight.title")
          }
          value={
            <Tooltip
              FloatingContent={
                <MyDelegationTooltipContent>
                  {(showUndel ? undeligationInfos : votingWeightInfos).map(
                    (item, index) => (
                      <div
                        key={`del-item-${item.updatedDate}-${index}`}
                        className="delegation-item"
                      >
                        {index !== 0 && <div className="divider" />}
                        <div className="info-row">
                          <div className="info-subject">
                            {t("Governance:myDel.tooltip.delegatee")}
                          </div>
                          <div className="info-value">
                            <MissingLogo
                              symbol={item.delegatee}
                              url={item.logoUrl}
                              width={20}
                            />
                            {item.delegatee}
                          </div>
                        </div>
                        <div className="info-row">
                          <div className="info-subject">
                            {t("Governance:myDel.tooltip.amount")}
                          </div>
                          <div className="info-value">
                            {item.amount.toLocaleString("en")} GNS
                          </div>
                        </div>
                        <div className="info-row">
                          <div className="info-subject">
                            {t(
                              showUndel
                                ? "Governance:myDel.tooltip.undelegated"
                                : "Governance:myDel.tooltip.date",
                            )}
                          </div>
                          <div className="info-value">{item.updatedDate}</div>
                        </div>
                        {item.unlockDate && (
                          <div className="info-row">
                            <div className="info-subject">
                              {t("Governance:myDel.tooltip.unlockDate")}
                            </div>
                            <div className="info-value">{item.unlockDate}</div>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </MyDelegationTooltipContent>
              }
              placement="top"
            >
              {`${
                hasUndel && showUndel
                  ? myDelegationInfo.undeligatedAmount.toLocaleString("en")
                  : myDelegationInfo.votingWeight.toLocaleString("en")
              }`}
              <TokenChip tokenInfo={GNS_TOKEN} />
            </Tooltip>
          }
          tooltip={
            hasUndel && showUndel
              ? t("Governance:myDel.undel.tooltip")
              : t("Governance:myDel.votingWeight.tooltip")
          }
          titleButton={
            hasUndel
              ? {
                  text: (
                    <>
                      {showUndel
                        ? t("Governance:myDel.switch.toVotingWeight")
                        : t("Governance:myDel.switch.toUndel")}
                      <IconSwap />
                    </>
                  ),
                  onClick: () => setShowUndel(a => !a),
                }
              : undefined
          }
          valueButton={
            showUndel
              ? {
                  text: t("Governance:myDel.undel.btn"),
                  onClick: () => {
                    console.log("claim undelegated token");
                  },
                }
              : undefined
          }
          isLoading={isLoading}
        />
        <InfoBox
          title={t("Governance:myDel.reward.title")}
          value={`$${myDelegationInfo.claimableRewardsUsd.toLocaleString(
            "en",
          )}`}
          tooltip={t("Governance:myDel.reward.tooltip")}
          valueButton={{
            text: t("Governance:myDel.reward.btn"),
            onClick: () => {
              console.log("claim all");
            },
            disabled: !myDelegationInfo.claimableRewardsUsd,
          }}
          isLoading={isLoading}
        />
      </div>
    </MyDelegationWrapper>
  );};

export default MyDelegation;
