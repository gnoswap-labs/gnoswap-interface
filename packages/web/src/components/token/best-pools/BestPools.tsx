import { BestPool } from "@containers/best-pools-container/BestPoolsContainer";
import React from "react";
import BestPoolCardList from "@components/token/best-pool-card-list/BestPoolCardList";
import { wrapper } from "./BestPools.styles";
import { useTranslation } from "react-i18next";

interface BestPoolsProps {
  titleSymbol: string;
  cardList: BestPool[];
  loading: boolean;
}

const BestPools: React.FC<BestPoolsProps> = ({
  titleSymbol,
  cardList,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <h2>
        {t("TokenDetails:bestPool.title", {
          symbol: titleSymbol,
        })}
      </h2>
      <BestPoolCardList list={cardList} loading={loading} />
    </div>
  );
};

export default BestPools;
