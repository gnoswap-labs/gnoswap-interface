import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useCallback, useState } from "react";
import { HeaderWrapper } from "./MyLiquidityHeader.styles";
import Switch from "@components/common/switch/Switch";
import IconLinkPage from "@components/common/icons/IconLinkPage";
import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import { CopyTooltip } from "../my-position-card/MyPositionCard.styles";
import IconPolygon from "@components/common/icons/IconPolygon";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

interface MyLiquidityHeaderProps {
  isOtherPosition: boolean;
  connectedWallet: boolean;
  address: string | null;
  addressName: string;
  positionLength: number;
  isShowRemovePositionButton: boolean;
  handleClickAddPosition: () => void;
  handleClickRemovePosition: () => void;
  isShowClosePosition: boolean;
  handleSetIsClosePosition: () => void;
  isHiddenAddPosition: boolean;
  showClosePositionButton: boolean;
  isLoadingPositionsById: boolean;
}

const MyLiquidityHeader: React.FC<MyLiquidityHeaderProps> = ({
  isOtherPosition,
  connectedWallet,
  address,
  addressName,
  positionLength,
  isShowRemovePositionButton,
  handleClickAddPosition,
  handleClickRemovePosition,
  isShowClosePosition,
  handleSetIsClosePosition,
  isHiddenAddPosition,
  showClosePositionButton,
  isLoadingPositionsById,
}) => {
  const [copied, setCopied] = useState(false);
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { getAccountUrl } = useGnoscanUrl();
  const onClickAddressPosition = useCallback(() => {
    if (address) window.open(getAccountUrl(address), "_blank");
  }, [address, getAccountUrl]);

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
          <span>{`’s Positions ${!isLoadingPositionsById ? `(${positionLength})` : ""}`}</span>
        </>;
      }

      if (connectedWallet) {
        return <span>{`My Positions ${!isLoadingPositionsById ? `(${positionLength})` : ""}`}</span>;
      }

      return <span>{"My Positions"}</span>;
    };

    const canCopy = (isOtherPosition || connectedWallet);

    return <div className="header">
      <h2>
        {positionTitle()}
        {!isLoadingPositionsById && canCopy && <button onClick={onClickCopy}><IconLinkPage />
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
      {showClosePositionButton && (
        <div className="hide-close-position">
          <Switch
            checked={isShowClosePosition}
            onChange={handleSetIsClosePosition}
            hasLabel={true}
            labelText="Show closed positions"
          />
        </div>
      )}
    </div>;
  };

  return (
    <HeaderWrapper>
      {renderPositionHeader()}
      <div className="button-wrap">
        {showClosePositionButton && (
          <div className="hide-close-position">
            <Switch
              checked={isShowClosePosition}
              onChange={handleSetIsClosePosition}
              hasLabel={true}
              labelText="Show closed positions"
            />
          </div>
        )}
        {isShowRemovePositionButton && !isHiddenAddPosition && (
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
          className={!showClosePositionButton ? "full-width" : ""}
        />
      </div>
    </HeaderWrapper>
  );
};

export default MyLiquidityHeader;
