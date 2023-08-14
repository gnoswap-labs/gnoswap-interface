import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLinkOff from "@components/common/icons/IconLinkOff";
import { UnconnectedWrapper } from "./EarnMyPositionsUnconnected.styles";

const EarnMyPositionsUnconnected = () => {
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
        onClick={() => {}}
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
