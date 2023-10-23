import React, { useCallback, useState, useEffect } from "react";
import { CopyTooltip, wrapper } from "./TokenSwap.styles";
import IconSettings from "@components/common/icons/IconSettings";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import IconLink from "@components/common/icons/IconLink";
import IconPolygon from "@components/common/icons/IconPolygon";
import { TokenModel } from "@models/token/token-model";
export interface TokenSwapProps {
  from: {
    token: TokenModel;
    amount: string;
    price: string;
    balance: string;
  };
  to: {
    token: TokenModel;
    amount: string;
    price: string;
    balance: string;
  };
  connected: boolean;
  connectWallet: () => void;
  swapNow: () => void;
  handleSwap: () => void;
  copied: boolean;
  handleCopied: () => void;
  themeKey: "dark" | "light";
  handleSetting: () => void;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const TokenSwap: React.FC<TokenSwapProps> = ({
  from,
  to,
  connected,
  connectWallet,
  swapNow,
  handleSwap,
  copied,
  handleCopied,
  themeKey,
  handleSetting,
}) => {
  const [fromAmount, setFromAmount] = useState(from.amount.toString());
  const [toAmount, setToAmount] = useState(to.amount.toString());

  const onChangeFromAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;

      setFromAmount(value);
      // TODO
      // - mapT0AmountToT0Price
      // - mapT0AmpuntT1Amount
      // - mapT1AmpuntT1Price
    },
    [],
  );

  const onChangeToAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;

      setToAmount(value);
      // TODO
      // - mapT1AmountToT1Price
      // - mapT1AmpuntT0Amount
      // - mapT0AmpuntT0Price
    },
    [],
  );

  useEffect(() => {
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  }, [from, to]);

  const onClickConfirm = useCallback(() => {
    if (!connected) {
      connectWallet();
      return;
    }
    swapNow();
  }, [connected, connectWallet, swapNow]);

  return (
    <div css={wrapper}>
      <div className="header">
        <span className="title">Swap</span>
        <div className="header-button">
          <button className="setting-button link-button" onClick={handleCopied}>
            <IconLink className="setting-icon" />
            {copied && (
              <CopyTooltip>
                <div className={`box ${themeKey}-shadow`}>
                  <span>URL Copied!</span>
                </div>
                <IconPolygon className="polygon-icon" />
              </CopyTooltip>
            )}
          </button>
          <button className="setting-button" onClick={handleSetting}>
            <IconSettings className="setting-icon" />
          </button>
        </div>
      </div>
      <div className="inputs">
        <div className="from">
          <div className="amount">
            <input
              className="amount-text"
              value={fromAmount}
              onChange={onChangeFromAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton token={from.token} />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{from.price}</span>
            <span className="balance-text">Balance: {from.balance}</span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input
              className="amount-text"
              value={toAmount}
              onChange={onChangeToAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton token={to.token} />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{to.price}</span>
            <span className="balance-text">Balance: {to.balance}</span>
          </div>
        </div>
        <div className="arrow" onClick={handleSwap}>
          <div className="shape">
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>

      <div className="footer">
        <Button
          text={connected ? "Swap" : "Connect Wallet"}
          style={{
            fullWidth: true,
            height: 57,
            fontType: "body7",
            hierarchy: ButtonHierarchy.Primary,
          }}
          onClick={onClickConfirm}
        />
      </div>
    </div>
  );
};

export default TokenSwap;
