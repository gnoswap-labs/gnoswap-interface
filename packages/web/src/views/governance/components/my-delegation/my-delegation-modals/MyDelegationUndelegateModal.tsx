import { useTheme } from "@emotion/react";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import { IconCircleExclamationMark } from "@components/common/icons/IconExclamationRound";
import IconInfo from "@components/common/icons/IconInfo";
import IconNewTab from "@components/common/icons/IconNewTab";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { Overlay } from "@components/common/modal/Modal.styles";
import TokenAmountInput from "@components/common/token-amount-input/TokenAmountInput";
import Tooltip from "@components/common/tooltip/Tooltip";
import WarningCard from "@components/common/warning-card/WarningCard";
import { EXT_URL } from "@constants/external-url.contant";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import useLockedBody from "@hooks/common/use-lock-body";
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { DelegationItemInfo, nullMyDelegationInfo } from "@repositories/governance";
import { formatOtherPrice } from "@utils/new-number-utils";

import UndelegateSelect from "./undelegate-selector/UndelegateSelect";

import {
  CreateProposalModalBackground,
  MyDelegationModalWrapper,
  MyDelWarningContentWrapper,
  ToolTipContentWrapper,
} from "./MyDelegationModals.styles";

interface MyDelegationUndelegateModalProps {
  currentDelegatedAmount: number;
  totalDelegatedAmount: number;
  delegatedInfos: DelegationItemInfo[];
  isWalletConnected: boolean;
  onSubmit: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MyDelegationUndelegateModal: React.FC<MyDelegationUndelegateModalProps> = ({
  currentDelegatedAmount,
  totalDelegatedAmount,
  delegatedInfos,
  isWalletConnected,
  onSubmit,
  setIsOpen,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const gnsAmountInput = useTokenAmountInput(GNS_TOKEN);
  const [selectedDelegatedInfo, setSelectedDelegatedInfo] = useState<DelegationItemInfo>(
    delegatedInfos[0] || nullMyDelegationInfo,
  );

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (typeof window !== "undefined" && modalRef.current) {
      const height = modalRef.current.getBoundingClientRect().height;
      if (height >= window?.innerHeight) {
        modalRef.current.style.top = "0";
        modalRef.current.style.transform = "translateX(-50%)";
      } else {
        modalRef.current.style.top = "50%";
        modalRef.current.style.transform = "translate(-50%, -50%)";
      }
    }
  };

  useLockedBody(true);
  useEscCloseModal(() => setIsOpen(false));

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalRef]);


  const isSubmit = false;

const showDelegateInfo = () => (
  <>
    <div className="modal-content-header">
      <div className="title-area">{t("Governance:myDel.undelegate")}</div>
      <div className="close-wrap" onClick={() => setIsOpen(false)}>
        <IconClose className="close-icon" />
      </div>
    </div>

    <UndelegateSelect
      delegatedInfos={delegatedInfos}
      select={setSelectedDelegatedInfo}
      selectedDelegationInfo={selectedDelegatedInfo}
    />

    <article>
      <div className="section-title">
        {t("Governance:myDel.undelModal.step2.title")}
      </div>
      <TokenAmountInput
        {...gnsAmountInput}
        token={GNS_TOKEN}
        connected={isWalletConnected}
        changeAmount={gnsAmountInput.changeAmount}
        changeToken={() => {}}
      />
    </article>

    <article>
      <div className="section-title">
        {t("Governance:myDel.undelModal.step3.title")}
      </div>
      <div className="info-rows">
        <div>
          <div className="label">
            {t("Governance:myDel.undelModal.step3.remainXGns")}
          </div>
          <div className="value">
            <MissingLogo symbol="xGNS" url={GNS_TOKEN.logoURI} width={24} />
            {(
              currentDelegatedAmount - Number(gnsAmountInput.amount)
            ).toLocaleString("en")}
            {" xGNS"}
          </div>
        </div>
      </div>
      <div className="info-rows">
        <div>
          <div className="label">
            {t("Governance:myDel.undelModal.step3.remainVotingWeight")}
          </div>
          <div className="value">
            {`${formatOtherPrice(
              (currentDelegatedAmount * 100) / totalDelegatedAmount,
              {
                usd: false,
              },
            )}% -> ${formatOtherPrice(
              ((currentDelegatedAmount - Number(gnsAmountInput.amount)) * 100) /
                totalDelegatedAmount,
              {
                usd: false,
              },
            )}%`}
          </div>
        </div>
      </div>
      <div className="info-rows">
        <div>
          <div className="label">
            {t("Governance:myDel.undelModal.step3.aprChange")}
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  {t("Governance:myDel.undelModal.step3.aprTooltip")}
                </ToolTipContentWrapper>
              }
            >
              <IconInfo size={16} />
            </Tooltip>
          </div>
          <div className="value">? %</div>
        </div>
      </div>
    </article>

    <WarningCard
      icon={<IconCircleExclamationMark />}
      title={t("Governance:myDel.undelModal.warning.title")}
      content={
        <MyDelWarningContentWrapper>
          {t("Governance:myDel.undelModal.warning.description")}
          <a
            href={EXT_URL.DOCS.XGNS}
            target="_blank"
            className="learn-more-box"
          >
            <p>{t("common:learnMore")}</p>
            <IconNewTab color={theme.color.icon21} />
          </a>
        </MyDelWarningContentWrapper>
      }
    />

    <Button
      onClick={onSubmit}
      text={t("Governance:myDel.undelModal.ctaBtn")}
      style={{
        hierarchy: ButtonHierarchy.Primary,
        fullWidth: true,
      }}
      disabled={!isSubmit}
      className="button-confirm"
    />
  </>
);

  return (
    <>
      <CreateProposalModalBackground>
        <MyDelegationModalWrapper>
          {showDelegateInfo()}
        </MyDelegationModalWrapper>
      </CreateProposalModalBackground>
      <Overlay onClick={() => setIsOpen(false)} />
    </>
  );
};

export default MyDelegationUndelegateModal;
