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
import { useTranslation } from "react-i18next";

export interface SelectDistributionPeriodInputProps {
  title: string;
  period: number;
  periods: number[];
  changePeriod: (period: number) => void;
}

const SelectDistributionPeriodInput: React.FC<
  SelectDistributionPeriodInputProps
> = ({ title, period, periods, changePeriod }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const currentPeriodText = useMemo(() => {
    return t("common:day.count", {
      count: period,
    });
  }, [period, t]);

  return (
    <SelectDistributionPeriodInputWrapper>
      <span className="description">
        {title}
        <Tooltip
          placement="top"
          FloatingContent={
            <DistributionPeriodTooltipContentWrapper>
              {t(
                "IncentivizePool:incentiPool.form.period.field.disPeriod.tootlip",
              )}
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
  const { t } = useTranslation();

  const periodText = useMemo(() => {
    return t("common:day.count", {
      count: period,
    });
  }, [period, t]);

  return (
    <PoolIncentivizeSelectPeriodBoxItem>
      {periodText}
    </PoolIncentivizeSelectPeriodBoxItem>
  );
};
