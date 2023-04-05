import { wrapper } from "./WalletMyPositions.styles";

interface WalletMyPositionsProps {
  header: React.ReactNode;
  cardList: React.ReactNode;
}

const WalletMyPositions: React.FC<WalletMyPositionsProps> = ({
  header,
  cardList,
}) => (
  <div css={wrapper}>
    {header}
    {cardList}
  </div>
);

export default WalletMyPositions;
