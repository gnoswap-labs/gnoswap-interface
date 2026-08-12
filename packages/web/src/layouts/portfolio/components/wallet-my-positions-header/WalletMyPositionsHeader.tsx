import React from "react";
import { useTranslation } from "react-i18next";

import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";

import { wrapper } from "./WalletMyPositionsHeader.styles";
import Switch from "@components/common/switch/Switch";

interface WalletMyPositionsHeaderProps {
  toggleClosed: () => void;
  /** UI toggle state: whether closed positions should be shown in this view. */
  isClosed: boolean;
}

const WalletMyPositionsHeader: React.FC<WalletMyPositionsHeaderProps> = ({ toggleClosed, isClosed }) => {
  const { t } = useTranslation();
  const { isSwitchNetwork } = useWallet();

  const { isPositionDataAvailable, totalPositionCount } = usePositionData({
    withClosed: isClosed,
    scopeId: "WalletMyPositionsHeader",
  });

  if (!isPositionDataAvailable || isSwitchNetwork) return null;

  return (
    <div css={wrapper}>
      {totalPositionCount > 0 && <h2>{`${t("Wallet:myPosi")} (${totalPositionCount.toLocaleString()})`}</h2>}
      <Switch
        checked={isClosed}
        onChange={toggleClosed}
        hasLabel={true}
        labelText={t("Earn:positions.showClosedSwitch")}
      />
    </div>
  );
};

export default WalletMyPositionsHeader;
