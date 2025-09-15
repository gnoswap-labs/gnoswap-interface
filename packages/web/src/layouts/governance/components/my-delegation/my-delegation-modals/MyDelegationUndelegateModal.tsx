import { useTheme } from "@emotion/react";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import TokenAmountInput from "@components/common/token-amount-input/TokenAmountInput";
import Tooltip from "@components/common/tooltip/Tooltip";
import WarningCard from "@components/common/warning-card/WarningCard";
import withLocalModal from "@components/hoc/with-local-modal";
import { EXT_URL } from "@constants/external-url.contant";
import { useTokenAmountInput } from "@hooks/token/data/use-token-amount-input";
import { DelegationItemInfo, nullDelegationItemInfo } from "@repositories/governance";
import { formatOtherPrice } from "@utils/new-number-utils";

import UndelegateSelect from "./undelegate-selector/UndelegateSelect";

import {
  MyDelegationModalWrapper,
  MyDelWarningContentWrapper,
  ToolTipContentWrapper,
} from "./MyDelegationModals.styles";

interface MyDelegationUndelegateModalProps {
  currentDelegatedAmount: number;
  totalDelegatedAmount: number;
  apy: number;
  delegatedInfos: DelegationItemInfo[];
  isWalletConnected: boolean;
  onSubmit: (fromName: string, fromAddress: string, amount: string) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MyDelegationUndelegateModal: React.FC<MyDelegationUndelegateModalProps> = ({
  currentDelegatedAmount,
  totalDelegatedAmount,
  apy,
  delegatedInfos,
  isWalletConnected,
  onSubmit,
  setIsOpen,
}) => {
  const Modal = useMemo(() => withLocalModal(MyDelegationModalWrapper, setIsOpen), [setIsOpen]);

  const { t } = useTranslation();
  const theme = useTheme();
  const gnsAmountInput = useTokenAmountInput(GNS_TOKEN);

  const accumedDelegationInfo = useMemo(() => {
    return delegatedInfos.reduce((acc: DelegationItemInfo[], item: DelegationItemInfo) => {
      let accumed = false;
      for (const accumedItem of acc) {
        if (accumedItem.address === item.address) {
          accumedItem.amount += item.amount;
          accumed = true;
          break;
        }
      }
      if (!accumed) {
        acc.push({ ...item });
      }
      return acc;
    }, []);
  }, [delegatedInfos]);

  const [selectedDelegatedInfo, setSelectedDelegatedInfo] = useState<DelegationItemInfo>(
    accumedDelegationInfo.sort((a, b) => b.amount - a.amount)[0] || nullDelegationItemInfo,
  );

  const calculatedValues = useMemo(() => {
    const inputAmount = Number(gnsAmountInput.amount) || 0;
    const remainingAmount = Math.max(0, currentDelegatedAmount - inputAmount);
    const newTotalDelegated = Math.max(0, totalDelegatedAmount - inputAmount);

    return {
      remainingAmount,
      newVotingWeight: newTotalDelegated > 0 ? (remainingAmount * 100) / newTotalDelegated : 0,
      currentVotingWeight: totalDelegatedAmount > 0 ? (currentDelegatedAmount * 100) / totalDelegatedAmount : 0,
      newApy: remainingAmount > 0 ? apy : 0,
    };
  }, [gnsAmountInput.amount, currentDelegatedAmount, totalDelegatedAmount, apy]);

  const handleSubmit = () => {
    onSubmit(selectedDelegatedInfo.name, selectedDelegatedInfo.address, gnsAmountInput.amount);
    setTimeout(() => {
      setIsOpen(false);
    }, 20);
  };

  const isSubmitDisabled = useMemo(() => {
    const amount = Number(gnsAmountInput.amount);
    return amount === 0 || amount > selectedDelegatedInfo.amount || !selectedDelegatedInfo.address;
  }, [gnsAmountInput.amount, selectedDelegatedInfo.amount, selectedDelegatedInfo.address]);

  const showDelegateInfo = () => (
    <>
      <div className="modal-content-header">
        <div className="title-area">{t("Governance:myDel.undelegate")}</div>
        <div className="close-wrap" onClick={() => setIsOpen(false)}>
          <IconClose className="close-icon" />
        </div>
      </div>
      <UndelegateSelect
        delegatedInfos={accumedDelegationInfo}
        select={setSelectedDelegatedInfo}
        selectedDelegationInfo={selectedDelegatedInfo}
      />
      <article>
        <div className="section-title">{t("Governance:myDel.undelModal.step2.title")}</div>
        <TokenAmountInput
          {...gnsAmountInput}
          token={XGNS_TOKEN}
          connected={isWalletConnected}
          changeAmount={gnsAmountInput.changeAmount}
          balance={selectedDelegatedInfo.amount.toString()}
          changeToken={() => {}}
          style={{ padding: "16px" }}
        />
      </article>
      <article>
        <div className="section-title">{t("Governance:myDel.undelModal.step3.title")}</div>
        <div className="info-rows">
          <div className="label">{t("Governance:myDel.undelModal.step3.remainXGns")}</div>
          <div className="value">
            <MissingLogo symbol={XGNS_TOKEN.symbol} url={XGNS_TOKEN.logoURI} width={24} />
            {formatOtherPrice(calculatedValues.remainingAmount, {
              isKMB: false,
              usd: false,
            })}
            {` ${XGNS_TOKEN.symbol}`}
          </div>
        </div>
        <div className="info-rows">
          <div className="label">{t("Governance:myDel.undelModal.step3.remainVotingWeight")}</div>
          <div className="value">
            {`${formatOtherPrice(calculatedValues.currentVotingWeight, {
              usd: false,
            })}% -> ${formatOtherPrice(calculatedValues.newVotingWeight, {
              usd: false,
            })}%`}
          </div>
        </div>
        <div className="info-rows">
          <div className="label">
            {t("Governance:myDel.undelModal.step3.aprChange")}
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>{t("Governance:myDel.undelModal.step3.aprTooltip")}</ToolTipContentWrapper>
              }
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">{`${formatOtherPrice(apy, {
            isKMB: false,
            usd: false,
          })}% -> ${
            currentDelegatedAmount <= Number(gnsAmountInput.amount)
              ? 0
              : formatOtherPrice(apy, { isKMB: false, usd: false })
          }%`}</div>
        </div>
      </article>
      <WarningCard
        icon={<IconCircleExclamationMark />}
        title={t("Governance:myDel.undelModal.warning.title")}
        content={
          <MyDelWarningContentWrapper>
            {t("Governance:myDel.undelModal.warning.description")}
            <a href={EXT_URL.DOCS.XGNS} target="_blank" className="learn-more-box">
              <p>{t("common:learnMore")}</p>
              <IconNewTab color={theme.color.icon21} />
            </a>
          </MyDelWarningContentWrapper>
        }
      />
      <Button
        onClick={handleSubmit}
        text={t("Governance:myDel.undelModal.ctaBtn")}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        disabled={isSubmitDisabled}
        className="button-confirm"
      />
    </>
  );

  return (
    <Modal>
      <div className="modal-wrapper">{showDelegateInfo()}</div>
    </Modal>
  );
};

export default MyDelegationUndelegateModal;
