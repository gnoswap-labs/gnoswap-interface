import React from "react";
import { useTranslation } from "react-i18next";

import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";

import { wrapper } from "./WalletMyPositionsHeader.styles";
import Switch from "@components/common/switch/Switch";

const WalletMyPositionsHeader: React.FC<{ toggleClosed: () => void; isClosed: boolean }> = ({
  toggleClosed,
  isClosed,
}) => {
  const { t } = useTranslation();
  const { isSwitchNetwork } = useWallet();

  const { positions, isFetchedPosition: isFetchedPosition } = usePositionData({
    isClosed: false,
  });

  const displayPositionsCount = React.useMemo(() => {
    return !isClosed ? positions.filter(position => !position.closed).length : positions.length;
  }, [positions, isClosed]);

  const hasClosedPositions = React.useMemo(() => {
    return positions.some(position => position.closed);
  }, [positions]);

  if (!isFetchedPosition || isSwitchNetwork) return null;

  return (
    <div css={wrapper}>
      {positions.length > 0 && <h2>{`${t("Wallet:myPosi")} (${displayPositionsCount})`}</h2>}
      {hasClosedPositions && (
        <Switch
          checked={isClosed}
          onChange={toggleClosed}
          hasLabel={true}
          labelText={t("Earn:positions.showClosedSwitch")}
        />
      )}
    </div>
  );
};

export default WalletMyPositionsHeader;
