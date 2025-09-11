import { useTranslation } from "react-i18next";

import { useFaucetGRC20 } from "@hooks/faucet/use-faucet-grc20";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useSnackbar } from "@hooks/common/use-snackbar";

import { DepositIconWrapper } from "../Header.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import IconDownload from "@components/common/icons/IconDownload";

export const FaucetButton = () => {
  const { t } = useTranslation();
  const { enqueue } = useSnackbar();

  const { faucetGRC20, isLoading } = useFaucetGRC20();

  const { refetchGnotBalance } = useWallet();
  const { refetchGrc20Balances } = useTokenData();

  const onClickFaucetButton = (): void => {
    if (isLoading) return;
    faucetGRC20().then(result => {
      refetchGnotBalance();
      refetchGrc20Balances();
      enqueue(
        {
          title: "Faucet Receive",
          description: result.message,
        },
        {
          id: Date.now(),
          timeout: 3000,
          type: result.success ? "success" : "error",
        },
      );
    });
  };

  return (
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
  );
};
