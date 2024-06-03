import React from "react";
import GainerCardList from "@components/token/gainer-card-list/GainerCardList";
import LoserCardList from "@components/token/loser-card-list/LoserCardList";
import { wrapper } from "./GainerAndLoser.styles";

interface GainerAndLoserProps {
  gainers: any[];
  losers: any[];
  loadingGain: boolean;
  loadingLose: boolean;
}

const GainerAndLoser: React.FC<GainerAndLoserProps> = ({ gainers, losers, loadingLose, loadingGain }) => {
  return (
    <div css={wrapper}>
      <GainerCardList gainers={gainers} loadingGain={loadingGain}/>
      <LoserCardList losers={losers} loadingLose={loadingLose}/>
    </div>
  );
};

export default GainerAndLoser;
