import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import React from "react";
import { CONTENT_TITLE } from "@components/stake/stake-liquidity/StakeLiquidity";
import { HoverTextWrapper, wrapper } from "./SelectStakeResult.styles";

interface SelectStakeResultProps {
  checkedList: string[];
  isHiddenBadge?: boolean;
}

const dummyImg = [
  "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
];

const HOVER_TEXT =
  "Your estimated APR is calculated based on daily emissions and the value of total LP tokens staked in this pool.";

const SelectStakeResult: React.FC<SelectStakeResultProps> = ({
  checkedList,
  isHiddenBadge = false,
}) => {
  if (checkedList.length === 0) return <></>;
  return (
    <div css={wrapper}>
      <ul className="pooled-section">
        <li>
          <div className="main-info">
            <img src={dummyImg[0]} alt="pooled tokenA logo" />
            <p>Pooled GNOS</p>
            <strong>1,140.058845</strong>
          </div>
          <span className="dallor">$5,564.48</span>
        </li>
        <li>
          <div className="main-info">
            <img src={dummyImg[1]} alt="pooled tokenB logo" />
            <p>Pooled GNOT</p>
            <strong>942.55884</strong>
          </div>
          <span className="dallor">$10,008.58</span>
        </li>
      </ul>
      <div className="result-section">
        <div className="total-amount-box">
          <h5 className="total-amount-title">{CONTENT_TITLE.TOTAL_STAKING}</h5>
          {!isHiddenBadge && <Badge text={"21 days"} type={BADGE_TYPE.DARK_DEFAULT} />}
          <span className="result-value">$1,572,146.14</span>
        </div>
        <div className="apr-box">
          <h5 className="apr-title">{CONTENT_TITLE.APR}</h5>
          <div className="hover-info">
            <Tooltip placement="top" FloatingContent={<HoverTextWrapper>{HOVER_TEXT}</HoverTextWrapper>}>
              <IconInfo className="icon-info" />
            </Tooltip>
          </div>
          <span className="result-value">$1,572,146.14</span>
        </div>
      </div>
    </div>
  );
};

export default SelectStakeResult;
