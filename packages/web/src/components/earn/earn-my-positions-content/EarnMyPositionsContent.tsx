import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";
import EarnMyPositionNoLiquidity from "../earn-my-positions-no-liquidity/EarnMyPositionNoLiquidity";
import EarnMyPositionsUnconnected from "../earn-my-positions-unconnected/EarnMyPositionsUnconnected";
import { useMemo } from "react";
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
  const randomForTest = useMemo(() => {
    return Math.floor(Math.random() * 2 + 1);
  }, [positions]);

  if (!connected || isSwitchNetwork) {
    return (
      <EarnMyPositionsUnconnected
        connect={connect}
        connected={connected}
      />
    );
  }

  if (randomForTest === 0) {
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
