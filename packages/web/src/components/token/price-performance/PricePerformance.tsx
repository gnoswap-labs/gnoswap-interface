import PricePerformanceList from "@components/token/price-performance-list/PricePerformanceList";
import { wrapper } from "./PricePerformance.styles";

interface PricePerformanceProps {
  info: any;
}

const PricePerformance: React.FC<PricePerformanceProps> = ({ info }) => {
  return (
    <div css={wrapper}>
      <h2>Price Performance</h2>
      <PricePerformanceList list={info} />
    </div>
  );
};

export default PricePerformance;
