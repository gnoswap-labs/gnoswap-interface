import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import { PoolPositionModel } from "@models/position/pool-position-model";

import PositionHistoryContainer from "../../../containers/position-history-container/PositionHistoryContainer";

import { PositionHistoryWrapper } from "./PositionHistory.styles";

interface Props {
  isClosed: boolean;
  position: PoolPositionModel;
}

const PositionHistory: FC<Props> = ({ isClosed, position }) => {
  const [openedSelector, setOpenedSelector] = useState(false);
  const { t } = useTranslation();
  return (
    <PositionHistoryWrapper isClosed={isClosed}>
      <div className="title" onClick={() => setOpenedSelector(!openedSelector)}>
        <div>{t("Pool:position.card.history.title")}</div>
        <div className="icon-wrapper">
          {openedSelector ? (
            <IconArrowUp className="icon-arrow" />
          ) : (
            <IconArrowDown className="icon-arrow" />
          )}
        </div>
      </div>
      {openedSelector && (
        <PositionHistoryContainer
          position={position}
        />
      )}
    </PositionHistoryWrapper>
  );
};

export default PositionHistory;
