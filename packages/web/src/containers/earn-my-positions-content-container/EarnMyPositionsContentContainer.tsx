// TODO : remove eslint-disable after work
/* eslint-disable */
import EarnMyPositionsContent, {
  MY_POSITIONS_STATUS,
} from "@components/earn/earn-my-positions-content/EarnMyPositionsContent";
import React, { useState } from "react";

interface EarnMyPositionContentContainerProps {
  unconnected: React.ReactNode;
  noLiquidity: React.ReactNode;
  cardList: React.ReactNode;
}

const EarnMyPositionsContentContainer: React.FC<
  EarnMyPositionContentContainerProps
> = ({ unconnected, noLiquidity, cardList }) => {
  const [status, setStatus] = useState<MY_POSITIONS_STATUS>(
    MY_POSITIONS_STATUS.UN_CONNECTED,
  );
  // TODO : setStatus API

  return (
    <EarnMyPositionsContent
      unconnected={unconnected}
      noLiquidity={noLiquidity}
      cardList={cardList}
      status={status}
    />
  );
};

export default EarnMyPositionsContentContainer;
