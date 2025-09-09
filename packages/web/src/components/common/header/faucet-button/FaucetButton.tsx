import React from "react";
import { useTranslation } from "react-i18next";

import { useFaucet } from "@hooks/faucet/use-faucet";

import { FaucetTooltip } from "./FaucetButton.styles";
import { DepositIconWrapper } from "../Header.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import IconDownload from "@components/common/icons/IconDownload";
import IconPolygon from "@components/common/icons/IconPolygon";

interface FaucetButtonProps {
  themeKey: "dark" | "light";
}

export const FaucetButton = ({ themeKey }: FaucetButtonProps) => {
  const { t } = useTranslation();
  const { faucet, isLoading } = useFaucet();
  const [faucetTooltipContents, setFaucetTooltipContents] = React.useState("");

  const onClickFaucetButton = (): void => {
    if (isLoading) return;
    faucet().then(result => {
      setFaucetTooltipContents(result.message);
      setTimeout(() => {
        setFaucetTooltipContents("");
      }, 2000);
    });
  };

  return (
    <>
      <Button
        leftIcon={
          <DepositIconWrapper>
            {isLoading ? <LoadingSpinner className="loading-button" /> : <IconDownload />}
          </DepositIconWrapper>
        }
        text={t("HeaderFooter:Faucet")}
        onClick={onClickFaucetButton}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fontType: "p1",
          padding: "10px 16px 10px 14px",
          gap: "8px",
        }}
      />
      {faucetTooltipContents && (
        <FaucetTooltip>
          <IconPolygon className="polygon-icon" />
          <div className={`box ${themeKey}-shadow`}>
            <span>{faucetTooltipContents}</span>
          </div>
        </FaucetTooltip>
      )}
    </>
  );
};
