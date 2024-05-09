import ExchangeRateGraphContent from "@components/pool/exchange-rate-graph-content/ExchangeRateGraphContent";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { ExchangeRateGraphHeaderWrapper, ExchangeRateGraphWrapper, TooltipContentWrapper } from "./ExchangeRateGraph.styles";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";
import { PoolModel } from "@models/pool/pool-model";

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
  console.log("🚀 ~ poolData:", poolData);

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
    <ExchangeRateGraphContent
      onSwap={onSwap}
      poolData={poolData}
      isLoading={isLoading}
      reverse={reverse}
    />
  </ExchangeRateGraphWrapper>;
};

export default ExchangeRateGraph;