import ApproveTransactionModal from "@components/common/approve-transaction-modal/ApproveTransactionModal";
import { mappedTransactionData } from "@utils/messages.utils";
import React from "react";
import { Document, TransactionData } from "src/types/transaction-messages.types";

interface Props {
  onApprove: () => void;
  onReject: () => void;
  document: Document;
}

const ApproveTransactionModalContainer = ({ onApprove, onReject, document }: Props) => {
  const [transactionData, setTransactionData] = React.useState<TransactionData>();

  React.useEffect(() => {
    setTransactionData(mappedTransactionData(document));
  }, [document]);

  return (
    <ApproveTransactionModal
      onConfirm={onApprove}
      onCancel={onReject}
      document={document}
      contracts={transactionData?.contracts || []}
      transactionMessageRaw={JSON.stringify(document, null, 2)}
    />
  );
};

export default ApproveTransactionModalContainer;
