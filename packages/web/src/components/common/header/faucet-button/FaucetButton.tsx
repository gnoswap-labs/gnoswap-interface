import { useTranslation } from "react-i18next";

import { useFaucet } from "@hooks/faucet/use-faucet";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useSnackbar } from "@hooks/common/use-snackbar";
import { makeRandomId } from "@utils/common";

import { DepositIconWrapper } from "../Header.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import IconDownload from "@components/common/icons/IconDownload";

export const FaucetButton = () => {
  const { t } = useTranslation();
  const { enqueue } = useSnackbar();

  const { faucet2, isLoading2 } = useFaucet();

  const { refetchGnotBalance } = useWallet();
  const { refetchGrc20Balances } = useTokenData();

  const onClickFaucetButton = (): void => {
    if (isLoading2) return;
    faucet2().then(result => {
      refetchGnotBalance();
      refetchGrc20Balances();
      enqueue(
        {
          title: "Faucet Receive",
          description: result.message,
        },
        {
          id: makeRandomId(),
          timeout: 3000,
          type: result.success === true ? "success" : "error",
        },
      );
    });
  };

  return (
    <>
      <Button
        leftIcon={
          <DepositIconWrapper>
            {isLoading2 ? <LoadingSpinner className="loading-button" /> : <IconDownload />}
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
    </>
  );
};
