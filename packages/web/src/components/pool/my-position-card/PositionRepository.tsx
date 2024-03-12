import { FC, useState } from "react";
import { PositionHistoryWrapper } from "./PositionRepository.styles";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import PositionHistoryContainer from "@containers/position-history-container/PositionHistoryContainer";

interface Props {
  isClosed: boolean;
}

const PositionHistory: FC<Props> = ({ isClosed }) => {
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
      {openedSelector && <PositionHistoryContainer />}
    </PositionHistoryWrapper>
  );
};

export default PositionHistory;
