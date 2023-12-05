import PriceInformationList from "@components/token/price-information-list/PriceInformationList";
import { wrapper } from "./PriceInformation.styles";

interface PriceInformationProps {
  info: any;
  loading: boolean;
}

const PriceInformation: React.FC<PriceInformationProps> = ({ info, loading }) => {
  return (
    <div css={wrapper}>
      <h2>Price Information</h2>
      <PriceInformationList list={info} loading={loading}/>
    </div>
  );
};

export default PriceInformation;
