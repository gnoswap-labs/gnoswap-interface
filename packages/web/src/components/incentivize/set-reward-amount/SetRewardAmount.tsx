import React from "react";
import { CONTENT_TITLE } from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { wrapper } from "./SetRewardAmount.styles";

interface SetRewardAmountProps {
  amount: string;
  onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SetRewardAmount: React.FC<SetRewardAmountProps> = ({
  amount,
  onChangeAmount,
}) => {
  return (
    <div css={wrapper}>
      <h5 className="section-title">{CONTENT_TITLE.REWARD_AMOUNT}</h5>
      <div className="amount-input-wrap">
        <span className="token-badge">GNOT</span>
        <input
          className="amount-input"
          value={amount}
          onChange={onChangeAmount}
          placeholder={amount === "" ? "0" : ""}
        />
      </div>
    </div>
  );
};

export default SetRewardAmount;
