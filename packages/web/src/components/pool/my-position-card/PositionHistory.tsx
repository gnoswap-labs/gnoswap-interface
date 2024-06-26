import { FC, useState } from "react";
import { PositionHistoryWrapper } from "./PositionHistory.styles";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import PositionHistoryContainer from "@containers/position-history-container/PositionHistoryContainer";
import { TokenModel } from "@models/token/token-model";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface Props {
  isClosed: boolean;
  tokenA: TokenModel;
  tokenB: TokenModel;
  position: PoolPositionModel;
}

const PositionHistory: FC<Props> = ({ isClosed, tokenB, tokenA, position }) => {
  const [openedSelector, setOpenedSelector] = useState(false);
  return (
    <PositionHistoryWrapper isClosed={isClosed}>
      <div className="title" onClick={() => setOpenedSelector(!openedSelector)}>
        <div>Position History</div>
        <div className="icon-wrapper">
          {openedSelector ? (
            <IconArrowUp className="icon-arrow" />
          ) : (
            <IconArrowDown className="icon-arrow" />
          )}
        </div>
      </div>
      {openedSelector && <PositionHistoryContainer position={position} tokenA={tokenA} tokenB={tokenB} />}
    </PositionHistoryWrapper>
  );
};

export default PositionHistory;
