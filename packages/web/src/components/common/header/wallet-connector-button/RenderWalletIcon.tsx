import React from "react";

import { WalletTypeState } from "src/types/wallet.types";

import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import IconGoogleLogo from "@components/common/icons/defaultIcon/IconGoogleLogo";
import IconTwitterLogo from "@components/common/icons/defaultIcon/IconTwitterLogo";
import IconFailed from "@components/common/icons/IconFailed";
import IconEmailLogo from "@components/common/icons/defaultIcon/IconEmailLogo";

interface RenderWalletIconProps {
  isSwitchNetwork: boolean;
  walletType: WalletTypeState;
}

const RenderWalletIcon = ({ isSwitchNetwork, walletType }: RenderWalletIconProps) => {
  if (isSwitchNetwork) return <IconFailed className="fail-icon" />;

  if (walletType.type === "SOCIAL_WALLET") {
    switch (walletType.socialType) {
      case "email":
        return <IconEmailLogo />;
      case "google":
        return <IconGoogleLogo />;
      case "twitter":
        return <IconTwitterLogo />;
      default:
        return null;
    }
  }

  return <IconAdenaLogo />;
};

export default RenderWalletIcon;
