// TODO : remove eslint-disable after work
/* eslint-disable */
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useCallback, useState, useMemo } from "react";
import { HeaderWrapper } from "./MyLiquidityHeader.styles";
import Switch from "@components/common/switch/Switch";
import { SCANNER_URL } from "@common/values";
import IconLinkPage from "@components/common/icons/IconLinkPage";
import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import { CopyTooltip } from "../my-position-card/MyPositionCard.styles";
import IconPolygon from "@components/common/icons/IconPolygon";

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
  isHiddenAddPosition: boolean;
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
  isHiddenAddPosition,
}) => {
  const [copied, setCopied] = useState(false);
  const themeKey = useAtomValue(ThemeState.themeKey);
  const onClickAddressPosition = useCallback(() => {
    const scannerUrl = `${SCANNER_URL}/accounts/${address}`;
    window.open(scannerUrl, "_blank");
  }, [address]);

  const onClickCopy = async () => {
    try {
      const linkUrl = `${location.origin}${location.pathname}?addr=${address}`;
      navigator.clipboard.writeText(linkUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e) {
      throw new Error("Copy Error!");
    }
  };

  const renderPositionHeader = () => {
    const positionTitle = () => {
      if (isOtherPosition) {
        return <>
          <span className="name" onClick={onClickAddressPosition}>{addressName}</span>
          <span>{`’s Positions (${positionLength})`}</span>
        </>
      }

      if (connectedWallet) {
        return <span>{`My Positions (${positionLength})`}</span>
      }

      return <span>{"My Positions"}</span>
    }

    const canCopy = (isOtherPosition || connectedWallet);

    return <div className="header">
      <h2>
        {positionTitle()}
        {canCopy && <button onClick={onClickCopy}><IconLinkPage />
          {copied && (
            <CopyTooltip>
              <div className={`box ${themeKey}-shadow`}>
                <span>URL Copied!</span>
              </div>
              <IconPolygon className="polygon-icon" />
            </CopyTooltip>
          )}
        </button>}
      </h2>
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
  }

  return (
    <HeaderWrapper>
      {renderPositionHeader()}
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
        {availableRemovePosition && !isHiddenAddPosition && (
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
