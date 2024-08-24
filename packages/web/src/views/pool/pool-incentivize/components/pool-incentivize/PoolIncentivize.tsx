import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import TokenAmountInput from "@components/common/token-amount-input/TokenAmountInput";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenAmountInputModel } from "@hooks/token/use-token-amount-input";
import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolModel } from "@models/pool/pool-model";
import { TokenBalanceInfo } from "@models/token/token-balance-info";
import { TokenModel } from "@models/token/token-model";
import { DistributionPeriodDate } from "@states/earn";

import Disclaimer from "./disclaimer/Disclaimer";
import PoolIncentivizeDetails from "./pool-incentivize-details/PoolIncentivizeDetails";
import PoolIncentivizeSelectPool from "./pool-incentivize-select-pool/PoolIncentivizeSelectPool";
import SelectDistributionPeriod from "./select-distribution-period/SelectDistributionPeriod";

import { PoolIncentivizeWrapper } from "./PoolIncentivize.styles";

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
  handleConfirmIncentivize: () => void;
  tokenAmountInput: TokenAmountInputModel;
  changeToken: (token: TokenModel) => void;
  textBtn: string;
  disableButton: boolean;
  connected: boolean;
  isDisabledSelect?: boolean;
}

const customSort = (a: PoolSelectItemInfo, b: PoolSelectItemInfo) => {
  const liquidityA = parseFloat(a.liquidityAmount);
  const liquidityB = parseFloat(b.liquidityAmount);
  return liquidityB - liquidityA;
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
  handleConfirmIncentivize,
  tokenAmountInput,
  changeToken,
  textBtn,
  disableButton,
  connected,
  isDisabledSelect,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();

  const selectedItem = useMemo((): PoolSelectItemInfo | null => {
    const temp = selectedPool
      ? PoolMapper.toPoolSelectItemInfo(selectedPool)
      : null;
    return temp;
  }, [selectedPool]);

  const poolSelectItems = useMemo((): PoolSelectItemInfo[] => {
    return pools
      .map(PoolMapper.toPoolSelectItemInfo)
      .map((item: PoolSelectItemInfo) => {
        return {
          ...item,
          tokenA: {
            ...item.tokenA,
            symbol: getGnotPath(item.tokenA).symbol,
            logoURI: getGnotPath(item.tokenA).logoURI,
            path: getGnotPath(item.tokenA).path,
          },
          tokenB: {
            ...item.tokenB,
            symbol: getGnotPath(item.tokenB).symbol,
            logoURI: getGnotPath(item.tokenB).logoURI,
            path: getGnotPath(item.tokenB).path,
          },
        };
      })
      .sort(customSort);
  }, [pools]);

  return (
    <PoolIncentivizeWrapper>
      <h3 className="title">{t("IncentivizePool:incentiPool.form.header")}</h3>
      <article>
        <PoolIncentivizeSelectPool
          pools={poolSelectItems}
          selectedPool={selectedItem}
          select={selectPool}
          isDisabled={isDisabledSelect}
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

      <article className="token-amount-input">
        <h5 className="section-title">
          {t("IncentivizePool:incentiPool.form.rewaAmt.label")}
        </h5>
        <TokenAmountInput
          changeToken={changeToken}
          connected={connected}
          {...tokenAmountInput}
          changable={true}
        />
      </article>
      <PoolIncentivizeDetails
        amount={tokenAmountInput.amount}
        details={selectedItem}
        startDate={startDate}
        period={period}
        token={tokenAmountInput.token}
      />

      <Disclaimer />
      <Button
        text={textBtn}
        style={{
          hierarchy: ButtonHierarchy.Primary,
          fullWidth: true,
        }}
        disabled={disableButton}
        onClick={handleConfirmIncentivize}
        className="button-confirm"
      />
    </PoolIncentivizeWrapper>
  );
};

export default PoolIncentivize;
