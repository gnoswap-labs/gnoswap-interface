import { wrapper } from "./WalletMyPositionsHeader.styles";
import { usePositionData } from "@hooks/common/use-position-data";
import { useWallet } from "@hooks/wallet/use-wallet";

const WalletMyPositionsHeader: React.FC = () => {
  const { isSwitchNetwork } = useWallet();

  const {
    positions,
    isFetchedPosition: isFetchedPosition
  } = usePositionData({
    isClosed: false,
  });
  if (!isFetchedPosition || isSwitchNetwork) return null;

  return (
    <div css={wrapper}>
      {positions.length > 0 && <h2>{`My Positions (${positions.length})`}</h2>}
    </div>
  );
};

export default WalletMyPositionsHeader;
