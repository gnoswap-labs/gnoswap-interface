import ExchangeRateGraphContent from "@components/pool/exchange-rate-graph-content/ExchangeRateGraphContent";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { ExchangeRateGraphHeaderWrapper, ExchangeRateGraphWrapper, LoadingExchangeRateChartWrapper, TooltipContentWrapper } from "./ExchangeRateGraph.styles";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";
import { PoolModel } from "@models/pool/pool-model";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface ExchangeRateGraphProps {
  poolData: PoolModel;
  onSwap?: (swap: boolean) => void;
  data?: TokenExchangeRateGraphResponse;
  isLoading: boolean;
  reverse: boolean;
}

const ExchangeRateGraph: React.FC<ExchangeRateGraphProps> = ({
  poolData,
  onSwap,
  isLoading,
  reverse,
}) => {
  return <ExchangeRateGraphWrapper>
    <ExchangeRateGraphHeaderWrapper>
      <p className="title">Exchange Rate</p>
      {<div className="tooltip-wrap">
        <Tooltip
          placement="top"
          FloatingContent={<TooltipContentWrapper>Exchange rate for the selected token pair.</TooltipContentWrapper>}
        >
          <IconInfo className="tooltip-icon" />
        </Tooltip>
      </div>}
    </ExchangeRateGraphHeaderWrapper>
    {!isLoading && <ExchangeRateGraphContent
      onSwap={onSwap}
      poolData={poolData}
      isLoading={isLoading}
      reverse={reverse}
    />}
    {isLoading && <LoadingExchangeRateChartWrapper>
      <LoadingSpinner />
    </LoadingExchangeRateChartWrapper>}
  </ExchangeRateGraphWrapper>;
};

export default ExchangeRateGraph;