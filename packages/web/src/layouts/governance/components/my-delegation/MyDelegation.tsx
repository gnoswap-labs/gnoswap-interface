import dayjs from "dayjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconSwap from "@components/common/icons/IconSwap";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useTokenData } from "@hooks/token/data/use-token-data";
import {
  DelegationItemInfo,
  MyDelegatesInfo,
  MyDelegationInfo,
  MyUnDelegatesInfo,
  VerifiedDelegateInfo,
} from "@repositories/governance";
import { formatOtherPrice } from "@utils/new-number-utils";
import { rawToDisplayAmount, toNumberFormat } from "@utils/number-utils";

import InfoBox from "../info-box/InfoBox";
import TokenChip from "../token-chip/TokenChip";
import MyDelegationDelegateModal from "./my-delegation-modals/MyDelegationDelegateModal";
import MyDelegationUndelegateModal from "./my-delegation-modals/MyDelegationUndelegateModal";

import IconLinkOff from "@components/common/icons/IconLinkOff";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import {
  MyDelegationRewardTooltipContent,
  MyDelegationTooltipContent,
  MyDelegationWrapper,
} from "./MyDelegation.styles";

interface MyDelegationProps {
  totalDelegatedAmount: number;
  apy: number;
  myDelegationInfo: MyDelegationInfo;
  myDelegates: MyDelegatesInfo;
  myUnDelegates: MyUnDelegatesInfo;
  delegatees: VerifiedDelegateInfo[];
  isLoadingCommon: boolean;
  isLoadingMyDelegation: boolean;
  isWalletConnected: boolean;
  isOpenDelegateModal: boolean;
  setIsOpenDelegateModal: React.Dispatch<React.SetStateAction<boolean>>;
  connectWallet: () => void;
  delegateGNS: (toName: string, toAddress: string, amount: string) => void;
  undelegateGNS: (fromName: string, fromAddress: string, amount: string) => void;
  collectUndelegated: (amount: string) => void;
  collectReward: (usdValue: string) => void;
}

const MyDelegation: React.FC<MyDelegationProps> = ({
  totalDelegatedAmount,
  apy,
  myDelegationInfo,
  myDelegates,
  myUnDelegates,
  delegatees,
  isLoadingCommon,
  isLoadingMyDelegation,
  isWalletConnected,
  isOpenDelegateModal,
  setIsOpenDelegateModal,
  connectWallet,
  delegateGNS,
  undelegateGNS,
  collectUndelegated,
  collectReward,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();
  const [isOpenUndelegateModal, setIsOpenUndelegateModal] = useState(false);
  const { getTokenUSDPrice, tokens } = useTokenData();
  const [showUndel, setShowUndel] = useState(false);

  const sortByAmountAndDate = useCallback((a: DelegationItemInfo, b: DelegationItemInfo) => {
    if (b.amount !== a.amount) {
      return b.amount - a.amount;
    }
    const dateA = new Date(a.updatedDate || 0);
    const dateB = new Date(b.updatedDate || 0);
    return dateB.getTime() - dateA.getTime();
  }, []);

  const myDelegatesInfo: DelegationItemInfo[] = useMemo(() => {
    return myDelegates.delegates
      .map(
        (item): DelegationItemInfo => ({
          address: item.address,
          name: item.name,
          logoUrl: item.logoURL,
          amount: rawToDisplayAmount(Number(item.delegateAmount) || 0, GNS_TOKEN.decimals),
          updatedDate: item.delegatedAt,
          delegateAmount: item.delegateAmount,
          delegatedAt: item.delegatedAt,
        }),
      )
      .sort(sortByAmountAndDate);
  }, [myDelegates.delegates]);

  const myUnDelegatesInfo: DelegationItemInfo[] = useMemo(() => {
    return myUnDelegates.delegations
      .map(
        (item): DelegationItemInfo => ({
          address: item.address,
          name: item.name,
          logoUrl: item.logoURL,
          amount: rawToDisplayAmount(Number(item.unDelegateAmount) || 0, GNS_TOKEN.decimals),
          updatedDate: item.unDelegatedAt,
          unDelegateAmount: item.unDelegateAmount,
          unlockTime: item.unlockTime,
          unDelegatedAt: item.unDelegatedAt,
        }),
      )
      .sort(sortByAmountAndDate);
  }, [myUnDelegates.delegations]);

  const hasMyDelegates = myDelegatesInfo.length > 0;
  const hasMyUnDelegates = myUnDelegatesInfo.length > 0;

  const rewardInfo = useMemo(() => {
    return myDelegationInfo.claimableRewards
      .map(reward => {
        const tokenInfo = tokens.find(token => token.path === reward.path);
        const displayAmount = rawToDisplayAmount(reward.amount, tokenInfo?.decimals || 0);
        const usdValue = getTokenUSDPrice(reward.path, displayAmount) || 0;
        const unwrappedTokenInfo = { ...tokenInfo, ...getGnotPath(tokenInfo) };

        return {
          ...reward,
          amount: displayAmount,
          tokenPath: unwrappedTokenInfo.path,
          usdValue,
          tokenInfo: unwrappedTokenInfo,
        };
      })
      .sort((a, b) => b.usdValue - a.usdValue);
  }, [myDelegationInfo.claimableRewards, getTokenUSDPrice, tokens, getGnotPath]);

  const currentDelegatedDisplayAmount = useMemo(() => {
    const votingWeight = Number(myDelegationInfo.votingWeight) || 0;
    return rawToDisplayAmount(votingWeight, XGNS_TOKEN.decimals);
  }, [myDelegationInfo.votingWeight]);

  const totalDelegatedDisplayAmount = useMemo(() => {
    return rawToDisplayAmount(totalDelegatedAmount, XGNS_TOKEN.decimals);
  }, [totalDelegatedAmount]);

  /**
   * A delimiter showing voting weight information or undelegation information.
   */
  const activatedDelegateInfoTab: boolean = useMemo(() => {
    if (myUnDelegatesInfo.length === 0) return true;
    return !showUndel;
  }, [showUndel, myUnDelegatesInfo.length]);

  const { hasUnlockItem, totalUnlockAmount } = useMemo(() => {
    const now = new Date();

    const result = myUnDelegatesInfo.reduce(
      (acc, info) => {
        const unlockTime = info.unlockTime ? new Date(info.unlockTime) : null;

        if (unlockTime && !Number.isNaN(unlockTime.getTime()) && unlockTime < now) {
          const amount = Number(info.amount);
          if (!Number.isNaN(amount) && amount > 0) {
            acc.hasUnlockItem = true;
            acc.totalUnlockAmount += amount;
          }
        }
        return acc;
      },
      { hasUnlockItem: false, totalUnlockAmount: 0 },
    );

    return result;
  }, [myUnDelegatesInfo]);

  const visibleInfoTooltip: boolean = useMemo(() => {
    if (activatedDelegateInfoTab) return hasMyDelegates;
    return hasMyUnDelegates;
  }, [activatedDelegateInfoTab, hasMyDelegates, hasMyUnDelegates]);

  /**
   * A delimiter showing reward information.
   */
  const visibleRewardInfoTooltip = useMemo(() => {
    return rewardInfo.length > 0;
  }, [rewardInfo]);

  /**
   * Automatically switch to the voting weight tab if undelegationInfos is empty
   */
  useEffect(() => {
    if (myUnDelegatesInfo.length === 0) {
      setShowUndel(false);
    }
  }, [myUnDelegatesInfo.length]);

  return (
    <MyDelegationWrapper>
      <div className="header-wrapper">
        <div className="my-delegation-title">{t("Governance:myDel.title")}</div>
        <div className="delegate-buttons">
          <Button
            disabled={isLoadingCommon || isLoadingMyDelegation || !isWalletConnected || myDelegatesInfo.length === 0}
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
            onClick={!isLoadingCommon ? () => setIsOpenDelegateModal(true) : undefined}
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
                  {formatOtherPrice(rawToDisplayAmount(myDelegationInfo.availableBalance, GNS_TOKEN.decimals), {
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
                activatedDelegateInfoTab ? t("Governance:myDel.votingWeight.title") : t("Governance:myDel.undel.title")
              }
              value={
                <Tooltip
                  forcedClose={!visibleInfoTooltip}
                  FloatingContent={
                    <MyDelegationTooltipContent>
                      {(showUndel ? myUnDelegatesInfo : myDelegatesInfo).map((item, index) => (
                        <div key={`del-item-${item.updatedDate}-${index}`} className="delegation-item">
                          {index !== 0 && <div className="divider" />}
                          <div className="info-row">
                            <div className="info-subject">{t("Governance:myDel.delegate")}</div>
                            <div className="info-value">
                              <MissingLogo symbol={item.name} url={item.logoUrl} width={20} />
                              <div className="text-content">
                                {item.name || [item.address.slice(0, 8), item.address.slice(32, 40)].join("...")}
                              </div>
                            </div>
                          </div>
                          <div className="info-row">
                            <div className="info-subject">{t("Governance:myDel.tooltip.amount")}</div>
                            <div className="info-value">
                              {item.amount.toLocaleString()} {GNS_TOKEN.symbol}
                            </div>
                          </div>
                          <div className="info-row">
                            <div className="info-subject">
                              {t(showUndel ? "Governance:myDel.tooltip.undelegated" : "Governance:myDel.tooltip.date")}
                            </div>
                            <div className="info-value">{dayjs(item.updatedDate).format("YYYY-MM-DD HH:mm:ss")}</div>
                          </div>
                          {item.unlockTime && (
                            <div className="info-row">
                              <div className="info-subject">{t("Governance:myDel.tooltip.unlockDate")}</div>
                              <div className="info-value">{dayjs(item.unlockTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                            </div>
                          )}
                        </div>
                      ))}
                      {(activatedDelegateInfoTab ? myDelegatesInfo : myUnDelegatesInfo).length === 0 ? (
                        <div className="no-data">{t("common:noData")}</div>
                      ) : null}
                    </MyDelegationTooltipContent>
                  }
                  placement="top"
                  scroll
                >
                  <div className={visibleInfoTooltip ? "value-wrapper-for-hover" : "value-wrapper"}>
                    {activatedDelegateInfoTab
                      ? formatOtherPrice(rawToDisplayAmount(myDelegationInfo.votingWeight, XGNS_TOKEN.decimals), {
                          isKMB: false,
                          usd: false,
                        })
                      : formatOtherPrice(rawToDisplayAmount(myDelegationInfo.unDelegatedAmount, XGNS_TOKEN.decimals), {
                          isKMB: false,
                          usd: false,
                        })}
                    <TokenChip tokenInfo={activatedDelegateInfoTab ? XGNS_TOKEN : GNS_TOKEN} />
                  </div>
                </Tooltip>
              }
              tooltip={
                activatedDelegateInfoTab
                  ? t("Governance:myDel.votingWeight.tooltip")
                  : t("Governance:myDel.undel.tooltip")
              }
              titleButton={
                hasMyUnDelegates
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
                hasUnlockItem && !activatedDelegateInfoTab
                  ? {
                      text: t("Governance:myDel.undel.btn"),
                      onClick: () => collectUndelegated(toNumberFormat(totalUnlockAmount)),
                    }
                  : undefined
              }
              isLoading={isLoadingMyDelegation}
            />
            <InfoBox
              title={t("Governance:myDel.reward.title")}
              value={
                <Tooltip
                  forcedClose={!visibleRewardInfoTooltip}
                  FloatingContent={
                    <MyDelegationRewardTooltipContent>
                      <div className="reward-info-total">
                        <span className="label">{t("Governance:myDel.reward.title")}</span>
                        <span className="value">
                          {formatOtherPrice(myDelegationInfo.claimableRewardUsd, { isKMB: false })}
                        </span>
                      </div>
                      {rewardInfo.map((reward, index) => {
                        const { tokenInfo } = reward;
                        return (
                          <div key={`reward-item-${reward.tokenPath}-${index}`} className="tooltip-container">
                            <div className="info-row">
                              <div className="info-subject">
                                <MissingLogo width={20} symbol={tokenInfo?.symbol || ""} url={tokenInfo?.logoURI} />
                                {tokenInfo?.symbol}
                              </div>
                              <div className="info-value">{toNumberFormat(reward.amount, tokenInfo?.decimals)}</div>
                            </div>
                          </div>
                        );
                      })}
                      {rewardInfo.length === 0 && <div className="no-data">{t("common:noData")}</div>}
                    </MyDelegationRewardTooltipContent>
                  }
                  placement="top"
                >
                  <div className={visibleRewardInfoTooltip ? "value-wrapper-for-hover" : "value-wrapper"}>
                    {formatOtherPrice(myDelegationInfo.claimableRewardUsd, {
                      isKMB: false,
                    })}
                  </div>
                </Tooltip>
              }
              tooltip={t("Governance:myDel.reward.tooltip")}
              valueButton={
                visibleRewardInfoTooltip
                  ? {
                      text: t("Governance:myDel.reward.btn"),
                      onClick: () => {
                        collectReward(
                          formatOtherPrice(myDelegationInfo.claimableRewardUsd, {
                            isKMB: false,
                          }),
                        );
                      },
                      disabled: !visibleRewardInfoTooltip,
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
          currentDelegatedDisplayAmount={currentDelegatedDisplayAmount}
          totalDelegatedDisplayAmount={totalDelegatedDisplayAmount}
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
          currentDelegatedAmount={currentDelegatedDisplayAmount}
          totalDelegatedAmount={totalDelegatedDisplayAmount}
          apy={apy}
          delegatedInfos={myDelegatesInfo}
          isWalletConnected={isWalletConnected}
          onSubmit={undelegateGNS}
          setIsOpen={setIsOpenUndelegateModal}
        />
      )}
    </MyDelegationWrapper>
  );
};

export default MyDelegation;
