import { useTranslation } from "react-i18next";

import { useFaucetGRC20 } from "@hooks/faucet/use-faucet-grc20";
import { useFaucetNative } from "@hooks/faucet/use-faucet-native";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useSnackbar } from "@hooks/common/use-snackbar";

import { DepositIconWrapper } from "../Header.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import IconDownload from "@components/common/icons/IconDownload";
import { FAUCET_RESPONSE_MESSAGE } from "@common/errors/faucet/faucet-error";

const FAUCET_SNACKBAR_TITLE = {
  DEFAULT: "Faucet Receive",
  PENDING: "Receiving Faucet",
} as const;
const FAUCET_SNACKBAR_TIMEOUT = 3000;

export const FaucetButton = () => {
  const { t } = useTranslation();
  const { enqueue, dequeue } = useSnackbar();

  const { faucetGRC20, isLoadingFaucetGRC20, isSupportedFaucetGRC20 } = useFaucetGRC20();
  const { faucetNative, isLoadingFaucetNative, isSupportedFaucetNative } = useFaucetNative();

  const { refetchGnotBalance } = useWallet();
  const { refetchGrc20Balances, updateBalances } = useTokenData(true);

  const isLoading = isLoadingFaucetGRC20 || isLoadingFaucetNative;

  const onClickFaucetButton = async (): Promise<void> => {
    if (isLoading) return;

    const promises = [];

    if (isSupportedFaucetGRC20) {
      promises.push(faucetGRC20());
    }
    if (isSupportedFaucetNative) {
      promises.push(faucetNative());
    }

    if (promises.length === 0) {
      enqueue(
        {
          title: FAUCET_SNACKBAR_TITLE.DEFAULT,
          description: FAUCET_RESPONSE_MESSAGE.ERROR.NO_SUPPORTED_FAUCET,
        },
        {
          id: Date.now(),
          timeout: FAUCET_SNACKBAR_TIMEOUT,
          type: "error",
        },
      );
      return;
    }

    const pendingId = Date.now();
    enqueue(
      {
        title: FAUCET_SNACKBAR_TITLE.PENDING,
        description: "Waiting for Request Confirmation",
      },
      {
        id: pendingId,
        timeout: 30_000,
        type: "pending",
      },
    );

    try {
      const results = await Promise.allSettled(promises);

      const successResults = results.filter(result => result.status === "fulfilled" && result.value.success);
      const failedResults = results.filter(
        result => result.status === "rejected" || (result.status === "fulfilled" && !result.value.success),
      );

      dequeue(pendingId);

      if (successResults.length > 0) {
        setTimeout(() => {
          refetchGnotBalance();
          refetchGrc20Balances();
          updateBalances();
        }, 2000);

        enqueue(
          {
            title: FAUCET_SNACKBAR_TITLE.DEFAULT,
            description: FAUCET_RESPONSE_MESSAGE.SUCCESS.DEFAULT,
          },
          {
            id: Date.now(),
            timeout: 3000,
            type: "success",
          },
        );
      } else {
        const firstError = failedResults[0];
        const errorMessage =
          firstError?.status === "fulfilled"
            ? firstError.value.message
            : FAUCET_RESPONSE_MESSAGE.ERROR.FAUCET_REQUEST_FAILED;

        enqueue(
          {
            title: FAUCET_SNACKBAR_TITLE.DEFAULT,
            description: errorMessage,
          },
          {
            id: Date.now(),
            timeout: 3000,
            type: "error",
          },
        );
      }
    } catch (error) {
      console.error("Faucet request failed unexpectedly:", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        context: "FaucetButton onClick",
        supportedGRC20: isSupportedFaucetGRC20,
        supportedNative: isSupportedFaucetNative,
      });

      dequeue(pendingId);

      enqueue(
        {
          title: FAUCET_SNACKBAR_TITLE.DEFAULT,
          description: FAUCET_RESPONSE_MESSAGE.ERROR.UNEXPECTED,
        },
        {
          id: Date.now(),
          timeout: FAUCET_SNACKBAR_TIMEOUT,
          type: "error",
        },
      );
    }
  };

  return (
    <Button
      leftIcon={
        <DepositIconWrapper>
          {isLoading ? <LoadingSpinner className="loading-button" /> : <IconDownload />}
        </DepositIconWrapper>
      }
      text={isLoading ? null : t("HeaderFooter:Faucet")}
      onClick={onClickFaucetButton}
      style={{
        minWidth: 95,
        hierarchy: ButtonHierarchy.Primary,
        fontType: "p1",
        padding: "10px 16px 10px 14px",
        gap: "8px",
      }}
    />
  );
};
