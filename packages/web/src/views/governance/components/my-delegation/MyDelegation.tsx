import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconSwap from "@components/common/icons/IconSwap";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { DelegateeInfo, MyDelegationInfo } from "@repositories/governance";

import InfoBox from "../info-box/InfoBox";
import TokenChip from "../token-chip/TokenChip";
import MyDelegationDelegateModal from "./my-delegation-modals/MyDelegationDelegateModal";
import MyDelegationUndelegateModal from "./my-delegation-modals/MyDelegationUndelegateModal";

import {
  MyDelegationTooltipContent,
  MyDelegationWrapper,
} from "./MyDelegation.styles";

interface MyDelegationProps {
  totalDelegatedAmount: number;
  myDelegationInfo: MyDelegationInfo;
  delegatees: DelegateeInfo[];
  isLoading: boolean;
  isWalletConnected: boolean;
  connectWallet: () => void;
  delegateGNS: (toName: string, toAddress: string, amount: string) => void;
}

const MyDelegation: React.FC<MyDelegationProps> = ({
  totalDelegatedAmount,
  myDelegationInfo,
  delegatees,
  isLoading,
  isWalletConnected,
  connectWallet,
  delegateGNS,
}) => {
  const { t } = useTranslation();
  const [isOpenDelegateModal, setIsOpenDelegateModal] = useState(false);
  const [isOpenUndelegateModal, setIsOpenUndelegateModal] = useState(false);

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
      <div className="header-wrapper">
        <div className="my-delegation-title">{t("Governance:myDel.title")}</div>
        <div className="delegate-buttons">
          <Button
            disabled={isLoading || !isWalletConnected}
            style={{
              hierarchy: ButtonHierarchy.Primary,
              fontType: "p1",
            }}
            text={t("Governance:myDel.undelegate")}
            onClick={
              !isLoading && isWalletConnected
                ? () => setIsOpenUndelegateModal(true)
                : undefined
            }
          />
          <Button
            disabled={isLoading || !isWalletConnected}
            style={{
              hierarchy: ButtonHierarchy.Primary,
              fontType: "p1",
            }}
            text={t("Governance:myDel.delegate")}
            onClick={
              !isLoading && isWalletConnected
                ? () => setIsOpenDelegateModal(true)
                : undefined
            }
          />
        </div>
      </div>
      <div className="info-wrapper">
        {isWalletConnected ? (
          <>
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
                                  symbol={item.name}
                                  url={item.logoUrl}
                                  width={20}
                                />
                                {item.name}
                              </div>
                            </div>
                            <div className="info-row">
                              <div className="info-subject">
                                {t("Governance:myDel.tooltip.amount")}
                              </div>
                              <div className="info-value">
                                {item.amount.toLocaleString("en")}{" "}
                                {GNS_TOKEN.symbol}
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
                              <div className="info-value">
                                {item.updatedDate}
                              </div>
                            </div>
                            {item.unlockDate && (
                              <div className="info-row">
                                <div className="info-subject">
                                  {t("Governance:myDel.tooltip.unlockDate")}
                                </div>
                                <div className="info-value">
                                  {item.unlockDate}
                                </div>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </MyDelegationTooltipContent>
                  }
                  placement="top"
                >
                  <div className="value-wrapper-for-hover">
                    {`${
                      hasUndel && showUndel
                        ? myDelegationInfo.undeligatedAmount.toLocaleString(
                            "en",
                          )
                        : myDelegationInfo.votingWeight.toLocaleString("en")
                    }`}
                    <TokenChip tokenInfo={GNS_TOKEN} />
                  </div>
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
          </>
        ) : (
          <div className="require-wallet">
            {t("Governance:myDel.login.description")}
            <Button
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fontType: "p1",
              }}
              text={t("Governance:myDel.login.btn")}
              onClick={connectWallet}
            />
          </div>
        )}
      </div>
      {isOpenDelegateModal && (
        <MyDelegationDelegateModal
          currentDelegatedAmount={myDelegationInfo.votingWeight}
          totalDelegatedAmount={totalDelegatedAmount}
          delegatees={delegatees}
          isWalletConnected={isWalletConnected}
          onSubmit={delegateGNS}
          setIsOpen={setIsOpenDelegateModal}
        />
      )}
      {isOpenUndelegateModal && (
        <MyDelegationUndelegateModal
          currentDelegatedAmount={myDelegationInfo.votingWeight}
          totalDelegatedAmount={totalDelegatedAmount}
          delegatedInfos={votingWeightInfos}
          isWalletConnected={isWalletConnected}
          onSubmit={() => console.log("undelegate")}
          setIsOpen={setIsOpenUndelegateModal}
        />
      )}
    </MyDelegationWrapper>
  );
};

export default MyDelegation;
