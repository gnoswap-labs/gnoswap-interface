import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLinkOff from "@components/common/icons/IconLinkOff";

import { UnconnectedWrapper } from "./EarnMyPositionsUnconnected.styles";

export interface EarnMyPositionsUnconnectedProps {
  connect: () => void;
  connected: boolean;
}

const EarnMyPositionsUnconnected: React.FC<EarnMyPositionsUnconnectedProps> = ({
  connect,
  connected,
}) => {
  const { t } = useTranslation();

  const onClickConnect = useCallback(() => {
    connect();
  }, [connect]);

  return (
    <UnconnectedWrapper>
      <IconLinkOff className="unconnected-icon" />
      {!connected ? (
        <p
          dangerouslySetInnerHTML={{
            __html: t("Earn:positions.unconnect.connect"),
          }}
        />
      ) : (
        <p>{t("Earn:positions.unconnect.switchNetwork")}</p>
      )}
      <Button
        text={
          connected ? t("business:switchGnoland") : t("business:walletLogin")
        }
        onClick={onClickConnect}
        style={{ hierarchy: ButtonHierarchy.Primary }}
        className="button-connect-wallet"
      />
    </UnconnectedWrapper>
  );
};

export default EarnMyPositionsUnconnected;
