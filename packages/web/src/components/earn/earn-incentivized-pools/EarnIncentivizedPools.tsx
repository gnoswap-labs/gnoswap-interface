import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { PoolsWrapper } from "./EarnIncentivizedPools.styles";
import { useRouter } from "next/router";
import EarnDescription from "../earn-description/EarnDescription";

interface EarnIncentivizedPoolsProps {
  cardList: React.ReactNode;
  address?: string;
}

const EarnIncentivizedPools: React.FC<EarnIncentivizedPoolsProps> = ({
  cardList,
  address,
}) => {
  const router = useRouter();

  if (address) {
    return (
      <EarnDescription />
    );
  }

  return (
    <PoolsWrapper>
      <div className="pool-header">
        <h2>Incentivized Pools</h2>
        <Button
          text="Incentivize Pool"
          style={{
            hierarchy: ButtonHierarchy.Primary,
            fontType: "p1",
            height: 36,
            padding: "10px 16px",
          }}
          onClick={() => router.push("/earn/incentivize")}
        />
      </div>
      {cardList}
    </PoolsWrapper>
  );
};

export default EarnIncentivizedPools;
