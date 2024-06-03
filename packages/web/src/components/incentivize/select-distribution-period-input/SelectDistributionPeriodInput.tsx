import React, { useMemo } from "react";
import { PoolIncentivizeSelectPeriodBoxItem, SelectDistributionPeriodInputWrapper } from "./SelectDistributionPeriodInput.styles";
import SelectBox from "@components/common/select-box/SelectBox";

export interface SelectDistributionPeriodInputProps {
  title: string;
  period: number;
  periods: number[];
  changePeriod: (period: number) => void;
}

const SelectDistributionPeriodInput: React.FC<SelectDistributionPeriodInputProps> = ({
  title,
  period,
  periods,
  changePeriod,
}) => {

  const currentPeriodText = useMemo(() => {
    return `${period} Days`;
  }, [period]);

  return (
    <SelectDistributionPeriodInputWrapper>
      <span className="description">{title}</span>

      <SelectBox
        current={currentPeriodText}
        items={periods}
        select={changePeriod}
        render={(period) => <SelectDistributionPeriodItem period={period} />}
      />
    </SelectDistributionPeriodInputWrapper>
  );
};

export default SelectDistributionPeriodInput;

interface SelectDistributionPeriodItemProps {
  period: number;
}

const SelectDistributionPeriodItem: React.FC<SelectDistributionPeriodItemProps> = ({
  period,
}) => {
  const periodText = useMemo(() => {
    return `${period} days`;
  }, [period]);

  return (
    <PoolIncentivizeSelectPeriodBoxItem>
      {periodText}
    </PoolIncentivizeSelectPeriodBoxItem>
  );
};