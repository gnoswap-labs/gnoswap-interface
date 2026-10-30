import styled from "@emotion/styled";
import React from "react";

import { UNAVAILABLE_APR } from "@layouts/governance/xgns-apr/xgns-apr";

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

interface GovernanceAPRValueProps {
  /** Formatted value; the unavailable em dash is announced as `unavailableLabel`. */
  value: string;
  unavailableLabel: string;
}

const GovernanceAPRValue: React.FC<GovernanceAPRValueProps> = ({ value, unavailableLabel }) => {
  if (value !== UNAVAILABLE_APR) {
    return <>{value}</>;
  }

  return (
    <span className="apr-unavailable" title={unavailableLabel}>
      <span aria-hidden="true">{UNAVAILABLE_APR}</span>
      <VisuallyHidden>{unavailableLabel}</VisuallyHidden>
    </span>
  );
};

export default GovernanceAPRValue;
