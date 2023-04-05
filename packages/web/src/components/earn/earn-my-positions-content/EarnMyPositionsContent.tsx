import { MY_POSITIONS_STATUS } from "@containers/earn-my-positions-content-container/EarnMyPositionsContentContainer";
import { wrapper } from "./EarnMyPositionsContent.styles";

interface EarnMyPositionContentrProps {
  unconnected: React.ReactNode;
  noLiquidity: React.ReactNode;
  cardList: React.ReactNode;
  status: MY_POSITIONS_STATUS;
}

const EarnMyPositionsContent: React.FC<EarnMyPositionContentrProps> = ({
  unconnected,
  noLiquidity,
  cardList,
  status,
}) => {
  return (
    <div css={wrapper}>
      {status === MY_POSITIONS_STATUS.UN_CONNECTED && unconnected}
      {status === MY_POSITIONS_STATUS.NO_LIQUIDITY && noLiquidity}
      {status === MY_POSITIONS_STATUS.CARD_LIST && cardList}
    </div>
  );
};

export default EarnMyPositionsContent;
