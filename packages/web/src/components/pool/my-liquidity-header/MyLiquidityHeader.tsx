// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import { HeaderWrapper } from "./MyLiquidityHeader.styles";

interface MyLiquidityHeaderProps {
  availableRemovePosition: boolean;
  handleClickAddPosition: () => void;
  handleClickRemovePosition: () => void;
}

const MyLiquidityHeader: React.FC<MyLiquidityHeaderProps> = ({ availableRemovePosition, handleClickAddPosition, handleClickRemovePosition }) => {
  return (
    <HeaderWrapper>
      <h2>My Positions</h2>
      <div className="button-wrap">
        <Button
          disabled={!availableRemovePosition}
          text="Remove Position"
          onClick={handleClickRemovePosition}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            height: 36,
            padding: "10px 16px",
            fontType: "p1",
          }}
        />
        <Button
          text="Add Position"
          onClick={handleClickAddPosition}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            height: 36,
            padding: "10px 16px",
            fontType: "p1",
          }}
        />
      </div>
    </HeaderWrapper>
  );
};

export default MyLiquidityHeader;
