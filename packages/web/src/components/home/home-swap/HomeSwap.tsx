import React, { useCallback, useState } from "react";
import { wrapper } from "./HomeSwap.styles";
import IconSettings from "@components/common/icons/IconSettings";
import Button from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
interface HomeSwapProps {
  from: {
    token: string;
    symbol: string;
    amount: string;
    price: string;
    balence: string;
    tokenLogo: string;
  };
  to: {
    token: string;
    symbol: string;
    amount: string;
    price: string;
    balence: string;
    tokenLogo: string;
  };
  swapNow: () => void;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const HomeSwap: React.FC<HomeSwapProps> = ({ from, to, swapNow }) => {
  const [fromAmount, setFromAmount] = useState(from.amount);
  const [toAmount, setToAmount] = useState(to.amount);

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

  const onClickSwapNow = useCallback(() => {
    swapNow();
  }, [swapNow]);

  return (
    <div css={wrapper}>
      <div className="header">
        <span className="title">Swap</span>
        <button className="setting-button" disabled>
          <IconSettings className="setting-icon" />
        </button>
      </div>
      <div className="inputs">
        <div className="from">
          <div className="amount">
            <input
              className="amount-text"
              value={fromAmount}
              onChange={onChangeFromAmount}
              placeholder={fromAmount === "" ? "0" : ""}
            />
            <div className="token">
              <SelectPairButton disabled token={from} />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{from.price}</span>
            <span className="balence-text">Balence : {from.balence}</span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input
              className="amount-text"
              value={toAmount}
              onChange={onChangeToAmount}
              placeholder={toAmount === "" ? "0" : ""}
            />
            <div className="token">
              <SelectPairButton disabled token={to} />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{to.price}</span>
            <span className="balence-text">Balence : {to.balence}</span>
          </div>
        </div>
        <div className="arrow">
          <div className="shape">
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>

      <div className="footer">
        <Button
          text="Swap now"
          style={{
            bgColor: "brand50",
            fullWidth: true,
            height: 57,
            textColor: "gray10",
            fontType: "body7",
          }}
          onClick={onClickSwapNow}
        />
      </div>
    </div>
  );
};

export default HomeSwap;
