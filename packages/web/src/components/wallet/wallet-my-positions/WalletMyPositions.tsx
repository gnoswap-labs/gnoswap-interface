import { useWallet } from "@hooks/wallet/use-wallet";
import { wrapper } from "./WalletMyPositions.styles";
import { usePositionData } from "@hooks/common/use-position-data";
import { useLoading } from "@hooks/common/use-loading";

interface WalletMyPositionsProps {
  header: React.ReactNode;
  cardList: React.ReactNode;
}

const WalletMyPositions: React.FC<WalletMyPositionsProps> = ({
  header,
  cardList,
}) => {
  const { isFetchedPosition, positions } = usePositionData();
  const { isLoading: isLoadingCommon } = useLoading();
  const { connected } = useWallet();
  if (!connected) return null;
  if (isFetchedPosition && positions.length === 0 && !isLoadingCommon)
    return null;
  return (
    <div css={wrapper}>
      {header}
      {cardList}
    </div>
  );
};

export default WalletMyPositions;
