import DoubleLogo from "@components/common/double-logo/DoubleLogo";
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
      <ul className="pooled-section">
        <li>
          <DoubleLogo left={dummyImg[0]} right={dummyImg[1]} size={24} />
          <span className="token-id">#14450</span>
          <strong className="period-value">available in 21 days</strong>
        </li>
        <li>
          <DoubleLogo left={dummyImg[0]} right={dummyImg[1]} size={24} />
          <span className="token-id">#14450</span>
          <strong className="period-value">available in 21 days</strong>
        </li>
      </ul>
      <ul className="result-section">
        <li>
          <div className="main-info">
            <img src={dummyImg[0]} alt="pooled token0 logo" />
            <p>Unclaimed GNOS Rewards</p>
            <strong>1,140.058845</strong>
          </div>
          <span className="dallor">$5,564.48</span>
        </li>

        <li>
          <div className="main-info">
            <img src={dummyImg[1]} alt="pooled token1 logo" />
            <p>Unclaimed GNOT Rewards</p>
            <strong>942.55884</strong>
          </div>
          <span className="dallor">$5,564.48</span>
        </li>
      </ul>
    </div>
  );
};

export default SelectUnstakeResult;
