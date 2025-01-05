import { WalletTypeState } from "src/types/wallet.types";

type TransactionFunction = (...args: []) => Promise<unknown>;

export const withTransactionHandler =
  (walletType: WalletTypeState, transactionFn: TransactionFunction) =>
  async (...args: Parameters<TransactionFunction>) => {
    if (walletType.type === "SOCIAL_WALLET") {
      // const { openSocialTransactionModal, closeSocialTransactionModal } = useSocialWalletConnectingModal();
      // try {
      //   openSocialTransactionModal();
      //   const result = await transactionFn(...args);
      //   closeSocialTransactionModal();
      //   return result;
      // } catch (error) {
      //   closeSocialTransactionModal();
      //   throw error;
      // }
    }

    // Adena Wallet Transaction
    return transactionFn(...args);
  };
