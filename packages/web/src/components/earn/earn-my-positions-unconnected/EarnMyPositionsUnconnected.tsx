import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLinkOff from "@components/common/icons/IconLinkOff";
import { useCallback } from "react";
import { UnconnectedWrapper } from "./EarnMyPositionsUnconnected.styles";

export interface EarnMyPositionsUnconnectedProps {
  connect: () => void;
}

const EarnMyPositionsUnconnected: React.FC<EarnMyPositionsUnconnectedProps> = ({ connect }) => {

  const onClickConnect = useCallback(() => {
    connect();
  }, [connect]);

  return (
    <UnconnectedWrapper>
      <IconLinkOff className="unconnected-icon" />
      <p>
        Please connect your wallet to view
        <br />
        your liquidity positions.
      </p>
      <Button
        text="Connect Wallet"
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
