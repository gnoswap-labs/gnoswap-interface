import React from "react";
import { wrapper } from "./SelectUnstakeResult.styles";

interface SelectUnstakeResultProps {
  checkedList: string[];
}

const dummyImg = [
  "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
];

const SelectUnstakeResult: React.FC<SelectUnstakeResultProps> = ({
  checkedList,
}) => {
  if (checkedList.length === 0) return <></>;
  return (
    <div css={wrapper}>
      <ul className="result-section">
        <li>
          <div className="main-info">
            <img src={dummyImg[0]} alt="pooled tokenA logo" />
            <p>Pooled GNS</p>
            <strong>123,456.058845</strong>
          </div>
          <span className="dallor">$90,564.48</span>
        </li>
        <li>
          <div className="main-info">
            <img src={dummyImg[0]} alt="pooled tokenA logo" />
            <p>Pooled GNOT</p>
            <strong>123,456.058845</strong>
          </div>
          <span className="dallor">$90,564.48</span>
        </li>
        <li>
          <div className="main-info">
            <img src={dummyImg[0]} alt="pooled tokenA logo" />
            <p>Unclaimed <br /> GNOS Rewards</p>
            <strong>1,140.058845</strong>
          </div>
          <span className="dallor">$5,564.48</span>
        </li>

        <li>
          <div className="main-info">
            <img src={dummyImg[1]} alt="pooled tokenB logo" />
            <p>Unclaimed <br /> GNOT Rewards</p>
            <strong>942.55884</strong>
          </div>
          <span className="dallor">$5,564.48</span>
        </li>
      </ul>
      <ul className="total-amount-section">
        <li>
          <div className="label">Total Amount</div>
          <div className="value">$321,082.2</div>
        </li>
      </ul>
    </div>
  );
};

export default SelectUnstakeResult;
