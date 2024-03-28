// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { useState } from "react";
import { wrapper } from "./WalletMyPositionsHeader.styles";
import { usePositionData } from "@hooks/common/use-position-data";
import { useWallet } from "@hooks/wallet/use-wallet";

const WalletMyPositionsHeader: React.FC = () => {
  const {  isFetchedPosition, positions } = usePositionData();
  const { isSwitchNetwork } = useWallet();
  if (!isFetchedPosition || isSwitchNetwork) return null;

  return (
    <div css={wrapper}>
      <h2>{`My Positions (${positions.length})`}</h2>
    </div>
  );
};

export default WalletMyPositionsHeader;
