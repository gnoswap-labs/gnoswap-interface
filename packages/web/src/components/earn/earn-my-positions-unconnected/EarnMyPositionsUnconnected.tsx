import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconLinkOff from "@components/common/icons/IconLinkOff";
import { wrapper } from "./EarnMyPositionsUnconnected.styles";

const EarnMyPositionsUnconnected = () => {
  return (
    <div css={wrapper}>
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
          height: 57,
        }}
      />
    </div>
  );
};

export default EarnMyPositionsUnconnected;
