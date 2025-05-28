import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import { CHART_DAY_SCOPE_TYPE } from "@constants/option.constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { PoolModel } from "@models/pool/pool-model";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";
import { useGetPoolPriceByPath } from "@query/pools/use-get-pool-price-by-path";

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
} from "./ExchangeRateGraph.styles";
import { DEVICE_TYPE } from "@styles/media";

interface ExchangeRateGraphProps {
  breakpoint: DEVICE_TYPE;
  currentPoolData: PoolModel;
  poolPath: string | null;
  isReversed: boolean;
  data?: TokenExchangeRateGraphResponse;
  isLoading: boolean;
  defaultScope?: CHART_DAY_SCOPE_TYPE;
}

const ExchangeRateGraph: React.FC<ExchangeRateGraphProps> = ({
  breakpoint,
  currentPoolData,
  poolPath,
  isReversed,
  isLoading,
  defaultScope,
}) => {
  const { t } = useTranslation();
  const { getGnotPath } = useGnotToGnot();

  const [currentPoint, setCurrentPoint] = useState<string | null>();
  const [active, setActive] = useState<boolean>(false);
  const [selectedScope, setSelectedScope] = useState<CHART_DAY_SCOPE_TYPE>(defaultScope ?? CHART_DAY_SCOPE_TYPE["7D"]);

  const { data: { prices = [] } = {} } = useGetPoolPriceByPath(poolPath || "", selectedScope, {
    enabled: Boolean(poolPath),
  });

  const changedPoolInfo = useMemo(() => {
    const processTokens = (poolData: typeof currentPoolData) => ({
      ...poolData,
      tokenA: {
        ...poolData.tokenA,
        ...getGnotPath(poolData.tokenA),
      },
      tokenB: {
        ...poolData.tokenB,
        ...getGnotPath(poolData.tokenB),
      },
    });

    const processedPool = processTokens(currentPoolData);

    return isReversed ? { ...processedPool, price: 1 / processedPool.price } : processedPool;
  }, [getGnotPath, currentPoolData, isReversed]);

  const hasData = changedPoolInfo.tokenA.name !== undefined && changedPoolInfo.tokenA.name !== "";

  const showChart = () => {
    if (!hasData) return <ExchangeChartNotFound>{t("common:noData")}</ExchangeChartNotFound>;
    return (
      <>
        <ExchangeRateGraphContent
          pricesData={prices}
          onMouseMove={data => {
            setCurrentPoint(data?.value);
          }}
          onMouseOut={active => {
            setActive(active);
          }}
        />
      </>
    );
  };

  return (
    <ExchangeRateGraphWrapper>
      <ExchangeRateGraphHeaderWrapper>
        <ExchangeRateGraphTitleWrapper>
          <p className="title">{t("AddPosition:rateGraph.title")}</p>
        </ExchangeRateGraphTitleWrapper>
        <ExchangeRateGraphController>
          {hasData ? (
            <PairRatio
              breakpoint={breakpoint}
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
