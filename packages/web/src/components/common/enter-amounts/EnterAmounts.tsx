import { CONTENT_TITLE } from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import React, { useCallback, useState } from "react";
import IconAdd from "../icons/IconAdd";
import IconSettings from "../icons/IconSettings";
import { wrapper } from "./EnterAmounts.styles";

interface EnterAmountsProps {
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
}

const EnterAmounts: React.FC<EnterAmountsProps> = ({ from, to }) => {
  const [fromAmount, setFromAmount] = useState(from.amount);
  const [toAmount, setToAmount] = useState(to.amount);

  const onChangeFromAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFromAmount(value);
    },
    [],
  );

  const onChangeToAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setToAmount(value);
    },
    [],
  );

  return (
    <div css={wrapper}>
      <section className="title-content">
        <h5 className="title">{CONTENT_TITLE.AMOUNTS}</h5>
        <button className="setting-button">
          <IconSettings className="setting-icon" />
        </button>
      </section>
      <section className="enter-amounts-wrap">
        <div className="inputs">
          <div className="from">
            <div className="amount">
              <input
                className="amount-text"
                value={fromAmount}
                onChange={onChangeFromAmount}
                placeholder={fromAmount === "" ? "0" : ""}
              />
              <span className="token-badge">{from.token}</span>
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
              <span className="token-badge">{to.token}</span>
            </div>
            <div className="info">
              <span className="price-text">{to.price}</span>
              <span className="balence-text">Balence : {to.balence}</span>
            </div>
          </div>
          <div className="arrow">
            <div className="shape">
              <IconAdd className="add-icon" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnterAmounts;
