import React from "react";

import ApproveTransactionModal from "@components/common/approve-transaction-modal/ApproveTransactionModal";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";

interface Props {
  onApprove: () => void;
}

// import { Document, TransactionData } from "src/types/transaction-messages.types";

// function mappedTransactionData(document: Document): TransactionData {
//   return {
//     messages: document.msgs,
//     contracts: document.msgs.map(message => {
//       return {
//         type: message?.type || "",
//         function: message?.type === "/bank.MsgSend" ? "Transfer" : message?.value?.func || "",
//         value: message?.value || "",
//       };
//     }),
//     gasWanted: document.fee.gas,
//     gasFee: `${document.fee.amount[0].amount}${document.fee.amount[0].denom}`,
//     memo: `${document.memo || ""}`,
//     document,
//   };
// }

// const DEFAULT_DENOM = "GNOT";

const ApproveTransactionModalContainer = ({ onApprove }: Props) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);

  const handleConfirm = () => {
    onApprove();
    setOpenedModal(false);
  };

  const handleCancel = () => {
    setOpenedModal(false);
  };

  return <ApproveTransactionModal onConfirm={handleConfirm} onCancel={handleCancel} />;
};

export default ApproveTransactionModalContainer;
