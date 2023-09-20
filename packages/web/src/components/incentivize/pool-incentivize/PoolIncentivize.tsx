import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useMemo } from "react";
import Disclaimer from "@components/incentivize/disclaimer/Disclaimer";
import PoolIncentivizeDetails from "@components/incentivize/pool-incentivize-details/PoolIncentivizeDetails";
import SelectDistributionPeriod from "@components/incentivize/select-distribution-period/SelectDistributionPeriod";
import SetRewardAmount from "@components/incentivize/set-reward-amount/SetRewardAmount";
import { PoolIncentivizeWrapper } from "./PoolIncentivize.styles";
import PoolIncentivizeSelectPool from "../pool-incentivize-select-pool/PoolIncentivizeSelectPool";
import { PoolModel, mapPoolModelToSelectItem } from "@models/pool/pool-model";
import { PoolSelectItemModel } from "@models/pool/pool-select-item-model";
import { TokenBalanceModel } from "@models/token/token-balance-model";

export interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}
interface PoolIncentivizeProps {
  token: TokenBalanceModel | null;
  tokens: TokenBalanceModel[];
  selectToken: (tokenId: string) => void;
  selectedPool: PoolModel | null;
  pools: PoolModel[];
  selectPool: (poolId: string) => void;
  startDate?: DistributionPeriodDate;
  setStartDate: (date: DistributionPeriodDate) => void;
  period: number;
  periods: number[];
  setPeriod: (period: number) => void;
  amount: string;
  onChangeAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  details: any;
  disclaimer: string;
}

const PoolIncentivize: React.FC<PoolIncentivizeProps> = ({
  token,
  tokens,
  selectToken,
  pools,
  selectedPool,
  selectPool,
  startDate,
  setStartDate,
  period,
  periods,
  setPeriod,
  amount,
  onChangeAmount,
  details,
  disclaimer,
}) => {

  const selectedItem = useMemo((): PoolSelectItemModel | null => {
    return selectedPool ? mapPoolModelToSelectItem(selectedPool) : null;
  }, [selectedPool]);

  const poolSelectItems = useMemo((): PoolSelectItemModel[] => {
    return pools.map(mapPoolModelToSelectItem);
  }, [pools]);

  return (
    <PoolIncentivizeWrapper>
      <h3 className="title">Incentivize</h3>
      <article>
        <PoolIncentivizeSelectPool
          pools={poolSelectItems}
          selectedPool={selectedItem}
          select={selectPool}
        />
      </article>

      <article>
        <SelectDistributionPeriod
          startDate={startDate}
          setStartDate={setStartDate}
          period={period}
          periods={periods}
          setPeriod={setPeriod}
        />
      </article>

      <article>
        <SetRewardAmount
          token={token}
          tokens={tokens}
          selectToken={selectToken}
          amount={amount}
          onChangeAmount={onChangeAmount}
        />
      </article>
      <PoolIncentivizeDetails details={details} />
      <Disclaimer disclaimer={disclaimer} />
      <Button
        text="Incentivize"
        style={{
          hierarchy: ButtonHierarchy.Primary,
          height: 57,
          fullWidth: true,
        }}
      />
    </PoolIncentivizeWrapper>
  );
};

export default PoolIncentivize;
