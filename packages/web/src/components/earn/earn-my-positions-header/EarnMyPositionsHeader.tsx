import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { useCallback, useMemo } from "react";
import { PositionsWrapper } from "./EarnMyPositionsHeader.styles";

export interface EarnMyPositionsHeaderProps {
  connected: boolean;
  isSwitchNetwork: boolean;
  availableStake: boolean;
  moveEarnAdd: () => void;
  moveEarnStake: () => void;
}

const EarnMyPositionsHeader: React.FC<EarnMyPositionsHeaderProps> = ({
  connected,
  isSwitchNetwork,
  availableStake,
  moveEarnAdd,
  moveEarnStake,
}) => {

  const disabledStake = useMemo(() => {
    return !connected || isSwitchNetwork || !availableStake;
  }, [availableStake, connected, isSwitchNetwork]);

  const onClickNewPosition = useCallback(() => {
    moveEarnAdd();
  }, [moveEarnAdd]);

  return (
    <PositionsWrapper>
      <h2>My Positions</h2>
      <div className="button-wrapper">
        <Button
          text="Stake Position"
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            height: 36,
            padding: "10px 16px",
          }}
          disabled={disabledStake}
          onClick={moveEarnStake}
        />
        <Button
          text="New Position"
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            height: 36,
            padding: "10px 16px",
          }}
          onClick={onClickNewPosition}
        />
      </div>
    </PositionsWrapper>
  );
};

export default EarnMyPositionsHeader;
