import React from "react";
import BigNumber from "bignumber.js";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetTokenPrices } from "@query/token";
import { Document, TransactionData } from "src/types/transaction-messages.types";
import { mappedTransactionData } from "@utils/messages.utils";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import { GasToken } from "@common/values/token-constant";
import { TokenModel } from "@models/token/token-model";

import TransactionApprovalModal from "@components/common/transaction-approval-modal/TransactionApprovalModal";

interface Props {
  onApprove: (document: Document) => void;
  onReject: () => void;
  document: Document;
}

export interface DisplayGasFee {
  amount: string;
  amountRaw: string;
  usdValue: string;
  gasToken: TokenModel;
}

const TransactionApprovalModalContainer = ({ onApprove, onReject, document }: Props) => {
  const { isSwitchNetwork, walletType } = useWallet();
  const { data: gasTokenPrice } = useGetTokenPrices(GasToken.path);

  const [transactionDocument, setTransactionDocument] = React.useState<Document>(document);
  const [transactionData, setTransactionData] = React.useState<TransactionData>();
  const [memo, setMemo] = React.useState<string>("");

  const gasFee: DisplayGasFee | null = React.useMemo(() => {
    if (!transactionDocument || !transactionDocument.fee) return null;

    const totalAmountRaw = transactionDocument.fee.amount
      .reduce((sum, item) => {
        return sum.plus(new BigNumber(item.amount));
      }, new BigNumber(0))
      .toString();

    const displayTokenAmount = makeDisplayTokenAmount(GasToken, totalAmountRaw);

    const usdValue = gasTokenPrice?.usd
      ? BigNumber(displayTokenAmount ?? 0)
          .multipliedBy(gasTokenPrice.usd)
          .toFixed(2)
      : "0";

    return {
      amount: String(displayTokenAmount ?? 0),
      amountRaw: totalAmountRaw,
      usdValue,
      gasToken: GasToken,
    };
  }, [gasTokenPrice?.usd, transactionDocument]);

  const handleApprove = () => {
    onApprove(transactionDocument);
  };

  const memoChangeHandler = (memo: string): void => {
    setMemo(memo);
    setTransactionDocument(prev => ({
      ...prev,
      memo,
    }));
  };

  /**
   * Set the initial state when the document prop is changed
   * 1. Store the new document in the transactionDocument state
   * 2. Map and store document as TransactionData type based on document
   * 3. Save the memo field of document to memo state
   */
  React.useEffect(() => {
    setTransactionDocument(document);
    setTransactionData(mappedTransactionData(document));
    setMemo(document.memo || "");
  }, [document]);

  return (
    <TransactionApprovalModal
      onConfirm={handleApprove}
      onCancel={onReject}
      caller={transactionData?.contracts[0].value.caller || ""}
      contracts={transactionData?.contracts || []}
      transactionMessageRaw={JSON.stringify(transactionDocument, null, 2)}
      memo={memo}
      isSwitchNetwork={isSwitchNetwork}
      walletType={walletType}
      memoChangeHandler={memoChangeHandler}
      gasFee={gasFee}
    />
  );
};

export default TransactionApprovalModalContainer;
