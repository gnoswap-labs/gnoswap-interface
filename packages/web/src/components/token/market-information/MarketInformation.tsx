import MarketInformationList from "@components/token/market-information-list/MarketInformationList";
import { wrapper } from "./MarketInformation.styles";

interface MarketInformationProps {
  info: any;
}

const MarketInformation: React.FC<MarketInformationProps> = ({ info }) => {
  return (
    <div css={wrapper}>
      <h2>Market Information</h2>
      <MarketInformationList list={info} />
    </div>
  );
};

export default MarketInformation;
