import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { ButtonHierarchy } from "@components/common/button/Button";
import { CopyReferralLinkButton, StyledIconLink, Text } from "./CopyReferralLink.styles";
import { QUERY_PARAMETER } from "@constants/page.constant";

const CopyReferralLink = ({
  connected,
  isMobile,
  address,
}: {
  connected: boolean;
  isMobile: boolean;
  address?: string;
}) => {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  const referralLink = React.useMemo(() => {
    if (typeof window === "undefined" || !address) return "";

    const url = new URL(window.location.origin);
    url.searchParams.set(QUERY_PARAMETER.REFERRER, address);
    return url.toString();
  }, [address]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => setCopied(true))
      .then(() => setTimeout(() => setCopied(false), 3000));
  };

  return (
    <div style={{ width: isMobile ? "100%" : "unset" }}>
      <CopyReferralLinkButton
        disabled={!connected}
        style={{
          hierarchy: connected ? ButtonHierarchy.Primary : ButtonHierarchy.Gray,
          width: "170px",
          height: "36px",
        }}
        onClick={handleCopy}
        text={<Text> {copied ? t("common:copied") : t("Leaderboard:subHeader.copyButton")}</Text>}
        leftIcon={copied || <StyledIconLink />}
      />
    </div>
  );
};

export default CopyReferralLink;
