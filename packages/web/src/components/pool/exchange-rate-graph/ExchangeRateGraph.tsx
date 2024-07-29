import ExchangeRateGraphContent from "@components/pool/exchange-rate-graph-content/ExchangeRateGraphContent";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  ExchangeRateGraphController,
  ExchangeRateGraphHeaderWrapper,
  ExchangeRateGraphTitleWrapper,
  ExchangeRateGraphWrapper,
  LoadingExchangeRateChartWrapper,
  TooltipContentWrapper,
} from "./ExchangeRateGraph.styles";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";
import { PoolModel } from "@models/pool/pool-model";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import ChartScopeSelectTab from "@components/common/chart-scope-select-tab/ChartScopeSelectTab";
import PairRatio from "@components/common/pair-ratio/PairRatio";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
          <PairRatio
            onSwap={onSwap}
            pool={poolData}
            loading={isLoading}
            isSwap={isReversed}
            overrideValue={active ? Number(currentPoint) : undefined}
          />
          <ChartScopeSelectTab
            size={"SMALL"}
            list={Object.values(CHART_DAY_SCOPE_TYPE)}
            selected={selectedScope}
            onChange={value => setSelectedScope(value)}
          />
        </ExchangeRateGraphController>
      </ExchangeRateGraphHeaderWrapper>
      {!isLoading && (
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
      )}
      {isLoading && (
        <LoadingExchangeRateChartWrapper>
          <LoadingSpinner />
        </LoadingExchangeRateChartWrapper>
      )}
    </ExchangeRateGraphWrapper>
  );
};

export default ExchangeRateGraph;
