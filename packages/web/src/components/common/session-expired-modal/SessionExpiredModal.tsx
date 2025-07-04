import React from "react";
import { Trans, useTranslation } from "react-i18next";

import { SessionExpiredModalWrapper } from "./SessionExpiredModal.styles";
import IconClose from "../icons/IconCancel";
import IconFailed from "../icons/IconFailed";
import Button, { ButtonHierarchy } from "../button/Button";

interface Props {
  close: () => void;
}

const SessionExpiredModal = ({ close }: Props) => {
  const { t } = useTranslation();

  return (
    <SessionExpiredModalWrapper>
      <div className="modal-body">
        <div className="header">
          <div className="close-wrap">
            <button onClick={close}>
              <IconClose className="close-icon" />
            </button>
          </div>
        </div>

        <div className="content">
          <IconFailed className="warning-logo" />
          <div className="detail">
            <h5>{t("common:social.modal.expiredSession.title")}</h5>
            <div className="description">
              <Trans i18nKey={"common:social.modal.expiredSession.desc"} components={{ br: <br /> }} />
            </div>
          </div>
          <div className="button-wrapper">
            <Button
              text={t("common:action.close")}
              style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
              onClick={close}
              className="button-confirm"
            />
          </div>
        </div>
      </div>
    </SessionExpiredModalWrapper>
  );
};

export default SessionExpiredModal;
