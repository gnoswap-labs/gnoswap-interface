import React from "react";
import { DividerWrapper } from "./ConnectWalletModalDivider.styles";
import { useTranslation } from "react-i18next";

const ConnectWalletModalDivider = () => {
  const { t } = useTranslation();
  return (
    <DividerWrapper>
      <span>{t("common:social.connect.or")}</span>
    </DividerWrapper>
  );
};

export default ConnectWalletModalDivider;
