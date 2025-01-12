import ApproveTransactionModal from "@components/common/approve-transaction-modal/ApproveTransactionModal";

interface Props {
  onApprove: () => void;
  onReject: () => void;
}

const ApproveTransactionModalContainer = ({ onApprove, onReject }: Props) => {
  return <ApproveTransactionModal onConfirm={onApprove} onCancel={onReject} />;
};

export default ApproveTransactionModalContainer;
