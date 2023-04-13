import React from "react";
import GainerCardList from "@components/token/gainer-card-list/GainerCardList";
import LoserCardList from "@components/token/loser-card-list/LoserCardList";
import { wrapper } from "./GainerAndLoser.styles";

interface GainerAndLoserProps {
  gainers: any[];
  losers: any[];
}

const GainerAndLoser: React.FC<GainerAndLoserProps> = ({ gainers, losers }) => {
  return (
    <div css={wrapper}>
      <GainerCardList gainers={gainers} />
      <LoserCardList losers={losers} />
    </div>
  );
};

export default GainerAndLoser;
