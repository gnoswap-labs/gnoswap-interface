import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { useCallback, useMemo } from "react";
import { PositionsWrapper } from "./EarnMyPositionsHeader.styles";
import Switch from "@components/common/switch/Switch";
import { PoolPositionModel } from "@models/position/pool-position-model";

export interface EarnMyPositionsHeaderProps {
  connected: boolean;
  isSwitchNetwork: boolean;
  availableStake: boolean;
  moveEarnAdd: () => void;
  moveEarnStake: () => void;
  isClosed: boolean;
  handleChangeClosed: () => void;
  positions: PoolPositionModel[];
}

const EarnMyPositionsHeader: React.FC<EarnMyPositionsHeaderProps> = ({
  connected,
  isSwitchNetwork,
  availableStake,
  moveEarnAdd,
  moveEarnStake,
  isClosed,
  handleChangeClosed,
  positions,
}) => {

  const disabledStake = useMemo(() => {
    return !connected || isSwitchNetwork || !availableStake;
  }, [availableStake, connected, isSwitchNetwork]);

  const onClickNewPosition = useCallback(() => {
    moveEarnAdd();
  }, [moveEarnAdd]);

  return (
    <PositionsWrapper>
      <div className="header-content">
        <h2>My Positions</h2>
        {positions.length > 0 && connected && <Switch
          checked={isClosed}
          onChange={handleChangeClosed}
          hasLabel={true}
          labelText="Show closed positions"
        />}
      </div>
      <div className="button-wrapper">
        {positions.length > 0 && connected && <Switch
          checked={isClosed}
          onChange={handleChangeClosed}
          hasLabel={true}
          labelText="Show closed positions"
        />}
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
