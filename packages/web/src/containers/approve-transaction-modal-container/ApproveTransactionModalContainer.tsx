import { TransactionMessage } from "@common/clients/wallet-client/protocols";
import ApproveTransactionModal from "@components/common/approve-transaction-modal/ApproveTransactionModal";

interface Props {
  onApprove: () => void;
  onReject: () => void;
  messages: TransactionMessage[];
}

const ApproveTransactionModalContainer = ({ onApprove, onReject, messages }: Props) => {
  return <ApproveTransactionModal onConfirm={onApprove} onCancel={onReject} messages={messages} />;
};

export default ApproveTransactionModalContainer;
