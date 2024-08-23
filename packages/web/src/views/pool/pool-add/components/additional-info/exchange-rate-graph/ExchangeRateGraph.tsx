import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import Tooltip from "@components/common/tooltip/Tooltip";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolModel } from "@models/pool/pool-model";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";

import ChartScopeSelectTab from "./chart-scope-select-tab/ChartScopeSelectTab";
import ExchangeRateGraphContent from "./exchange-rate-graph-content/ExchangeRateGraphContent";
import PairRatio from "./pair-ratio/PairRatio";

import {
  ExchangeChartNotFound,
  ExchangeRateGraphController,
  ExchangeRateGraphHeaderWrapper,
  ExchangeRateGraphTitleWrapper,
  ExchangeRateGraphWrapper,
  LoadingExchangeRateChartWrapper,
  TooltipContentWrapper,
} from "./ExchangeRateGraph.styles";

interface ExchangeRateGraphProps {
  poolData: PoolModel;
  isReversed: boolean;
  data?: TokenExchangeRateGraphResponse;
  isLoading: boolean;
  defaultScope?: CHART_DAY_SCOPE_TYPE;
}

const ExchangeRateGraph: React.FC<ExchangeRateGraphProps> = ({
  poolData,
  isReversed,
  isLoading,
  defaultScope,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();

  const [currentPoint, setCurrentPoint] = useState<string | null>();
  const [active, setActive] = useState<boolean>(false);
  const [selectedScope, setSelectedScope] = useState<CHART_DAY_SCOPE_TYPE>(
    defaultScope ?? CHART_DAY_SCOPE_TYPE["7D"],
  );

  const changedPoolInfo = useMemo(() => {
    return isReversed === false
      ? {
          ...poolData,
          tokenA: {
            ...poolData.tokenA,
            ...getGnotPath(poolData.tokenA),
          },
          tokenB: {
            ...poolData.tokenB,
            ...getGnotPath(poolData.tokenB),
          },
        }
      : {
          ...poolData,
          tokenA: {
            ...poolData.tokenA,
            ...getGnotPath(poolData.tokenA),
          },
          tokenB: {
            ...poolData.tokenB,
            ...getGnotPath(poolData.tokenB),
          },
          price: 1 / poolData.price,
        };
  }, [getGnotPath, poolData, isReversed]);

  const hasData =
    changedPoolInfo.tokenA.name !== undefined &&
    changedPoolInfo.tokenA.name !== "";

  const showChart = () => {
    if (!hasData)
      return (
        <ExchangeChartNotFound>{t("common:noData")}</ExchangeChartNotFound>
      );
    return (
      <ExchangeRateGraphContent
        poolData={changedPoolInfo}
        selectedScope={selectedScope}
        isReversed={isReversed}
        onMouseMove={data => {
          setCurrentPoint(data?.value);
        }}
        onMouseOut={active => {
          setActive(active);
        }}
      />
    );
  };

  return (
    <ExchangeRateGraphWrapper>
      <ExchangeRateGraphHeaderWrapper>
        <ExchangeRateGraphTitleWrapper>
          <p className="title">{t("AddPosition:rateGraph.title")}</p>
          <div className="tooltip-wrap">
            <Tooltip
              placement="top"
              FloatingContent={
                <TooltipContentWrapper>
                  {t("AddPosition:rateGraph.tooltip")}
                </TooltipContentWrapper>
              }
            >
              <IconInfo className="tooltip-icon" />
            </Tooltip>
          </div>
        </ExchangeRateGraphTitleWrapper>
        <ExchangeRateGraphController>
          {hasData ? (
            <PairRatio
              pool={changedPoolInfo}
              loading={isLoading}
              isSwap={isReversed}
              overrideValue={active ? Number(currentPoint) : undefined}
            />
          ) : (
            <div />
          )}
          <ChartScopeSelectTab
            size={"SMALL"}
            list={Object.values(CHART_DAY_SCOPE_TYPE)}
            selected={selectedScope}
            onChange={value => setSelectedScope(value)}
          />
        </ExchangeRateGraphController>
      </ExchangeRateGraphHeaderWrapper>
      {!isLoading && showChart()}
      {isLoading && (
        <LoadingExchangeRateChartWrapper>
          <LoadingSpinner />
        </LoadingExchangeRateChartWrapper>
      )}
    </ExchangeRateGraphWrapper>
  );
};

export default ExchangeRateGraph;
