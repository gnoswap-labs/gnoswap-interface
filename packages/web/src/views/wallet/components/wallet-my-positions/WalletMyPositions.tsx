import React from "react";

import { usePositionData } from "@hooks/common/use-position-data";
import { useWallet } from "@hooks/wallet/use-wallet";

import { wrapper } from "./WalletMyPositions.styles";

interface WalletMyPositionsProps {
  header: React.ReactNode;
  cardList: React.ReactNode;
}

const WalletMyPositions: React.FC<WalletMyPositionsProps> = ({
  header,
  cardList,
}) => {
  const { isFetchedPosition, positions, loading } = usePositionData();
  const { connected } = useWallet();
  if (!connected) return null;
  if (isFetchedPosition && positions.length === 0 && loading)
    return null;
  return (
    <div css={wrapper}>
      {header}
      {cardList}
    </div>
  );
};

export default WalletMyPositions;
