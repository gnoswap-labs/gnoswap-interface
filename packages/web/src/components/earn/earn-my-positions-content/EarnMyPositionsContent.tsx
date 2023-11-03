import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";
import EarnMyPositionNoLiquidity from "../earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import EarnMyPositionsUnconnected from "../earn-my-positions-unconnected/EarnMyPositionsUnconnected";

export interface EarnMyPositionContentProps {
  connected: boolean;
  fetched: boolean;
  positions: PoolPosition[];
  connect: () => void;
  movePoolDetail: (poolId: string) => void;
  isSwitchNetwork: boolean;
}

const EarnMyPositionsContent: React.FC<EarnMyPositionContentProps> = ({
  connected,
  fetched,
  positions,
  connect,
  movePoolDetail,
  isSwitchNetwork,
}) => {
  if (!connected || isSwitchNetwork) {
    return (
      <EarnMyPositionsUnconnected
        connect={connect}
        isSwitchNetwork={isSwitchNetwork}
      />
    );
  }

  if (positions.length === 0) {
    return <EarnMyPositionNoLiquidity />;
  }

  return (
    <MyPositionCardList
      positions={positions}
      isFetched={fetched}
      currentIndex={1}
      movePoolDetail={movePoolDetail}
      mobile={false}
    />
  );
};

export default EarnMyPositionsContent;
