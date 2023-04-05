import EarnMyPositionsContent from "@components/earn/earn-my-positions-content/EarnMyPositionsContent";
import React, { useState } from "react";
import { ValuesType } from "utility-types";

interface EarnMyPositionContentContainerProps {
  unconnected: React.ReactNode;
  noLiquidity: React.ReactNode;
  cardList: React.ReactNode;
}

export const MY_POSITIONS_STATUS = {
  UN_CONNECTED: "unconnected",
  NO_LIQUIDITY: "noLiquidity",
  CARD_LIST: "cardList",
  NONE: "none",
} as const;
export type MY_POSITIONS_STATUS = ValuesType<typeof MY_POSITIONS_STATUS>;

const EarnMyPositionsContentContainer: React.FC<
  EarnMyPositionContentContainerProps
> = ({ unconnected, noLiquidity, cardList }) => {
  const [status, setStatus] = useState<MY_POSITIONS_STATUS>(
    MY_POSITIONS_STATUS.NONE,
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
