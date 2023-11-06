import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLinkOff from "@components/common/icons/IconLinkOff";
import { useCallback } from "react";
import { UnconnectedWrapper } from "./EarnMyPositionsUnconnected.styles";

export interface EarnMyPositionsUnconnectedProps {
  connect: () => void;
  connected: boolean;
}

const EarnMyPositionsUnconnected: React.FC<EarnMyPositionsUnconnectedProps> = ({
  connect,
  connected,
}) => {
  const onClickConnect = useCallback(() => {
    connect();
  }, [connect]);

  return (
    <UnconnectedWrapper>
      <IconLinkOff className="unconnected-icon" />
      {!connected ? (
        <p>
          Please connect your wallet to view&nbsp;
          <br />
          your liquidity positions.
        </p>
      ) : (
        <p>Unsupported network. Switch your network to Gnoland.</p>
      )}
      <Button
        text={connected ? "Switch to Gnoland" : "Connect Wallet"}
        onClick={onClickConnect}
        style={{ hierarchy: ButtonHierarchy.Primary }}
        className="button-connect-wallet"
      />
    </UnconnectedWrapper>
  );
};

export default EarnMyPositionsUnconnected;
