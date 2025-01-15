import TransactionApprovalModal from "@components/common/transaction-approval-modal/TransactionApprovalModal";
import { mappedTransactionData } from "@utils/messages.utils";
import React from "react";
import { Document, TransactionData } from "src/types/transaction-messages.types";

interface Props {
  onApprove: () => void;
  onReject: () => void;
  document: Document;
}

const TransactionApprovalModalContainer = ({ onApprove, onReject, document }: Props) => {
  const [transactionData, setTransactionData] = React.useState<TransactionData>();

  React.useEffect(() => {
    setTransactionData(mappedTransactionData(document));
  }, [document]);

  return (
    <TransactionApprovalModal
      onConfirm={onApprove}
      onCancel={onReject}
      document={document}
      caller={transactionData?.contracts[0].value.caller || ""}
      contracts={transactionData?.contracts || []}
      transactionMessageRaw={JSON.stringify(document, null, 2)}
    />
  );
};

export default TransactionApprovalModalContainer;
