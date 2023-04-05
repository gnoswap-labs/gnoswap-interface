import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { useState } from "react";
import { wrapper } from "./EarnMyPositionsHeader.styles";

const EarnMyPositionsHeader: React.FC = () => {
  const [disabled, setDisabled] = useState(false);
  const onClickNewPosition = () => {
    // TODO
  };

  return (
    <div css={wrapper}>
      <h2>My Positions</h2>
      <Button
        text="New Position"
        style={{
          hierarchy: ButtonHierarchy.Primary,
          height: 36,
          padding: "0px 16px",
        }}
        onClick={onClickNewPosition}
        disabled={disabled}
      />
    </div>
  );
};

export default EarnMyPositionsHeader;
