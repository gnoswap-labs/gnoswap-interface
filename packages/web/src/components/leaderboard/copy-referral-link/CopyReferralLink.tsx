import { ButtonHierarchy } from "@components/common/button/Button";
import IconLink from "@components/common/icons/IconLink";
import { useState } from "react";
import { CopyReferralLinkButton } from "./CopyReferralLink.styles";

const CopyReferralLink = ({
  connected,
  address,
}: {
  connected: boolean;
  address?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const copyContent = `gnoswap.io/referrer=${address}`;

    navigator.clipboard
      .writeText(copyContent)
      .then(() => setCopied(true))
      .then(() => setTimeout(() => setCopied(false), 3000));
  };

  return (
    <div>
      <CopyReferralLinkButton
        disabled={!connected}
        style={{
          hierarchy: connected ? ButtonHierarchy.Primary : ButtonHierarchy.Gray,
        }}
        onClick={handleCopy}
        text={copied ? "Copied!" : "Copy Referral Link"}
        leftIcon={copied || <IconLink />}
      />
    </div>
  );
};

export default CopyReferralLink;
