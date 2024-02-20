import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { wrapper } from "./MarketInformationList.styles";

interface MarketInformationListProps {
  list: any;
  loading: boolean;
}

const TITLE_LIST = ["Popularity", "TVL", "Volume (24h)", "Fees (24h)"];

const MarketInformationList: React.FC<MarketInformationListProps> = ({
  list,
  loading,
}) => {
  return (
    <div css={wrapper}>
      {Object.values(list).map((item: any, idx: number) => (
        <div key={idx} className="marketInfo-wrap">
          <span className="title">{TITLE_LIST[idx]}</span>
          {!loading && <span className="market-info-value">{item}</span>}
          {loading && <span
            className="loading-value"
            css={pulseSkeletonStyle({ h: 22, w : "100px"})}
          />}
        </div>
      ))}
    </div>
  );
};

export default MarketInformationList;
