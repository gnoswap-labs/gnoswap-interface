import React from "react";
import { DecreaseSelectPositionWrapper } from "./DecreaseSelectPosition.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

const DecreaseSelectPositionLoading: React.FC = () => {
  return (
    <DecreaseSelectPositionWrapper>
      <h5>1. Selected Position</h5>
      <div className="loading-wrapper position">
        <LoadingSpinner />
      </div>
    </DecreaseSelectPositionWrapper>
  );
};

export default DecreaseSelectPositionLoading;
