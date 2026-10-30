import styled from "@emotion/styled";
import React from "react";

import { useTranslation } from "react-i18next";

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

interface GovernanceAPRTooltipProps {
  translationKey?: "summary.apy.tooltip" | "myDel.delModal.step3.aprTooltip";
}

const GovernanceAPRTooltip: React.FC<GovernanceAPRTooltipProps> = ({ translationKey = "summary.apy.tooltip" }) => {
  const { t } = useTranslation("Governance");

  return (
    <TooltipCopy>
      {t(translationKey)
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
