import { ValuesType } from "utility-types";
import { ContentWrapper } from "./EarnMyPositionsContent.styles";

interface EarnMyPositionContentProps {
  unconnected: React.ReactNode;
  noLiquidity: React.ReactNode;
  cardList: React.ReactNode;
  status: MY_POSITIONS_STATUS;
}

export const MY_POSITIONS_STATUS = {
  UN_CONNECTED: "unconnected",
  NO_LIQUIDITY: "noLiquidity",
  CARD_LIST: "cardList",
  NONE: "none",
} as const;
export type MY_POSITIONS_STATUS = ValuesType<typeof MY_POSITIONS_STATUS>;

const EarnMyPositionsContent: React.FC<EarnMyPositionContentProps> = ({
  unconnected,
  noLiquidity,
  cardList,
  status,
}) => {
  return (
    <ContentWrapper>
      {status === MY_POSITIONS_STATUS.UN_CONNECTED && unconnected}
      {status === MY_POSITIONS_STATUS.NO_LIQUIDITY && noLiquidity}
      {status === MY_POSITIONS_STATUS.CARD_LIST && cardList}
    </ContentWrapper>
  );
};

export default EarnMyPositionsContent;
