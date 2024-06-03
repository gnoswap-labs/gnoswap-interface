import PricePerformanceList from "@components/token/price-performance-list/PricePerformanceList";
import { wrapper } from "./PricePerformance.styles";

interface PricePerformanceProps {
  info: any;
  loading: boolean;
}

const PricePerformance: React.FC<PricePerformanceProps> = ({ info, loading }) => {
  return (
    <div css={wrapper}>
      <h2>Price Performance</h2>
      <PricePerformanceList list={info} loading={loading}/>
    </div>
  );
};

export default PricePerformance;
