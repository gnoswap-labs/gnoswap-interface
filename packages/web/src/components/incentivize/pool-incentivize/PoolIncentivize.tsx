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
const TEMP_TOKEN = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "Gnoswap",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gnos",
  decimals: 4,
  symbol: "GNOS",
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
  priceId: "gno.land/r/gnos",
};
const TEMP = {
  token: TEMP_TOKEN,
  amount: "12,211",
  balance: "12,211",
  usdValue: "12.3",
  changable: true,
  changeAmount: () => {},
};
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
        <TokenAmountInput changeToken={() => {}} connected={true} {...TEMP} />
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
      />
    </PoolIncentivizeWrapper>
  );
};

export default PoolIncentivize;
