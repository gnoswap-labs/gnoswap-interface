import React from "react";
import { wrapper } from "./RemoveLiquiditySelectResult.styles";

interface RemoveLiquiditySelectResultProps {
  checkedList: string[];
}
const dummyImg = [
  "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
];

const RemoveLiquiditySelectResult: React.FC<
  RemoveLiquiditySelectResultProps
> = ({ checkedList }) => {
  if (checkedList.length === 0) return <></>;
  return (
    <div css={wrapper}>
      <ul>
        <li className="pooled-token0">
          <div className="main-info">
            <img src={dummyImg[0]} alt="pooled token0 logo" />
            <p>Pooled GNOS</p>
            <strong>1,140.058845</strong>
          </div>
          <span className="dallor">$5,564.48</span>
        </li>
        <li>
          <div className="main-info">
            <img src={dummyImg[1]} alt="pooled token1 logo" />
            <p>Pooled GNOT</p>
            <strong>942.55884</strong>
          </div>
          <span className="dallor">$10,008.58</span>
        </li>

        <li>
          <div className="main-info">
            <img src={dummyImg[0]} alt="pooled token0 logo" />
            <p>Unclaimed GNOS Fees</p>
            <strong>1,140.058845</strong>
          </div>
          <span className="dallor">$5,564.48</span>
        </li>
        <li>
          <div className="main-info">
            <img src={dummyImg[1]} alt="pooled token1 logo" />
            <p>Unclaimed GNOT Fees</p>
            <strong>942.55884</strong>
          </div>
          <span className="dallor">$10,008.58</span>
        </li>
      </ul>
      <div className="total-section">
        <h5>Total</h5>
        <span className="total-value">$1,572,146.14</span>
      </div>
    </div>
  );
};

export default RemoveLiquiditySelectResult;
