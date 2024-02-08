import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { useCallback, useMemo } from "react";
import { PositionsWrapper } from "./EarnMyPositionsHeader.styles";
import Switch from "@components/common/switch/Switch";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { SCANNER_URL } from "@common/values";

export interface EarnMyPositionsHeaderProps {
  address?: string | null;
  addressName?: string;
  isOtherPosition: boolean;
  visiblePositions: boolean;
  positionLength: number;
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
  address,
  addressName,
  isOtherPosition,
  visiblePositions,
  positionLength,
  connected,
  isSwitchNetwork,
  availableStake,
  moveEarnAdd,
  moveEarnStake,
  isClosed,
  handleChangeClosed,
}) => {

  const disabledStake = useMemo(() => {
    return !connected || isSwitchNetwork || !availableStake;
  }, [availableStake, connected, isSwitchNetwork]);

  const onClickAddressPosition = useCallback(() => {
    const scannerUrl = `${SCANNER_URL}/accounts/${address}`;
    window.open(scannerUrl, "_blank");
  }, [address]);

  const onClickNewPosition = useCallback(() => {
    moveEarnAdd();
  }, [moveEarnAdd]);

  return (
    <PositionsWrapper>
      <div className="header-content">
        {isOtherPosition ? (
          <h2>
            <span className="name" onClick={onClickAddressPosition}>{addressName}</span>
            <span>{`’s Positions (${positionLength})`}</span>
          </h2>
        ) : connected ? (
          <h2>
            <span>{`My Positions (${positionLength})`}</span>
          </h2>
        ) : (
          <h2>
            <span>{"My Positions"}</span>
          </h2>
        )}
        {visiblePositions && <Switch
          checked={isClosed}
          onChange={handleChangeClosed}
          hasLabel={true}
          labelText="Show closed positions"
        />}
      </div>
      <div className="button-wrapper">
        {visiblePositions && <Switch
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
