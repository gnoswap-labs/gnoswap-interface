import React, { useMemo } from "react";
import {
  DistributionPeriodTooltipContentWrapper,
  PoolIncentivizeSelectPeriodBoxItem,
  SelectDistributionPeriodInputWrapper,
} from "./SelectDistributionPeriodInput.styles";
import SelectBox from "@components/common/select-box/SelectBox";
import IconInfo from "@components/common/icons/IconInfo";
import { useTheme } from "@emotion/react";
import Tooltip from "@components/common/tooltip/Tooltip";

export interface SelectDistributionPeriodInputProps {
  title: string;
  period: number;
  periods: number[];
  changePeriod: (period: number) => void;
}

const SelectDistributionPeriodInput: React.FC<
  SelectDistributionPeriodInputProps
> = ({ title, period, periods, changePeriod }) => {
  const theme = useTheme();

  const currentPeriodText = useMemo(() => {
    return `${period} Days`;
  }, [period]);

  return (
    <SelectDistributionPeriodInputWrapper>
      <span className="description">
        {title}
        <Tooltip
          placement="top"
          FloatingContent={
            <DistributionPeriodTooltipContentWrapper>
              Incentives are distributed based on the
              <br /> number of blocks. The distribution period
              <br /> is approximate and may slightly differ from
              <br /> the actual time based on the network
              <br /> conditions of the blockchain.
            </DistributionPeriodTooltipContentWrapper>
          }
        >
          <IconInfo fill={theme.color.icon03} size={16} className="icon-info" />
        </Tooltip>
      </span>

      <SelectBox
        current={currentPeriodText}
        items={periods}
        select={changePeriod}
        render={period => <SelectDistributionPeriodItem period={period} />}
      />
    </SelectDistributionPeriodInputWrapper>
  );
};

export default SelectDistributionPeriodInput;

interface SelectDistributionPeriodItemProps {
  period: number;
}

const SelectDistributionPeriodItem: React.FC<
  SelectDistributionPeriodItemProps
> = ({ period }) => {
  const periodText = useMemo(() => {
    return `${period} days`;
  }, [period]);

  return (
    <PoolIncentivizeSelectPeriodBoxItem>
      {periodText}
    </PoolIncentivizeSelectPeriodBoxItem>
  );
};
