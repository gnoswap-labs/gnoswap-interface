import { ButtonHierarchy } from "@components/common/button/Button";
import IconLink from "@components/common/icons/IconLink";
import { useState } from "react";
import { CopyReferralLinkButton } from "./CopyReferralLink.styles";

const CopyReferralLink = ({ conneted }: { conneted: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const copyContent = "COPY!";

    navigator.clipboard
      .writeText(copyContent)
      .then(() => setCopied(true))
      .then(() => setTimeout(() => setCopied(false), 3000));
  };

  return (
    <CopyReferralLinkButton
      disabled={!conneted}
      style={{
        hierarchy: conneted ? ButtonHierarchy.Primary : ButtonHierarchy.Gray,
      }}
      onClick={handleCopy}
      text={copied ? "Copied!" : "Copy Referral Link"}
      leftIcon={copied || <IconLink />}
    />
  );
};

export default CopyReferralLink;
