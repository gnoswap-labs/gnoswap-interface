import Button, { ButtonHierarchy } from "@components/common/button/Button";
import React, { useMemo } from "react";
import Disclaimer from "@components/incentivize/disclaimer/Disclaimer";
import PoolIncentivizeDetails from "@components/incentivize/pool-incentivize-details/PoolIncentivizeDetails";
import SelectDistributionPeriod from "@components/incentivize/select-distribution-period/SelectDistributionPeriod";
// import SetRewardAmount from "@components/incentivize/set-reward-amount/SetRewardAmount";
import { PoolIncentivizeWrapper } from "./PoolIncentivize.styles";
import PoolIncentivizeSelectPool from "../pool-incentivize-select-pool/PoolIncentivizeSelectPool";
import { PoolModel } from "@models/pool/pool-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import TokenAmountInput from "@components/common/token-amount-input/TokenAmountInput";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";

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
  details: PoolDetailModel | null;
  disclaimer: string;
  handleConfirmIncentivize: () => void;
  tokenAmountInput: TokenAmountInputModel;
  changeToken: (token: TokenModel) => void;
}

const PoolIncentivize: React.FC<PoolIncentivizeProps> = ({
  pools,
  selectedPool,
  selectPool,
  startDate,
  setStartDate,
  period,
  periods,
  setPeriod,
  details,
  disclaimer,
  handleConfirmIncentivize,
  tokenAmountInput,
  changeToken,
}) => {

  const selectedItem = useMemo((): PoolSelectItemInfo | null => {
    return selectedPool ? PoolMapper.toPoolSelectItemInfo(selectedPool) : null;
  }, [selectedPool]);

  const poolSelectItems = useMemo((): PoolSelectItemInfo[] => {
    return pools.map(PoolMapper.toPoolSelectItemInfo);
  }, [pools]);

  return (
    <PoolIncentivizeWrapper>
      <h3 className="title">Incentivize Pool</h3>
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
        <TokenAmountInput changeToken={changeToken} connected={true} {...tokenAmountInput} changable={true} />
      </article>
      {details &&
        <PoolIncentivizeDetails details={details} startDate={startDate} period={period} />
      }

      <Disclaimer disclaimer={disclaimer} />
      <Button
        text="Incentivize Pool"
        style={{
          hierarchy: ButtonHierarchy.Primary,
          height: 57,
          fullWidth: true,
        }}
        onClick={handleConfirmIncentivize}
      />
    </PoolIncentivizeWrapper>
  );
};

export default PoolIncentivize;
