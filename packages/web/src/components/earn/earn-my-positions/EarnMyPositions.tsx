import { wrapper } from "./EarnMyPositions.styles";

interface EarnMyPositionsProps {
  header: React.ReactNode;
  cardList: React.ReactNode;
}

const EarnMyPositions: React.FC<EarnMyPositionsProps> = ({
  header,
  cardList,
}) => (
  <div css={wrapper}>
    {header}
    {cardList}
  </div>
);

export default EarnMyPositions;
