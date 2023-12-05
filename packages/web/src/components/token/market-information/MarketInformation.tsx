import MarketInformationList from "@components/token/market-information-list/MarketInformationList";
import { wrapper } from "./MarketInformation.styles";

interface MarketInformationProps {
  info: any;
  loading: boolean;
}

const MarketInformation: React.FC<MarketInformationProps> = ({ info, loading }) => {
  return (
    <div css={wrapper}>
      <h2>Market Information</h2>
      <MarketInformationList list={info} loading={loading}/>
    </div>
  );
};

export default MarketInformation;
