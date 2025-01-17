import React from "react";
import { useTheme } from "@emotion/react";

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
  const theme = useTheme();

  if (isSwitchNetwork) return <IconFailed className="fail-icon render-wallet-icon" />;

  if (walletType.type === "SOCIAL_WALLET") {
    switch (walletType.socialType) {
      case "email":
        return <IconEmailLogo className="render-wallet-icon" />;
      case "google":
        return <IconGoogleLogo className="render-wallet-icon" />;
      case "twitter":
        return <IconTwitterLogo className="render-wallet-icon" fill={theme.themeKey === "dark" ? "" : "black"} />;
      default:
        return null;
    }
  }

  return <IconAdenaLogo className="render-wallet-icon" />;
};

export default RenderWalletIcon;
