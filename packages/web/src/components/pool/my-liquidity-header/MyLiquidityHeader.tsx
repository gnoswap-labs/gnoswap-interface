// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import { HeaderWrapper } from "./MyLiquidityHeader.styles";
import Switch from "@components/common/switch/Switch";

interface MyLiquidityHeaderProps {
  availableRemovePosition: boolean;
  handleClickAddPosition: () => void;
  handleClickRemovePosition: () => void;
  isShowClosePosition: boolean;
  handleSetIsClosePosition: () => void;
}

const MyLiquidityHeader: React.FC<MyLiquidityHeaderProps> = ({
  availableRemovePosition,
  handleClickAddPosition,
  handleClickRemovePosition,
  isShowClosePosition,
  handleSetIsClosePosition,
}) => {
  return (
    <HeaderWrapper>
      <div className="header">
        <h2>My Positions</h2>
        {availableRemovePosition && (
          <div className="hide-close-position">
            <Switch
              checked={isShowClosePosition}
              onChange={handleSetIsClosePosition}
              hasLabel={true}
              labelText="Show closed positions"
            />
          </div>
        )}
      </div>
      <div className="button-wrap">
        {availableRemovePosition && (
          <div className="hide-close-position">
            <Switch
              checked={isShowClosePosition}
              onChange={handleSetIsClosePosition}
              hasLabel={true}
              labelText="Show closed positions"
            />
          </div>
        )}
        {availableRemovePosition && (
          <Button
            text="Remove Position"
            onClick={handleClickRemovePosition}
            style={{
              hierarchy: ButtonHierarchy.Primary,
              height: 36,
              padding: "10px 16px",
              fontType: "p1",
            }}
          />
        )}
        <Button
          text="Add Position"
          onClick={handleClickAddPosition}
          style={{
            hierarchy: ButtonHierarchy.Primary,
            height: 36,
            padding: "10px 16px",
            fontType: "p1",
          }}
          className={!availableRemovePosition ? "full-width" : ""}
        />
      </div>
    </HeaderWrapper>
  );
};

export default MyLiquidityHeader;
