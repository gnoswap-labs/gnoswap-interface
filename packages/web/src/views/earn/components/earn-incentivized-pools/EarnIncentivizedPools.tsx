import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import useRouter from "@hooks/common/use-custom-router";

import EarnDescription from "../earn-description/EarnDescription";

import { PoolsWrapper } from "./EarnIncentivizedPools.styles";

interface EarnIncentivizedPoolsProps {
  cardList: React.ReactNode;
  isOtherPosition: boolean;
}

const EarnIncentivizedPools: React.FC<EarnIncentivizedPoolsProps> = ({
  cardList,
  isOtherPosition,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (isOtherPosition) {
    return <EarnDescription />;
  }

  return (
    <PoolsWrapper>
      <div className="pool-header">
        <h2>{t("Earn:incentiPools.title")}</h2>
        <Button
          text={t("Earn:incentiPools.incentiBtn")}
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
