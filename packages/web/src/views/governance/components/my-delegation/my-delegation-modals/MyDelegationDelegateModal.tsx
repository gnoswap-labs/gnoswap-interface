import { useTheme } from "@emotion/react";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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
import { useTokenAmountInput } from "@hooks/token/use-token-amount-input";
import { DelegateeInfo, nullDelegateeInfo } from "@repositories/governance";
import { formatOtherPrice } from "@utils/new-number-utils";
import { addressValidationCheck } from "@utils/validation-utils";

import DelegateeChip from "./delegatee-chip/DelegateeChip";

import {
  MyDelegationModalWrapper,
  MyDelWarningContentWrapper,
  ToolTipContentWrapper
} from "./MyDelegationModals.styles";

interface MyDelegationDelegateModalProps {
  currentDelegatedAmount: number;
  totalDelegatedAmount: number;
  apy: number;
  delegatees: DelegateeInfo[];
  isWalletConnected: boolean;
  onSubmit: (toName: string, toAddress: string, amount: string) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MyDelegationDelegateModal: React.FC<MyDelegationDelegateModalProps> = ({
  currentDelegatedAmount,
  totalDelegatedAmount,
  apy,
  delegatees,
  isWalletConnected,
  onSubmit,
  setIsOpen,
}) => {
  const Modal = useMemo(
    () => withLocalModal(MyDelegationModalWrapper, setIsOpen),
    [setIsOpen],
  );
  const { t } = useTranslation();
  const { getAccountUrl } = useGnoscanUrl();
  const theme = useTheme();
  const gnsAmountInput = useTokenAmountInput(GNS_TOKEN);
  const [stage, setStage] = useState<"MAIN" | "SELECT_DELEGATE">("MAIN");
  const [delegatee, setDelegatee] = useState<DelegateeInfo>(
    delegatees[0] || nullDelegateeInfo,
  );
  const [tmpDelegatee, setTmpDelegatee] = useState<DelegateeInfo>(
    delegatees[0] || nullDelegateeInfo,
  );
  const [selfAddress, setSelfAddress] = useState("");
  const isSelfAddrValid = addressValidationCheck(selfAddress);

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
              <ToolTipContentWrapper>
                {t("Governance:myDel.delModal.step1.tooltip")}
              </ToolTipContentWrapper>
            }
          >
            <IconInfo size={16} />
          </Tooltip>
        </div>
        <div
          className="delegatee-select-btn"
          onClick={() => setStage("SELECT_DELEGATE")}
        >
          <div className="selected-delegatee">
            <MissingLogo
              url={delegatee.logoUrl}
              symbol={delegatee.name}
              width={24}
            />
            {delegatee.name}
            <div
              className="addr"
              onClick={e => {
                e.stopPropagation();
                window.open(getAccountUrl(delegatee.address));
              }}
            >
              {[
                delegatee.address.slice(0, 8),
                delegatee.address.slice(32, 40),
              ].join("...")}
              <IconNewTab />
            </div>
          </div>
          <IconStrokeArrowRight className="arrow" />
        </div>
      </article>

      <article>
        <div className="section-title">
          {t("Governance:myDel.delModal.step2.title")}
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
          {t("Governance:myDel.delModal.step3.title")}
        </div>
        <div className="info-rows">
          <div>
            <div className="label">
              {t("Governance:myDel.delModal.step3.currentlyDel")}
            </div>
            <div className="value">
              <MissingLogo symbol="xGNS" url={GNS_TOKEN.logoURI} width={24} />
              {currentDelegatedAmount.toLocaleString("en")}
              {" xGNS"}
            </div>
          </div>
        </div>
        <div className="info-rows">
          <div>
            <div className="label">
              {t("Governance:myDel.delModal.step3.newlyDel")}
            </div>
            <div className="value">
              <MissingLogo symbol="xGNS" url={GNS_TOKEN.logoURI} width={24} />
              {Number(gnsAmountInput.amount).toLocaleString()}
              {" xGNS"}
            </div>
          </div>
        </div>
        <div className="info-rows">
          <div>
            <div className="label">
              {t("Governance:myDel.delModal.step3.votingPowerShare")}
            </div>
            <div className="value">
              {`${formatOtherPrice(
                totalDelegatedAmount
                  ? (currentDelegatedAmount * 100) / totalDelegatedAmount
                  : 0,
                {
                  usd: false,
                },
              )}% -> ${formatOtherPrice(
                totalDelegatedAmount + Number(gnsAmountInput.amount)
                  ? ((currentDelegatedAmount + Number(gnsAmountInput.amount)) *
                      100) /
                      (totalDelegatedAmount + Number(gnsAmountInput.amount))
                  : 0,
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
              {t("Governance:myDel.delModal.step3.estimatedAPR")}
              <Tooltip
                placement="top"
                FloatingContent={
                  <ToolTipContentWrapper>
                    {t("Governance:myDel.delModal.step3.aprTooltip")}
                  </ToolTipContentWrapper>
                }
              >
                <IconInfo size={16} />
              </Tooltip>
            </div>
            <div className="value">{apy.toLocaleString("en")}%</div>
          </div>
        </div>
      </article>

      <WarningCard
        icon={<IconCircleExclamationMark />}
        title={t("Governance:myDel.delModal.warning.title")}
        content={
          <MyDelWarningContentWrapper>
            {t("Governance:myDel.delModal.warning.description")}
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
        onClick={() => {
          onSubmit(delegatee.name, delegatee.address, gnsAmountInput.amount);
          setIsOpen(false);
        }}
        text={t("Governance:myDel.delModal.ctaBtn")}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        disabled={
          gnsAmountInput.amount === "0" ||
          Number(gnsAmountInput.amount) >
            Number(gnsAmountInput.balance.replaceAll(",", ""))
        }
        className="button-confirm"
      />
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
            ...nullDelegateeInfo,
            name: t("Governance:myDel.delModal.selectDel.self.chip"),
          }}
          selected={tmpDelegatee.address === ""}
          onClick={() =>
            setTmpDelegatee({
              ...nullDelegateeInfo,
              name: t("Governance:myDel.delModal.selectDel.self.chip"),
            })
          }
        />
        {delegatees.map((item: DelegateeInfo, index: number) => {
          return (
            <DelegateeChip
              key={index}
              delegatee={item}
              selected={item.address === tmpDelegatee.address}
              onClick={() => setTmpDelegatee(item)}
            />
          );
        })}
      </div>

      {tmpDelegatee.name ===
        t("Governance:myDel.delModal.selectDel.self.chip") && (
        <>
          <div className="self-address">
            <div className="withdraw-address">
              <input
                className="address-input"
                value={selfAddress}
                onChange={e => setSelfAddress(e.target.value)}
                placeholder={t(
                  "Governance:myDel.delModal.selectDel.self.placeholder",
                )}
              />
            </div>
          </div>
          <div className="divider" />
        </>
      )}

      <article>
        <div className="delegatee-info-rows">
          <div>
            <div className="label">
              {t("Governance:myDel.delModal.selectDel.votingPower")}
            </div>
            <div className="value">
              <MissingLogo symbol="xGNS" url={XGNS_TOKEN.logoURI} width={24} />
              {tmpDelegatee.votingPower.toLocaleString("en")}{" "}
              {XGNS_TOKEN.symbol}
              <span className="sub">
                {` (${formatOtherPrice(
                  totalDelegatedAmount
                    ? (tmpDelegatee.votingPower * 100) / totalDelegatedAmount
                    : 0,
                  {
                    usd: false,
                  },
                )}%)`}
              </span>
            </div>
          </div>
        </div>
        <div className="delegatee-info-rows">
          <div>
            <div className="label">
              {t("Governance:myDel.delModal.selectDel.address")}
            </div>
            {tmpDelegatee.address !== "" ? (
              <div
                className="value clickable"
                onClick={e => {
                  e.stopPropagation();
                  window.open(getAccountUrl(tmpDelegatee.address));
                }}
              >
                {[
                  tmpDelegatee.address.slice(0, 8),
                  tmpDelegatee.address.slice(32, 40),
                ].join("...")}
                <IconNewTab />
              </div>
            ) : (
              <div className="value"> - </div>
            )}
          </div>
        </div>
        <div className="delegatee-info-rows">
          <div>
            <div className="label">
              {t("Governance:myDel.delModal.selectDel.description")}
            </div>
            <div className="value">{tmpDelegatee.description || "-"}</div>
          </div>
        </div>
        <div className="delegatee-info-rows">
          <div>
            <div className="label">
              {t("Governance:myDel.delModal.selectDel.website")}
            </div>
            {tmpDelegatee.website !== "" ? (
              <div
                className="value clickable"
                onClick={e => {
                  e.stopPropagation();
                  window.open(tmpDelegatee.website);
                }}
              >
                {tmpDelegatee.website}
                <IconNewTab />
              </div>
            ) : (
              <div className="value"> - </div>
            )}
          </div>
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
        text={t("Governance:myDel.delModal.selectDel.selectBtn")}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        disabled={tmpDelegatee.address === "" && !isSelfAddrValid}
        className="button-confirm"
      />
    </>
  );

  return (
    <Modal className={stage === "MAIN" ? "" : "large-gap"}>
      {stage === "MAIN" ? showDelegateInfo() : showDelegateeSelector()}
    </Modal>
  );
};

export default MyDelegationDelegateModal;
