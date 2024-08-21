import React from "react";
import { useTranslation } from "react-i18next";

import { usePositionData } from "@hooks/common/use-position-data";
import { useWallet } from "@hooks/wallet/use-wallet";

import { wrapper } from "./WalletMyPositionsHeader.styles";

const WalletMyPositionsHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isSwitchNetwork } = useWallet();

  const { positions, isFetchedPosition: isFetchedPosition } = usePositionData({
    isClosed: false,
  });
  if (!isFetchedPosition || isSwitchNetwork) return null;

  return (
    <div css={wrapper}>
      {positions.length > 0 && (
        <h2>{`${t("Wallet:myPosi")} (${positions.length})`}</h2>
      )}
    </div>
  );
};

export default WalletMyPositionsHeader;
