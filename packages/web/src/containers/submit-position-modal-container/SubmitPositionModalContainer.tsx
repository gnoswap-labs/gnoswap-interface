import SubmitPositionModal from "@components/stake/submit-position-modal/SubmitPositionModal";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface SubmitPositionModalContainerProps {
  positions: PoolPositionModel[];
  onSubmit: () => void;
  close: () => void;
}

const SubmitPositionModalContainer = ({
  positions,
  onSubmit,
  close,
}: SubmitPositionModalContainerProps) => {
  return (
    <SubmitPositionModal
      positions={positions}
      close={close}
      onSubmit={onSubmit}
    />
  );
};

export default SubmitPositionModalContainer;
