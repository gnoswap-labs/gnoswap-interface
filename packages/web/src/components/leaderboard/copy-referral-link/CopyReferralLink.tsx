import { ButtonHierarchy } from "@components/common/button/Button";
import { useState } from "react";
import {
  CopyReferralLinkButton,
  StyledIconLink,
  Text,
} from "./CopyReferralLink.styles";

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
          width: "170px",
          height: "36px",
        }}
        onClick={handleCopy}
        text={copied ? <Text>Copied!</Text> : <Text>Copy Referral Link</Text>}
        leftIcon={copied || <StyledIconLink />}
      />
    </div>
  );
};

export default CopyReferralLink;
