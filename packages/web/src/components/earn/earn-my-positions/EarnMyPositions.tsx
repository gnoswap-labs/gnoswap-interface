import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";
import EarnMyPositionsContent from "../earn-my-positions-content/EarnMyPositionsContent";
import EarnMyPositionsHeader from "../earn-my-positions-header/EarnMyPositionsHeader";
import { EarnMyPositionswrapper } from "./EarnMyPositions.styles";

export interface EarnMyPositionsProps {
  connected: boolean;
  fetched: boolean;
  positions: PoolPosition[];
  connect: () => void;
  moveEarnAdd: () => void;
  movePoolDetail: (poolId: string) => void;
}

const EarnMyPositions: React.FC<EarnMyPositionsProps> = ({
  connected,
  connect,
  fetched,
  positions,
  moveEarnAdd,
  movePoolDetail,
}) => (
  <EarnMyPositionswrapper>
    <EarnMyPositionsHeader
      connected={connected}
      moveEarnAdd={moveEarnAdd}
    />
    <EarnMyPositionsContent
      connected={connected}
      connect={connect}
      fetched={fetched}
      positions={positions}
      movePoolDetail={movePoolDetail}
    />
  </EarnMyPositionswrapper>
);

export default EarnMyPositions;
