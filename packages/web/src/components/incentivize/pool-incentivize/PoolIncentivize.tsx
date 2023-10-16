import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useMemo } from "react";
import Disclaimer from "@components/incentivize/disclaimer/Disclaimer";
import PoolIncentivizeDetails from "@components/incentivize/pool-incentivize-details/PoolIncentivizeDetails";
import SelectDistributionPeriod from "@components/incentivize/select-distribution-period/SelectDistributionPeriod";
import SetRewardAmount from "@components/incentivize/set-reward-amount/SetRewardAmount";
import { PoolIncentivizeWrapper } from "./PoolIncentivize.styles";
import PoolIncentivizeSelectPool from "../pool-incentivize-select-pool/PoolIncentivizeSelectPool";
import { PoolModel } from "@models/pool/pool-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";

export interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

interface PoolIncentivizeProps {
  token: TokenBalanceInfo | null;
  tokens: TokenBalanceInfo[];
  selectToken: (path: string) => void;
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
  details: PoolDetailModel | null;
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

  const selectedItem = useMemo((): PoolSelectItemInfo | null => {
    return selectedPool ? PoolMapper.toPoolSelectItemInfo(selectedPool) : null;
  }, [selectedPool]);

  const poolSelectItems = useMemo((): PoolSelectItemInfo[] => {
    return pools.map(PoolMapper.toPoolSelectItemInfo);
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
      {details &&
        <PoolIncentivizeDetails details={details} />
      }

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
