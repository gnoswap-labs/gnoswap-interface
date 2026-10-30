import styled from "@emotion/styled";
import React from "react";

import { useXgnsAprCopy } from "@layouts/governance/xgns-apr/xgns-apr";

const TooltipCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 12px;
  line-height: 1.45;
  white-space: normal;

  .apr-formula {
    display: block;
    padding: 12px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.color.background06};
    color: ${({ theme }) => theme.color.text02};
    font-style: italic;
    font-weight: 600;
  }
`;

const GovernanceAPRTooltip: React.FC<{ language?: string }> = ({ language }) => {
  const tApr = useXgnsAprCopy(language);

  return (
    <TooltipCopy>
      {tApr("tooltip")
        .split("\n\n")
        .map((paragraph, index) => (
          <span key={paragraph} className={index === 1 ? "apr-formula" : undefined}>
            {paragraph}
          </span>
        ))}
    </TooltipCopy>
  );
};

export default GovernanceAPRTooltip;
