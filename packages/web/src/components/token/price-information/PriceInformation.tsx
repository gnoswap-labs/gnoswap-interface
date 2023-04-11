import PriceInformationList from "@components/token/price-information-list/PriceInformationList";
import { wrapper } from "./PriceInformation.styles";

interface PriceInformationProps {
  info: any;
}

const PriceInformation: React.FC<PriceInformationProps> = ({ info }) => {
  return (
    <div css={wrapper}>
      <h2>Price Information</h2>
      <PriceInformationList list={info} />
    </div>
  );
};

export default PriceInformation;
