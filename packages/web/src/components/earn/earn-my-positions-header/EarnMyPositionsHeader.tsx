import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { useCallback, useMemo } from "react";
import { PositionsWrapper } from "./EarnMyPositionsHeader.styles";

export interface EarnMyPositionsHeaderProps {
  connected: boolean;
  moveEarnAdd: () => void;
}

const EarnMyPositionsHeader: React.FC<EarnMyPositionsHeaderProps> = ({
  connected,
  moveEarnAdd
}) => {

  const disabledNewPosition = useMemo(() => {
    return !connected;
  }, [connected]);

  const onClickNewPosition = useCallback(() => {
    if (disabledNewPosition) {
      return;
    }
    moveEarnAdd();
  }, [disabledNewPosition, moveEarnAdd]);

  return (
    <PositionsWrapper>
      <h2>My Positions</h2>
      <Button
        text="New Position"
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fontType: "p1",
          height: 36,
          width: 114,
          padding: "10px 16px",
        }}
        onClick={onClickNewPosition}
        disabled={disabledNewPosition}
      />
    </PositionsWrapper>
  );
};

export default EarnMyPositionsHeader;
