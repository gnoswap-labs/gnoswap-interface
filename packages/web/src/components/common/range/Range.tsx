import { RangeWrapper } from "./Range.styles";
import React from "react";

interface Props {
  percent: number;
  handlePercent: (value: number) => void;
}

const Range: React.FC<Props> = ({ percent, handlePercent}) => {
  return <RangeWrapper type="range" min="1" max="100" value={percent} onChange={(e) => handlePercent(Number(e.target.value))}></RangeWrapper>;
};

export default Range;
