import { useTranslation } from "react-i18next";

import IconUpload from "@components/common/icons/IconUpload";

import { LoadButton } from "./buttons.styles";

export const WithdrawButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <LoadButton className="withdraw-pd" onClick={onClick} disabled={disabled}>
      <IconUpload className="upload" />
      <span>{t("Wallet:assets.action.withdraw")}</span>
    </LoadButton>
  );
};
