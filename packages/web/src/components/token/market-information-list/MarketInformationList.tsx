import { wrapper } from "./MarketInformationList.styles";

interface MarketInformationListProps {
  list: any;
}

const TITLE_LIST = ["Popularity", "TVL", "Volume (24h)", "Fees (24h)"];

const MarketInformationList: React.FC<MarketInformationListProps> = ({
  list,
}) => {
  return (
    <div css={wrapper}>
      {Object.values(list).map((item: any, idx: number) => (
        <div key={idx} className="marketInfo-wrap">
          <span className="title">{TITLE_LIST[idx]}</span>
          <span className="market-info-value">{item}</span>
        </div>
      ))}
    </div>
  );
};

export default MarketInformationList;
