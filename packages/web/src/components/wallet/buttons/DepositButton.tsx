import { useTranslation } from "react-i18next";

import IconDownload from "@components/common/icons/IconDownload";

import { LoadButton } from "./buttons.styles";

export const DepositButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <LoadButton onClick={onClick} disabled={disabled}>
      <IconDownload />
      <span>{t("Wallet:assets.action.deposit")}</span>
    </LoadButton>
  );
};
