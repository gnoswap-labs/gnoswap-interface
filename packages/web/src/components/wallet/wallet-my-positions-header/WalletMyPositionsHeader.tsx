// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { useState } from "react";
import { wrapper } from "./WalletMyPositionsHeader.styles";
import { usePositionData } from "@hooks/common/use-position-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetPositionsByAddress } from "@query/positions";

const WalletMyPositionsHeader: React.FC = () => {
  const { isSwitchNetwork } = useWallet();

  const {
    data: positions = [],
    isFetched: isFetchedPosition
  } = useGetPositionsByAddress({
    isClosed: false,
  })
  if (!isFetchedPosition || isSwitchNetwork) return null;

  return (
    <div css={wrapper}>
      <h2>{`My Positions (${positions.length})`}</h2>
    </div>
  );
};

export default WalletMyPositionsHeader;
