import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { PoolsWrapper } from "./EarnIncentivizedPools.styles";
import { useRouter } from "next/router";

interface EarnIncentivizedPoolsProps {
  cardList: React.ReactNode;
}

const EarnIncentivizedPools: React.FC<EarnIncentivizedPoolsProps> = ({
  cardList,
}) => {
  const router = useRouter();
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
