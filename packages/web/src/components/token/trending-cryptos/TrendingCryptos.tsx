import React from "react";
import { useTranslation } from "react-i18next";
import { wrapper } from "./TrendingCryptos.styles";

interface TrendingCryptosProps {
  cardList: React.ReactNode;
}

const TrendingCryptos: React.FC<TrendingCryptosProps> = ({ cardList }) => {
  const { t } = useTranslation();

  return (
    <div css={wrapper}>
      <h2>{t("TokenDetails:trending.title")}</h2>
      {cardList}
    </div>
  );
};

export default TrendingCryptos;
