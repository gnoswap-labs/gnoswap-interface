// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { useState } from "react";
import { wrapper } from "./WalletMyPositionsHeader.styles";

const WalletMyPositionsHeader: React.FC = () => {
  const [disabled, setDisabled] = useState(false);
  const [positionNum, setPositionNum] = useState(0);
  const onClickNewPosition = () => {
    // TODO
  };

  if(positionNum === 0) {
    return null;
  }

  return (
    <div css={wrapper}>
      <h2>{`My Positions (${positionNum})`}</h2>
    </div>
  );
};

export default WalletMyPositionsHeader;
