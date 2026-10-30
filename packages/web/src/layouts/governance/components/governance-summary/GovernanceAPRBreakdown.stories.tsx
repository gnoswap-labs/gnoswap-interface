import styled from "@emotion/styled";
import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";

import { fonts } from "@constants/font.constant";
import { useXgnsAprCopy } from "@layouts/governance/xgns-apr/xgns-apr";

import InfoBox from "../info-box/InfoBox";
import GovernanceAPRBreakdown, { type GovernanceAPRBreakdownProps } from "./GovernanceAPRBreakdown";
import GovernanceAPRTooltip from "./GovernanceAPRTooltip";
import { SAMPLE_APR_PREVIEW_LABEL, SAMPLE_XGNS_APR_HISTORY, SAMPLE_XGNS_APR } from "./governance-apr-preview.fixtures";
import { GovernanceSummaryWrapper } from "./GovernanceSummary.styles";

const PreviewFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;

  .sample-label {
    align-self: flex-start;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px dashed ${({ theme }) => theme.color.border02};
    ${fonts.p3};
    color: ${({ theme }) => theme.color.text04};
  }
`;

const StandaloneCard = styled.div`
  width: min(360px, 100%);
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};

  .value:has(> .apr-breakdown) {
    flex: 1 1 auto;
    min-width: 0;
  }
`;

const SampleLabel: React.FC<{ language?: string }> = ({ language }) => (
  <span className="sample-label">
    {language === "ko" ? "샘플 · 로컬 프리뷰 — 실제 운영 수치가 아닙니다" : SAMPLE_APR_PREVIEW_LABEL}
  </span>
);

const APRInfoBox: React.FC<GovernanceAPRBreakdownProps & { isLoading?: boolean }> = ({
  isLoading = false,
  ...props
}) => {
  const tApr = useXgnsAprCopy(props.language);

  return (
    <InfoBox
      title={tApr("title")}
      value={<GovernanceAPRBreakdown {...props} />}
      tooltip={<GovernanceAPRTooltip language={props.language} />}
      isLoading={isLoading}
    />
  );
};

/**
 * Governance summary row as on the live page: the real APR InfoBox next to real InfoBoxes
 * holding plain SAMPLE values, so the APR card is judged in its actual context.
 */
const SummaryRowStage: React.FC<GovernanceAPRBreakdownProps & { isLoading?: boolean }> = ({
  isLoading = false,
  ...props
}) => (
  <PreviewFrame>
    <SampleLabel language={props.language} />
    <GovernanceSummaryWrapper>
      <div className="info-wrapper">
        <InfoBox
          title={props.language === "ko" ? "총 위임량" : "Total Delegated"}
          value="1,234,567 GNS"
          isLoading={isLoading}
        />
        <InfoBox
          title={props.language === "ko" ? "GNS 위임 비율" : "GNS Delegated Ratio"}
          value="38.2%"
          isLoading={isLoading}
        />
        <APRInfoBox {...props} isLoading={isLoading} />
        <InfoBox
          title={props.language === "ko" ? "커뮤니티 풀" : "Community Pool"}
          value="$1,234,567"
          isLoading={isLoading}
        />
      </div>
    </GovernanceSummaryWrapper>
  </PreviewFrame>
);

const meta = {
  title: "governance/GovernanceAPRBreakdown",
  component: GovernanceAPRBreakdown,
  parameters: { layout: "padded" },
  args: {
    ...SAMPLE_XGNS_APR,
    aprHistory: SAMPLE_XGNS_APR_HISTORY,
  },
  argTypes: {
    language: { control: "inline-radio", options: ["en", "ko"] },
  },
  render: args => <SummaryRowStage {...args} />,
} satisfies Meta<typeof GovernanceAPRBreakdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Desktop: SAMPLE values in the four-stat governance summary row. */
export const SamplePreview: Story = {};

/** Same sample with the fee history popover opened through the real button. */
export const SampleHistoryOpen: Story = {
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>(".apr-history-trigger")?.click();
  },
};

export const SamplePreviewKorean: Story = {
  args: { language: "ko" },
};

/** Mobile viewport (414px): the summary row stacks and the APR rows must not overflow. */
export const SampleMobile: Story = {
  globals: { viewport: { value: "mobile2", isRotated: false } },
};

/** The APR component alone on the summary card surface. */
export const Standalone: Story = {
  render: args => (
    <PreviewFrame>
      <SampleLabel />
      <StandaloneCard>
        <APRInfoBox {...args} />
      </StandaloneCard>
    </PreviewFrame>
  ),
};

/** Legitimate zero values render as 0.00%. No daily rows, so no history action. */
export const Zero: Story = {
  args: { totalApr: "0", protocolFeeApr: "0", emissionApr: "0", aprHistory: [] },
};

/** Components missing from the API render as an em dash; nothing is derived from the total. */
export const MissingComponents: Story = {
  args: { totalApr: SAMPLE_XGNS_APR.totalApr, protocolFeeApr: undefined, emissionApr: undefined, aprHistory: [] },
};

/** Existing summary loading skeleton. */
export const Loading: Story = {
  render: args => <SummaryRowStage {...args} isLoading />,
};
