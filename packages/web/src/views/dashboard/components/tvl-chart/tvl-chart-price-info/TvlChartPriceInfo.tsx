import { TvlChartPriceInfoWrapper } from "./TvlChartPriceInfo.styles";

export interface TvlPriceInfo {
  amount: string;
}

interface TvlChartPriceInfoProps {
  tvlPriceInfo: TvlPriceInfo;
}
const TvlChartPriceInfo: React.FC<TvlChartPriceInfoProps> = ({
  tvlPriceInfo,
}) => (
  <TvlChartPriceInfoWrapper>
    <div className="label">TVL</div>
    <div className="price">{tvlPriceInfo.amount}</div>
  </TvlChartPriceInfoWrapper>
);

export default TvlChartPriceInfo;
