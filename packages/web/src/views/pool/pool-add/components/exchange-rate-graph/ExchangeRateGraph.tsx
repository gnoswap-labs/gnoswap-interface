import { useState } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import PairRatio from "@components/common/pair-ratio/PairRatio";
import Tooltip from "@components/common/tooltip/Tooltip";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { PoolModel } from "@models/pool/pool-model";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";

import ChartScopeSelectTab from "./chart-scope-select-tab/ChartScopeSelectTab";
import ExchangeRateGraphContent from "./exchange-rate-graph-content/ExchangeRateGraphContent";

import {
  ExchangeChartNotFound,
  ExchangeRateGraphController,
  ExchangeRateGraphHeaderWrapper,
  ExchangeRateGraphTitleWrapper,
  ExchangeRateGraphWrapper,
  LoadingExchangeRateChartWrapper,
  TooltipContentWrapper
} from "./ExchangeRateGraph.styles";

interface ExchangeRateGraphProps {
  poolData: PoolModel;
  onSwap?: (swap: boolean) => void;
  data?: TokenExchangeRateGraphResponse;
  isLoading: boolean;
  isReversed: boolean;
  selectedScope: CHART_DAY_SCOPE_TYPE;
  setSelectedScope: (type: CHART_DAY_SCOPE_TYPE) => void;
}

const ExchangeRateGraph: React.FC<ExchangeRateGraphProps> = ({
  poolData,
  onSwap,
  isLoading,
  isReversed,
  setSelectedScope,
  selectedScope,
}) => {
  const { t } = useTranslation();

  const [currentPoint, setCurrentPoint] = useState<string | null>();
  const [active, setActive] = useState<boolean>(false);

  const hasData =
    poolData.tokenA.name !== undefined && poolData.tokenA.name !== "";

  const showChart = () => {
    if (!hasData)
      return (
        <ExchangeChartNotFound>{t("common:noData")}</ExchangeChartNotFound>
      );
    return (
      <ExchangeRateGraphContent
        poolData={poolData}
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
              onSwap={onSwap}
              pool={poolData}
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
