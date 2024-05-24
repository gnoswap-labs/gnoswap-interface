import React from "react";
import { DecreasePoolInfoWrapper } from "./DecreasePoolInfo.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

const DecreasePoolInfoLoading: React.FC = () => {
  return (
    <DecreasePoolInfoWrapper>
      <div className="loading-wrapper amount">
        <LoadingSpinner />
      </div>
    </DecreasePoolInfoWrapper>
  );
};

export default DecreasePoolInfoLoading;
