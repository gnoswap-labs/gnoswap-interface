import React from "react";

import { Document, TransactionData } from "src/types/transaction-messages.types";
import { mappedTransactionData } from "@utils/messages.utils";

import TransactionApprovalModal from "@components/common/transaction-approval-modal/TransactionApprovalModal";

interface Props {
  onApprove: (document: Document) => void;
  onReject: () => void;
  document: Document;
}

const TransactionApprovalModalContainer = ({ onApprove, onReject, document }: Props) => {
  const [transactionDocument, setTransactionDocument] = React.useState<Document>(document);
  const [transactionData, setTransactionData] = React.useState<TransactionData>();
  const [memo, setMemo] = React.useState<string>("");

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
      memoChangeHandler={memoChangeHandler}
    />
  );
};

export default TransactionApprovalModalContainer;
