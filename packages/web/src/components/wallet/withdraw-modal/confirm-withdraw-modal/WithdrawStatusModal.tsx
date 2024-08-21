import React, { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconClose from "@components/common/icons/IconCancel";
import IconFailed from "@components/common/icons/IconFailed";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconSuccess from "@components/common/icons/IconSuccess";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { usePositionModal } from "@hooks/common/use-position-modal";

import { WithdrawResponse } from "../useWithdrawTokens";

import {
  ConfirmModal,
  WithdrawStatusBackground,
} from "./WithdrawStatusModal.styles";

interface WithdrawStatusProps {
  withdrawResult: WithdrawResponse;
  close: () => void;
}

const WithdrawStatus: React.FC<WithdrawStatusProps> = ({
  withdrawResult,
  close,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEscCloseModal(close);
  usePositionModal(menuRef);

  return (
    <>
      <WithdrawStatusBackground>
        <ConfirmModal ref={menuRef} className={"modal-body-wrapper"}>
          <div
            className={`modal-body ${
              withdrawResult === null ? "modal-body-loading" : "submitted-modal"
            }`}
          >
            <div className={"modal-header model-header-submitted"}>
              <span />
              <div className="close-wrap" onClick={close}>
                <IconClose className="close-icon" />
              </div>
            </div>
            <ConfirmWithdrawResult
              withdrawResult={withdrawResult}
              close={close}
            />
          </div>
        </ConfirmModal>
      </WithdrawStatusBackground>
      <Overlay onClick={close} />
    </>
  );
};

interface ConfirmWithdrawResultProps {
  withdrawResult: WithdrawResponse;
  close: () => void;
}

const ConfirmWithdrawResult: React.FC<ConfirmWithdrawResultProps> = ({
  withdrawResult,
  close,
}) => {
  const { t } = useTranslation();

  if (withdrawResult === null) {
    return (
      <>
        <div className="animation">
          <LoadingSpinner />
        </div>
        <div className="transaction-state">
          <span className="submitted">
            {t("Modal:confirm.general.loading.title")}
          </span>
          <div className="view-transaction">
            <span>{t("Modal:confirm.general.loading.desc")}</span>
          </div>
        </div>
      </>
    );
  }

  if (withdrawResult.success) {
    return (
      <>
        <div className="animation">
          <IconSuccess className="animation-logo" />
        </div>
        <div className="transaction-state">
          <span className="submitted">
            {t("Modal:confirm.general.submitted.title")}
          </span>
          <div className="view-transaction">
            <span>{t("Modal:confirm.general.submitted.viewTx")}</span>
            <div
              className="open-link"
              onClick={() => {
                window.open(withdrawResult?.hash, "_blank");
              }}
            >
              <IconOpenLink className="open-logo" />
            </div>
          </div>
        </div>
        <div className="close-button">
          <Button
            text={t("common:action.close")}
            style={{
              fullWidth: true,
              fontType: "body7",
              hierarchy: ButtonHierarchy.Primary,
            }}
            onClick={close}
          />
        </div>
      </>
    );
  }

  if (withdrawResult.code !== 4000) {
    return (
      <>
        <div className="animation">
          <IconFailed className="animation-logo" />
        </div>
        <div className="transaction-state">
          <span className="submitted">
            {t("Modal:confirm.general.failed.title")}
          </span>
          <div className="view-transaction">
            <span>
              <Trans ns="Modal" i18nKey={"confirm.general.failed.desc"}>
                Your transcation has not been broadcasted. <br className="br" />
                Please try again.
              </Trans>
            </span>
          </div>
        </div>
        <div className="close-button">
          <Button
            text={t("common:action.close")}
            style={{
              fullWidth: true,
              height: 57,
              fontType: "body7",
              hierarchy: ButtonHierarchy.Primary,
            }}
            onClick={close}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="animation">
        <IconFailed className="animation-logo" />
      </div>
      <div className="transaction-state">
        <span className="submitted">
          {t("Modal:confirm.general.rejected.title")}
        </span>
        <div className="view-transaction">
          <span>
            <Trans ns="Modal" i18nKey={"confirm.general.rejected.desc"}>
              Your transaction has been rejected.
              <br /> Please try again.
            </Trans>
          </span>
        </div>
      </div>
      <div className="close-button">
        <Button
          text={t("common:action.close")}
          style={{
            fullWidth: true,
            height: 57,
            fontType: "body7",
            hierarchy: ButtonHierarchy.Primary,
          }}
          onClick={close}
        />
      </div>
    </>
  );
};

export default WithdrawStatus;
