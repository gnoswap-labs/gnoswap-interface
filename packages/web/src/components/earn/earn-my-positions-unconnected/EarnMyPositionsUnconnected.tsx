import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLinkOff from "@components/common/icons/IconLinkOff";
import { useCallback } from "react";
import { UnconnectedWrapper } from "./EarnMyPositionsUnconnected.styles";

export interface EarnMyPositionsUnconnectedProps {
  connect: () => void;
  isSwitchNetwork: boolean;
}

const EarnMyPositionsUnconnected: React.FC<EarnMyPositionsUnconnectedProps> = ({
  connect,
  isSwitchNetwork,
}) => {
  const onClickConnect = useCallback(() => {
    connect();
  }, [connect]);

  return (
    <UnconnectedWrapper>
      <IconLinkOff className="unconnected-icon" />
      {isSwitchNetwork ? (
        <p>Unsupported network. Switch your network to Gnoland.</p>
      ) : (
        <p>
          Please connect your wallet to view
          <br />
          your liquidity positions.
        </p>
      )}

      <Button
        text={isSwitchNetwork ? "Switch to Gnoland" : "Connect Wallet"}
        onClick={onClickConnect}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          width: 263,
          height: 41,
        }}
      />
    </UnconnectedWrapper>
  );
};

export default EarnMyPositionsUnconnected;
