import ExchangeRateGraphContent from "@components/pool/exchange-rate-graph-content/ExchangeRateGraphContent";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { ExchangeRateGraphController, ExchangeRateGraphHeaderWrapper, ExchangeRateGraphTitleWrapper, ExchangeRateGraphWrapper, LoadingExchangeRateChartWrapper, TooltipContentWrapper } from "./ExchangeRateGraph.styles";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";
import { PoolModel } from "@models/pool/pool-model";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import ChartScopeSelectTab from "@components/common/chart-scope-select-tab/ChartScopeSelectTab";
import PairRatio from "@components/common/pair-ratio/PairRatio";

interface ExchangeRateGraphProps {
  poolData: PoolModel;
  onSwap?: (swap: boolean) => void;
  data?: TokenExchangeRateGraphResponse;
  isLoading: boolean;
  reverse: boolean;
  selectedScope: CHART_DAY_SCOPE_TYPE;
  setSelectedScope: (type: CHART_DAY_SCOPE_TYPE) => void;
}

const ExchangeRateGraph: React.FC<ExchangeRateGraphProps> = ({
  poolData,
  onSwap,
  isLoading,
  reverse,
  setSelectedScope,
  selectedScope,
}) => {

  return <ExchangeRateGraphWrapper>
    <ExchangeRateGraphHeaderWrapper>
      <ExchangeRateGraphTitleWrapper>
        <p className="title">Exchange Rate</p>
        <div className="tooltip-wrap">
          <Tooltip
            placement="top"
            FloatingContent={<TooltipContentWrapper>Exchange rate for the selected token pair.</TooltipContentWrapper>}
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
          isSwap={reverse}
        />
        <ChartScopeSelectTab
          size={"SMALL"}
          list={Object.values(CHART_DAY_SCOPE_TYPE)}
          selected={selectedScope}
          onChange={(value) => setSelectedScope(value)}
        />
      </ExchangeRateGraphController>
    </ExchangeRateGraphHeaderWrapper>
    {!isLoading && <ExchangeRateGraphContent
      onSwap={onSwap}
      poolData={poolData}
      isLoading={isLoading}
      reverse={reverse} selectedScope={selectedScope} />}
    {isLoading && <LoadingExchangeRateChartWrapper>
      <LoadingSpinner />
    </LoadingExchangeRateChartWrapper>}
  </ExchangeRateGraphWrapper>;
};

export default ExchangeRateGraph;