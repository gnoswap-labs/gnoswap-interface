import React, { useMemo } from "react";
import { SetRewardAmountWrapper } from "./SetRewardAmount.styles";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import SelectTokenBalance from "@components/common/select-token-balance/SelectTokenBalance";

interface SetRewardAmountProps {
  token: TokenBalanceInfo | null;
  tokens: TokenBalanceInfo[];
  amount: string;
  selectToken: (path: string) => void;
  onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SetRewardAmount: React.FC<SetRewardAmountProps> = ({
  token,
  tokens,
  amount,
  selectToken,
  onChangeAmount,
}) => {
  const balanceText = useMemo(() => {
    const balance = token ? token.balance : "0";
    return `Balance : ${balance}`;
  }, [token]);

  return (
    <SetRewardAmountWrapper>
      <h5 className="section-title">2. Select Distribution Period</h5>
      <div className="input-wrapper">
        <div className="token-input-wrapper">
          <div className="token-selector">
            <SelectTokenBalance
              current={token}
              tokens={tokens}
              select={selectToken}
            />
          </div>
          <input
            className="amount"
            value={amount}
            onChange={onChangeAmount}
            placeholder={amount === "" ? "0" : ""}
          />
        </div>

        <div className="balance-wrapper">
          <span className="balance">{balanceText}</span>
        </div>
      </div>
    </SetRewardAmountWrapper>
  );
};

export default SetRewardAmount;
