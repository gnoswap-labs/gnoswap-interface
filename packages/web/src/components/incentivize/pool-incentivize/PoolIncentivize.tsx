import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React from "react";
import { ValuesType } from "utility-types";
import Disclaimer from "@components/incentivize/disclaimer/Disclaimer";
import PoolIncentivizeDetails from "@components/incentivize/pool-incentivize-details/PoolIncentivizeDetails";
import SelectDistributionPeriod from "@components/incentivize/select-distribution-period/SelectDistributionPeriod";
import SetRewardAmount from "@components/incentivize/set-reward-amount/SetRewardAmount";
import { wrapper } from "./PoolIncentivize.styles";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}
interface PoolIncentivizeProps {
  startDate?: DistributionPeriodDate,
  setStartDate: (date: DistributionPeriodDate) => void;
  endDate?: DistributionPeriodDate
  setEndDate: (date: DistributionPeriodDate) => void;
  onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  amount: string;
  details: any;
  disclaimer: string;
}

export const CONTENT_TITLE = {
  SELECT_PERIOD: "1. Select Distribution Period",
  REWARD_AMOUNT: "2. Set Reward Amount",
  POOL: "Pool",
  TOTAL_AMOUNT: "Total Amount",
  PERIOD: "Period",
  DISCLAIMER: "Disclaimer",
};
export type CONTENT_TITLE = ValuesType<typeof CONTENT_TITLE>;

const PoolIncentivize: React.FC<PoolIncentivizeProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  amount,
  onChangeAmount,
  details,
  disclaimer,
}) => {
  return (
    <div css={wrapper}>
      <h3 className="title">Incentivize</h3>
      <SelectDistributionPeriod
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      <SetRewardAmount amount={amount} onChangeAmount={onChangeAmount} />
      <PoolIncentivizeDetails details={details} />
      <Disclaimer disclaimer={disclaimer} />
      <Button
        text="Incentivize"
        disabled={true}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          height: 57,
          fullWidth: true,
        }}
      />
    </div>
  );
};

export default PoolIncentivize;
