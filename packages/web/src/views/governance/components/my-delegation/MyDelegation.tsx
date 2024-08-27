import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { MyDelegationInfo } from "@repositories/governance";

import InfoBox from "../info-box/InfoBox";

import { MyDelegationWrapper } from "./MyDelegation.styles";
import IconSwap from "@components/common/icons/IconSwap";
import TokenChip from "../token-chip/TokenChip";
import { GNS_TOKEN } from "@common/values/token-constant";

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

  return (
    <MyDelegationWrapper>
      <div className="my-delegation-title">My Delegation</div>
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
            <>
              {`${
                hasUndel && showUndel
                  ? myDelegationInfo.undeligatedAmount.toLocaleString("en")
                  : myDelegationInfo.votingWeight.toLocaleString("en")
              }`}
              <TokenChip tokenInfo={GNS_TOKEN} />
            </>
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
