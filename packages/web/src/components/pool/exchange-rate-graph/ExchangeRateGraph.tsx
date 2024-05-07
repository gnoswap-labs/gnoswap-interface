import ExchangeRateGraphContent from "@components/pool/exchange-rate-graph-content/ExchangeRateGraphContent";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { TokenModel } from "@models/token/token-model";
import { ExchangeRateGraphHeaderWrapper, ExchangeRateGraphWrapper, TooltipContentWrapper } from "./ExchangeRateGraph.styles";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";

interface ExchangeRateGraphProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  feeTier: string;
  onSwap?: (swap: boolean) => void;
  data?: TokenExchangeRateGraphResponse;
}

function ExchangeRateGraph({
  tokenA,
  tokenB,
  feeTier,
  onSwap,
  data,
}: ExchangeRateGraphProps) {
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
      tokenA={tokenA}
      tokenB={tokenB}
      feeTier={feeTier}
      data={data}
    />
  </ExchangeRateGraphWrapper>;
}

export default ExchangeRateGraph;