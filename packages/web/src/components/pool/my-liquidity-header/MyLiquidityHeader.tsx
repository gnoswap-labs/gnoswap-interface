// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useCallback, useEffect, useMemo } from "react";
import { HeaderWrapper } from "./MyLiquidityHeader.styles";
import Switch from "@components/common/switch/Switch";
import { SCANNER_URL } from "@common/values";
import IconLinkPage from "@components/common/icons/IconLinkPage";

interface MyLiquidityHeaderProps {
  isOtherPosition: boolean;
  connectedWallet: boolean;
  address: string | null;
  addressName: string;
  positionLength: number;
  availableRemovePosition: boolean;
  handleClickAddPosition: () => void;
  handleClickRemovePosition: () => void;
  isShowClosePosition: boolean;
  handleSetIsClosePosition: () => void;
}

const MyLiquidityHeader: React.FC<MyLiquidityHeaderProps> = ({
  isOtherPosition,
  connectedWallet,
  address,
  addressName,
  positionLength,
  availableRemovePosition,
  handleClickAddPosition,
  handleClickRemovePosition,
  isShowClosePosition,
  handleSetIsClosePosition,
}) => {
  const onClickAddressPosition = useCallback(() => {
    const scannerUrl = `${SCANNER_URL}/accounts/${address}`;
    window.open(scannerUrl, "_blank");
  }, [address]);

  const onClickCopy = useCallback(() => {
    const linkUrl = `${location.origin}${location.pathname}?addr=${address}`;
    navigator.clipboard.writeText(linkUrl);
  }, [address]);

  return (
    <HeaderWrapper>
      <div className="header">
        {isOtherPosition ? (
          <h2>
            <span className="name" onClick={onClickAddressPosition}>{addressName}</span>
            <span>{`’s Positions (${positionLength})`}</span>
            <button onClick={onClickCopy}><IconLinkPage /></button>
          </h2>
        ) : connectedWallet ? (
          <h2>
            <span>{`My Positions (${positionLength})`}</span>
            <button onClick={onClickCopy}><IconLinkPage /></button>
          </h2>
        ) : (
          <h2>
            <span>{"My Positions"}</span>
          </h2>
        )}
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
