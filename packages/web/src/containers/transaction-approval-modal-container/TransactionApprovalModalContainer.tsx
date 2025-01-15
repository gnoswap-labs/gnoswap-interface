import React from "react";

import { Document, TransactionData } from "src/types/transaction-messages.types";
import { mappedTransactionData } from "@utils/messages.utils";

import TransactionApprovalModal from "@components/common/transaction-approval-modal/TransactionApprovalModal";

interface Props {
  onApprove: () => void;
  onReject: () => void;
  document: Document;
}

const TransactionApprovalModalContainer = ({ onApprove, onReject, document }: Props) => {
  const [transactionDocument, setTransactionDocument] = React.useState<Document>();
  const [transactionData, setTransactionData] = React.useState<TransactionData>();
  const [memo, setMemo] = React.useState<string>("");

  const memoChangeHandler = (memo: string): void => {
    setMemo(memo);
    if (transactionDocument) {
      setTransactionDocument(prev => {
        if (!prev) {
          return undefined;
        }
        return { ...document, memo };
      });
    }
  };

  const updateTransactionData = (): void => {
    if (!document) {
      return;
    }

    const currentMemo = memo;

    const updateDocument: Document = {
      ...document,
      memo: currentMemo,
    };

    setTransactionDocument(updateDocument);
    setTransactionData(mappedTransactionData(document));
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
    setMemo(document.memo);
  }, [document]);

  /**
   * Update transaction documents whenever memo state changes
   */
  React.useEffect(() => {
    updateTransactionData();
  }, [memo]);

  return (
    <TransactionApprovalModal
      onConfirm={onApprove}
      onCancel={onReject}
      caller={transactionData?.contracts[0].value.caller || ""}
      contracts={transactionData?.contracts || []}
      transactionMessageRaw={JSON.stringify(transactionDocument, null, 2)}
      memo={memo}
      memoChangeHandler={memoChangeHandler}
    />
  );
};

export default TransactionApprovalModalContainer;
