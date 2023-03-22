import React, { useCallback } from "react";
import { wrapper } from "./HomeSwap.styles";
import IconSettings from "@components/common/icons/IconSettings";
import Button from "@components/common/button/Button";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";

interface HomeSwapProps {
  from: {
    token: string;
    amount: string;
    price: string;
    balence: string;
  };
  to: {
    token: string;
    amount: string;
    price: string;
    balence: string;
  };
  swapNow: () => void;
}

const HomeSwap: React.FC<HomeSwapProps> = ({ from, to, swapNow }) => {
  const onClickSwapNow = useCallback(() => {
    swapNow();
  }, [swapNow]);

  return (
    <div css={wrapper}>
      <div className="header">
        <span className="title">Swap</span>
        <button>
          <IconSettings className="icon" />
        </button>
      </div>
      <div className="inputs">
        <div className="from">
          <div className="amount">
            <span className="amount-text">{from.amount}</span>
            <span className="token">{from.token}</span>
          </div>
          <div className="info">
            <span className="price-text">{from.price}</span>
            <span className="balence-text">Balence : {from.balence}</span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <span className="amount-text">{to.amount}</span>
            <span className="token">{to.token}</span>
          </div>
          <div className="info">
            <span className="price-text">{to.price}</span>
            <span className="balence-text">Balence : {to.balence}</span>
          </div>
        </div>
        <div className="arrow">
          <div className="shape">
            <IconSwapArrowDown className="icon" />
          </div>
        </div>
      </div>

      <div className="footer">
        <Button
          text="Skip now"
          style={{
            bgColor: "brand50",
            fullWidth: true,
            height: 57,
            textColor: "colorWhite",
            fontType: "body4",
          }}
          onClick={onClickSwapNow}
        />
      </div>
    </div>
  );
};

export default HomeSwap;
