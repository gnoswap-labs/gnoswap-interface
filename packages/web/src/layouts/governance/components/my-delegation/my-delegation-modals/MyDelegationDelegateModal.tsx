import { useTheme } from "@emotion/react";
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import IconStrokeArrowLeft from "@components/common/icons/IconStrokeArrowLeft";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import TokenAmountInput from "@components/common/token-amount-input/TokenAmountInput";
import Tooltip from "@components/common/tooltip/Tooltip";
import WarningCard from "@components/common/warning-card/WarningCard";
import withLocalModal from "@components/hoc/with-local-modal";
import { EXT_URL } from "@constants/external-url.contant";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { useTokenAmountInput } from "@hooks/token/data/use-token-amount-input";
import { nullVerifiedDelegateInfo, VerifiedDelegateInfo } from "@repositories/governance";
import { formatOtherPrice } from "@utils/new-number-utils";
import { isValidAddress } from "@utils/validation-utils";
import { openExternalUrl } from "@utils/url-utils";

import DelegateeChip from "./delegatee-chip/DelegateeChip";

import {
  MyDelegationModalWrapper,
  MyDelWarningContentWrapper,
  ToolTipContentWrapper,
} from "./MyDelegationModals.styles";
import { rawToDisplayAmount } from "@utils/number-utils";

interface MyDelegationDelegateModalProps {
  currentDelegatedDisplayAmount: number;
  totalDelegatedDisplayAmount: number;
  apy: number;
  delegatees: VerifiedDelegateInfo[];
  isWalletConnected: boolean;
  connectWallet: () => void;
  onSubmit: (toName: string, toAddress: string, amount: string) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MyDelegationDelegateModal: React.FC<MyDelegationDelegateModalProps> = ({
  currentDelegatedDisplayAmount,
  totalDelegatedDisplayAmount,
  apy,
  delegatees,
  isWalletConnected,
  connectWallet,
  onSubmit,
  setIsOpen,
}) => {
  const Modal = useMemo(() => withLocalModal(MyDelegationModalWrapper, setIsOpen), [setIsOpen]);
  const { t } = useTranslation();
  const selfDelegateName = t("Governance:myDel.delModal.selectDel.self.chip");
  const defaultDelegateeInfo = { ...nullVerifiedDelegateInfo };

  const { account } = useWallet();
  const { getAccountUrl } = useGnoscanUrl();
  const theme = useTheme();
  const gnsAmountInput = useTokenAmountInput(GNS_TOKEN);
  const [stage, setStage] = useState<"MAIN" | "SELECT_DELEGATE">("MAIN");
  const [delegatee, setDelegatee] = useState<VerifiedDelegateInfo>(defaultDelegateeInfo);
  const [tmpDelegatee, setTmpDelegatee] = useState<VerifiedDelegateInfo>(defaultDelegateeInfo);
  const [selfAddress, setSelfAddress] = useState("");

  const toSafeDisplayAmountNumber = (displayValue: string | number): number => {
    const result = Number(displayValue);
    return isNaN(result) ? 0 : result;
  };

  const toDisplayVotingPowerFromRaw = (rawValue: string | number): number => {
    const result = rawToDisplayAmount(rawValue, XGNS_TOKEN.decimals);
    return isNaN(result) ? 0 : result;
  };

  const isValidSelfAddress = useMemo(() => {
    return isValidAddress(selfAddress);
  }, [selfAddress]);

  const selectDelegateeButtonText = useMemo(() => {
    if (selfAddress !== "" && !isValidSelfAddress) {
      return t("Wallet:assetSendModal.btn.invalidAddr");
    }
    return t("Governance:myDel.delModal.selectDel.selectBtn");
  }, [isValidSelfAddress, selfAddress, t]);

  const votingPowerPercentage = useMemo(() => {
    const displayVotingPower = toDisplayVotingPowerFromRaw(tmpDelegatee.votingPower);
    const displayTotalDelegated = toSafeDisplayAmountNumber(totalDelegatedDisplayAmount);

    return displayTotalDelegated ? (displayVotingPower * 100) / displayTotalDelegated : 0;
  }, [tmpDelegatee.votingPower, totalDelegatedDisplayAmount]);

  const handleClickSelfDelegateeAddress = useCallback((address: string) => setSelfAddress(address), [delegatees]);

  const delegate = () => {
    let timeoutId: NodeJS.Timeout | null = null;

    const closeModal = () => {
      timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 30);
    };

    if (!isWalletConnected) {
      connectWallet();
      closeModal();
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    if (!delegatee.address) return;

    if (!gnsAmountInput.isAvailableDelegate) {
      closeModal();
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    onSubmit(delegatee.name, delegatee.address, gnsAmountInput.amount);
    closeModal();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  };

  const changeSelfDelegateeAddress = useCallback(
    (address: string) => {
      setSelfAddress(address);

      const currentDelegatee = delegatees.find(delegatee => delegatee.address === address);

      if (currentDelegatee) {
        setTmpDelegatee(prev => ({
          ...currentDelegatee,
          name: prev.name,
        }));
      } else {
        setTmpDelegatee(prev => ({
          ...nullVerifiedDelegateInfo,
          name: prev.name,
        }));
      }
    },
    [delegatees],
  );

  const delegationCalculations = useMemo(() => {
    const displayTotalDelegated = toSafeDisplayAmountNumber(totalDelegatedDisplayAmount);
    const displayCurrentDelegated = toSafeDisplayAmountNumber(currentDelegatedDisplayAmount);
    const inputAmount = Number(gnsAmountInput.amount) || 0;

    const currentPercentage = displayTotalDelegated ? (displayCurrentDelegated / displayTotalDelegated) * 100 : 0;

    const newPercentage =
      displayTotalDelegated + inputAmount
        ? Math.min(((displayCurrentDelegated + inputAmount) / displayTotalDelegated) * 100, 100)
        : 0;

    return {
      displayCurrentDelegated,
      displayTotalDelegated,
      currentPercentage,
      newPercentage,
    };
  }, [currentDelegatedDisplayAmount, totalDelegatedDisplayAmount, gnsAmountInput.amount]);

  const showDelegateInfo = () => (
    <>
      <div className="modal-content-header">
        <div className="title-area">{t("Governance:myDel.delegate")}</div>
        <div className="close-wrap" onClick={() => setIsOpen(false)}>
          <IconClose className="close-icon" />
        </div>
      </div>

      <article>
        <div className="section-title">
          {t("Governance:myDel.delModal.step1.title")}
          <Tooltip
            placement="top"
            FloatingContent={
              <ToolTipContentWrapper>{t("Governance:myDel.delModal.step1.tooltip")}</ToolTipContentWrapper>
            }
          >
            <IconInfo size={16} />
          </Tooltip>
        </div>
        <div className="delegatee-select-btn" onClick={() => setStage("SELECT_DELEGATE")}>
          {delegatee.address === "" ? (
            <div className="before-select">Select</div>
          ) : (
            <div className="selected-delegatee">
              <MissingLogo url={delegatee.logoURL} symbol={delegatee.name} width={24} />
              {delegatee.name}
              <div
                className="addr"
                onClick={e => {
                  e.stopPropagation();
                  openExternalUrl(getAccountUrl(delegatee.address));
                }}
              >
                {[delegatee.address.slice(0, 8), delegatee.address.slice(32, 40)].join("...")}
                <IconNewTab />
              </div>
            </div>
          )}
          <IconStrokeArrowRight className="arrow" />
        </div>
      </article>

      <article>
        <div className="section-title">{t("Governance:myDel.delModal.step2.title")}</div>
        <TokenAmountInput
          {...gnsAmountInput}
          token={GNS_TOKEN}
          connected={isWalletConnected}
          changeAmount={gnsAmountInput.changeAmount}
          changeToken={() => {}}
          style={{ padding: "16px" }}
          integersOnly={true}
        />
      </article>

      <article>
        <div className="section-title">{t("Governance:myDel.delModal.step3.title")}</div>
        <div className="info-rows">
          <div className="label">{t("Governance:myDel.delModal.step3.currentlyDel")}</div>
          <div className="value">
            <MissingLogo symbol={XGNS_TOKEN.symbol} url={XGNS_TOKEN.logoURI} width={24} />
            {formatOtherPrice(toSafeDisplayAmountNumber(currentDelegatedDisplayAmount), {
              isKMB: false,
              usd: false,
            })}
            {` ${XGNS_TOKEN.symbol}`}
          </div>
        </div>
        <div className="info-rows">
          <div className="label">{t("Governance:myDel.delModal.step3.newlyDel")}</div>
          <div className="value">
            <MissingLogo symbol={XGNS_TOKEN.symbol} url={XGNS_TOKEN.logoURI} width={24} />

            <span>
              {formatOtherPrice(gnsAmountInput.amount, {
                isKMB: false,
                usd: false,
              })}
              {` ${XGNS_TOKEN.symbol}`}
            </span>
          </div>
        </div>
        <div className="info-rows">
          <div className="label">{t("Governance:myDel.delModal.step3.votingPowerShare")}</div>
          <div className="value">
            {`${formatOtherPrice(delegationCalculations.currentPercentage, { usd: false })}% -> ${formatOtherPrice(
              delegationCalculations.newPercentage,
              { usd: false },
            )}%`}
          </div>
        </div>
        <div className="info-rows">
          <div className="label">
            {t("Governance:myDel.delModal.step3.estimatedAPR")}
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>{t("Governance:myDel.delModal.step3.aprTooltip")}</ToolTipContentWrapper>
              }
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">
            {formatOtherPrice(apy, {
              isKMB: false,
              usd: false,
            })}
            %
          </div>
        </div>
      </article>

      <WarningCard
        icon={<IconCircleExclamationMark />}
        title={t("Governance:myDel.delModal.warning.title")}
        content={
          <MyDelWarningContentWrapper>
            {t("Governance:myDel.delModal.warning.description")}
            <a href={EXT_URL.DOCS.XGNS} target="_blank" rel="noopener noreferrer" className="learn-more-box">
              <p>{t("common:learnMore")}</p>
              <IconNewTab color={theme.color.icon21} />
            </a>
          </MyDelWarningContentWrapper>
        }
      />

      {isWalletConnected ? (
        <Button
          onClick={delegate}
          text={gnsAmountInput.delegateButtonText}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fullWidth: true,
          }}
          disabled={!gnsAmountInput.isAvailableDelegate || delegatee.address === ""}
          className="button-confirm"
        />
      ) : (
        <Button
          onClick={delegate}
          text={gnsAmountInput.delegateButtonText}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fullWidth: true,
          }}
          className="button-confirm"
        />
      )}
    </>
  );

  const showDelegateeSelector = () => (
    <>
      <div className="modal-content-header">
        <div className="title-area">
          <IconStrokeArrowLeft onClick={() => setStage("MAIN")} />
          {t("Governance:myDel.delModal.title.select")}
        </div>
        <div className="close-wrap" onClick={() => setIsOpen(false)}>
          <IconClose className="close-icon" />
        </div>
      </div>
      <div className="chip-area">
        <DelegateeChip
          key="manual"
          showLogo={false}
          delegatee={{
            ...nullVerifiedDelegateInfo,
            name: selfDelegateName,
          }}
          selected={tmpDelegatee.name === selfDelegateName}
          onClick={() => {
            setTmpDelegatee({
              ...nullVerifiedDelegateInfo,
              name: selfDelegateName,
            });
            changeSelfDelegateeAddress(account?.address || "");
            handleClickSelfDelegateeAddress(account?.address || "");
          }}
        />
        {delegatees.map((item: VerifiedDelegateInfo, index: number) => {
          return (
            <DelegateeChip
              key={index}
              delegatee={item}
              selected={item.name === tmpDelegatee.name}
              onClick={() => setTmpDelegatee(item)}
            />
          );
        })}
      </div>

      {tmpDelegatee.name === selfDelegateName && (
        <>
          <div className="self-address">
            <div className="withdraw-address">
              <input
                className="address-input"
                value={selfAddress}
                onChange={e => changeSelfDelegateeAddress(e.target.value)}
                placeholder={t("Governance:myDel.delModal.selectDel.self.placeholder")}
                autoComplete={"off"}
                spellCheck={"false"}
              />
            </div>
          </div>
          <div className="divider" />
        </>
      )}

      <article>
        <div className="delegatee-info-rows">
          <div className="label">{t("Governance:myDel.delModal.selectDel.votingPower")}</div>
          <div className="value no-wrap">
            <MissingLogo symbol="xGNS" url={XGNS_TOKEN.logoURI} width={24} />
            {formatOtherPrice(toDisplayVotingPowerFromRaw(tmpDelegatee.votingPower), {
              isKMB: false,
              usd: false,
            })}{" "}
            {XGNS_TOKEN.symbol}
            <span className="sub">{` (${formatOtherPrice(votingPowerPercentage, { usd: false })}%)`}</span>
          </div>
        </div>
        <div className="delegatee-info-rows">
          <div className="label">{t("Governance:myDel.delModal.selectDel.address")}</div>
          {tmpDelegatee.address !== "" ? (
            <div
              className="value clickable"
              onClick={e => {
                e.stopPropagation();
                openExternalUrl(getAccountUrl(tmpDelegatee.address));
              }}
            >
              {[tmpDelegatee.address.slice(0, 8), tmpDelegatee.address.slice(32, 40)].join("...")}
              <IconNewTab />
            </div>
          ) : (
            <div className="value"> - </div>
          )}
        </div>
        <div className="delegatee-info-rows">
          <div className="label">{t("Governance:myDel.delModal.selectDel.description")}</div>
          <div className="value">{tmpDelegatee.description || "-"}</div>
        </div>
        <div className="delegatee-info-rows">
          <div className="label">{t("Governance:myDel.delModal.selectDel.website")}</div>
          {tmpDelegatee.website !== "" ? (
            <div
              className="value clickable"
              onClick={e => {
                e.stopPropagation();
                openExternalUrl(tmpDelegatee.website);
              }}
            >
              {tmpDelegatee.website}
              <IconNewTab />
            </div>
          ) : (
            <div className="value"> - </div>
          )}
        </div>
      </article>
      <Button
        onClick={() => {
          if (tmpDelegatee.address === "") {
            setDelegatee({ ...tmpDelegatee, address: selfAddress });
          } else {
            setDelegatee(tmpDelegatee);
          }
          setStage("MAIN");
        }}
        text={selectDelegateeButtonText}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        disabled={tmpDelegatee.address === "" && !isValidSelfAddress}
        className="button-confirm"
      />
    </>
  );

  return (
    <Modal className={stage === "MAIN" ? "" : "large-gap selector-box"}>
      <div className="modal-wrapper">{stage === "MAIN" ? showDelegateInfo() : showDelegateeSelector()}</div>
    </Modal>
  );
};

export default MyDelegationDelegateModal;
