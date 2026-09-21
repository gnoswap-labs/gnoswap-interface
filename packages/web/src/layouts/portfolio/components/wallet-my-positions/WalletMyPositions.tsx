import React from "react";

import { useWallet } from "@hooks/wallet/data/use-wallet";

import { wrapper } from "./WalletMyPositions.styles";

interface WalletMyPositionsProps {
  header: React.ReactNode;
  cardList: React.ReactNode;
}

const WalletMyPositions: React.FC<WalletMyPositionsProps> = ({ header, cardList }) => {
  const { connected } = useWallet();
  if (!connected) return null;
  return (
    <div css={wrapper}>
      {header}
      {cardList}
    </div>
  );
};

export default WalletMyPositions;
