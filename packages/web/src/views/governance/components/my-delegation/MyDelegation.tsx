import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconSwap from "@components/common/icons/IconSwap";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { DelegateeInfo, MyDelegationInfo } from "@repositories/governance";
import { formatOtherPrice } from "@utils/new-number-utils";

import InfoBox from "../info-box/InfoBox";
import TokenChip from "../token-chip/TokenChip";
import MyDelegationDelegateModal from "./my-delegation-modals/MyDelegationDelegateModal";
import MyDelegationUndelegateModal from "./my-delegation-modals/MyDelegationUndelegateModal";

import IconLinkOff from "@components/common/icons/IconLinkOff";
import {
  MyDelegationTooltipContent,
  MyDelegationWrapper,
} from "./MyDelegation.styles";

interface MyDelegationProps {
  totalDelegatedAmount: number;
  apy: number;
  myDelegationInfo: MyDelegationInfo;
  delegatees: DelegateeInfo[];
  isLoadingCommon: boolean;
  isLoadingMyDelegation: boolean;
  isWalletConnected: boolean;
  connectWallet: () => void;
  delegateGNS: (toName: string, toAddress: string, amount: string) => void;
  undelegateGNS: (
    fromName: string,
    fromAddress: string,
    amount: string,
  ) => void;
  collectUndelegated: () => void;
  collectReward: (usdValue: string) => void;
}

const MyDelegation: React.FC<MyDelegationProps> = ({
  totalDelegatedAmount,
  apy,
  myDelegationInfo,
  delegatees,
  isLoadingCommon,
  isLoadingMyDelegation,
  isWalletConnected,
  connectWallet,
  delegateGNS,
  undelegateGNS,
  collectUndelegated,
  collectReward,
}) => {
  const { t } = useTranslation();
  const [isOpenDelegateModal, setIsOpenDelegateModal] = useState(false);
  const [isOpenUndelegateModal, setIsOpenUndelegateModal] = useState(false);

  const [showUndel, setShowUndel] = useState(false);

  const delegationInfo = useMemo(() => {
    const votingWeightInfos = myDelegationInfo.delegations.filter(
      item => !item.unlockDate || item.unlockDate === "",
    );
    const undelegationInfos = myDelegationInfo.delegations.filter(
      item => !!item.unlockDate,
    );

    const hasVotingWeight = votingWeightInfos.length > 0;
    const hasUndelgated = undelegationInfos.length > 0;

    return {
      votingWeightInfos,
      undelegationInfos,
      hasVotingWeight,
      hasUndelgated,
    };
  }, [myDelegationInfo.delegations]);

  const {
    votingWeightInfos,
    undelegationInfos,
    hasVotingWeight,
    hasUndelgated,
  } = delegationInfo;

  /**
   * A delimiter showing voting weight information or undelegation information.
   */
  const activatedDelegateInfoTab = useMemo(() => {
    if (undelegationInfos.length === 0) {
      return true;
    }
    return !showUndel;
  }, [showUndel, undelegationInfos.length]);

  const visibleInfoTooltip = useMemo(() => {
    if (activatedDelegateInfoTab) {
      return hasVotingWeight;
    }
    return hasUndelgated;
  }, [activatedDelegateInfoTab, hasUndelgated, hasVotingWeight]);

  return (
    <MyDelegationWrapper>
      <div className="header-wrapper">
        <div className="my-delegation-title">{t("Governance:myDel.title")}</div>
        <div className="delegate-buttons">
          <Button
            disabled={
              isLoadingCommon ||
              isLoadingMyDelegation ||
              !isWalletConnected ||
              votingWeightInfos.length === 0
            }
            style={{
              hierarchy: ButtonHierarchy.Primary,
              fontType: "p1",
            }}
            text={t("Governance:myDel.undelegate")}
            onClick={
              !isLoadingCommon && !isLoadingMyDelegation && isWalletConnected
                ? () => setIsOpenUndelegateModal(true)
                : undefined
            }
          />
          <Button
            disabled={isLoadingCommon}
            style={{
              hierarchy: ButtonHierarchy.Primary,
              fontType: "p1",
            }}
            text={t("Governance:myDel.delegate")}
            onClick={
              !isLoadingCommon ? () => setIsOpenDelegateModal(true) : undefined
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
                  {formatOtherPrice(myDelegationInfo.availableBalance, {
                    isKMB: false,
                    usd: false,
                  })}
                  <TokenChip tokenInfo={GNS_TOKEN} />
                </>
              }
              tooltip={t("Governance:myDel.availBal.tooltip")}
              isLoading={isLoadingMyDelegation}
            />
            <InfoBox
              title={
                activatedDelegateInfoTab
                  ? t("Governance:myDel.votingWeight.title")
                  : t("Governance:myDel.undel.title")
              }
              value={
                <Tooltip
                  forcedClose={!visibleInfoTooltip}
                  FloatingContent={
                    <MyDelegationTooltipContent>
                      {(showUndel ? undelegationInfos : votingWeightInfos).map(
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
                                {item.name ||
                                  [
                                    item.address.slice(0, 8),
                                    item.address.slice(32, 40),
                                  ].join("...")}
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
                                {dayjs(item.updatedDate).format(
                                  "YYYY-MM-DD HH:mm:ss",
                                )}
                              </div>
                            </div>
                            {item.unlockDate && (
                              <div className="info-row">
                                <div className="info-subject">
                                  {t("Governance:myDel.tooltip.unlockDate")}
                                </div>
                                <div className="info-value">
                                  {dayjs(item.unlockDate).format(
                                    "YYYY-MM-DD HH:mm:ss",
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                      {(activatedDelegateInfoTab
                        ? votingWeightInfos
                        : undelegationInfos
                      ).length === 0 ? (
                        <div className="no-data">{t("common:noData")}</div>
                      ) : null}
                    </MyDelegationTooltipContent>
                  }
                  placement="top"
                  scroll
                >
                  <div
                    className={
                      visibleInfoTooltip
                        ? "value-wrapper-for-hover"
                        : "value-wrapper"
                    }
                  >
                    {activatedDelegateInfoTab
                      ? formatOtherPrice(myDelegationInfo.votingWeight, {
                          isKMB: false,
                          usd: false,
                        })
                      : formatOtherPrice(myDelegationInfo.undelegatedAmount, {
                          isKMB: false,
                          usd: false,
                        })}
                    <TokenChip
                      tokenInfo={
                        activatedDelegateInfoTab ? XGNS_TOKEN : GNS_TOKEN
                      }
                    />
                  </div>
                </Tooltip>
              }
              tooltip={
                activatedDelegateInfoTab
                  ? t("Governance:myDel.votingWeight.tooltip")
                  : t("Governance:myDel.undel.tooltip")
              }
              titleButton={
                hasUndelgated
                  ? {
                      text: (
                        <div className="del-undel-switch">
                          {showUndel
                            ? t("Governance:myDel.switch.toVotingWeight")
                            : t("Governance:myDel.switch.toUndel")}
                          <IconSwap />
                        </div>
                      ),
                      onClick: () => setShowUndel(a => !a),
                    }
                  : undefined
              }
              valueButton={
                !activatedDelegateInfoTab
                  ? {
                      text: t("Governance:myDel.undel.btn"),
                      onClick: collectUndelegated,
                    }
                  : undefined
              }
              isLoading={isLoadingMyDelegation}
            />
            <InfoBox
              title={t("Governance:myDel.reward.title")}
              value={formatOtherPrice(myDelegationInfo.claimableRewardsUsd, {
                isKMB: false,
              })}
              tooltip={t("Governance:myDel.reward.tooltip")}
              valueButton={
                myDelegationInfo.claimableRewardsUsd
                  ? {
                      text: t("Governance:myDel.reward.btn"),
                      onClick: () => {
                        collectReward(
                          formatOtherPrice(
                            myDelegationInfo.claimableRewardsUsd,
                            {
                              isKMB: false,
                            },
                          ),
                        );
                      },
                      disabled: !myDelegationInfo.claimableRewardsUsd,
                    }
                  : undefined
              }
              isLoading={isLoadingMyDelegation}
            />
          </>
        ) : (
          <div className="require-wallet">
            <IconLinkOff className="unconnected-icon" />
            {t("Governance:myDel.login.description")}
            <Button
              style={{
                hierarchy: ButtonHierarchy.Primary,
                fontType: "p1",
              }}
              text={t("common:btn.walletLogin")}
              onClick={connectWallet}
            />
          </div>
        )}
      </div>
      {isOpenDelegateModal && (
        <MyDelegationDelegateModal
          currentDelegatedAmount={myDelegationInfo.votingWeight}
          totalDelegatedAmount={totalDelegatedAmount}
          apy={apy}
          delegatees={delegatees}
          isWalletConnected={isWalletConnected}
          connectWallet={connectWallet}
          onSubmit={delegateGNS}
          setIsOpen={setIsOpenDelegateModal}
        />
      )}
      {isOpenUndelegateModal && (
        <MyDelegationUndelegateModal
          currentDelegatedAmount={myDelegationInfo.votingWeight}
          totalDelegatedAmount={totalDelegatedAmount}
          apy={apy}
          delegatedInfos={votingWeightInfos}
          isWalletConnected={isWalletConnected}
          onSubmit={undelegateGNS}
          setIsOpen={setIsOpenUndelegateModal}
        />
      )}
    </MyDelegationWrapper>
  );
};

export default MyDelegation;
