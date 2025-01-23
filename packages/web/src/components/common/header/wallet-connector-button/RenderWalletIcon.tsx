import React from "react";
import { useTheme } from "@emotion/react";

import { WalletTypeState } from "src/types/wallet.types";
import { GNOSWAP_WALLET_TYPE_KEY, GNOSWAP_SOCIAL_LOGIN_TYPE_KEY } from "@states/common";

import IconAdenaLogo from "@components/common/icons/defaultIcon/IconAdenaLogo";
import IconGoogleLogo from "@components/common/icons/defaultIcon/IconGoogleLogo";
import IconTwitterLogo from "@components/common/icons/defaultIcon/IconTwitterLogo";
import IconFailed from "@components/common/icons/IconFailed";
import IconEmailLogo from "@components/common/icons/defaultIcon/IconEmailLogo";

interface RenderWalletIconProps {
  isSwitchNetwork: boolean;
  walletType: WalletTypeState;
}

const RenderWalletIcon = ({ isSwitchNetwork }: RenderWalletIconProps) => {
  const theme = useTheme();
  const [walletType, setWalletType] = React.useState<string | null>(() =>
    sessionStorage.getItem(GNOSWAP_WALLET_TYPE_KEY),
  );
  const [socialType, setSocialType] = React.useState<string | null>(() =>
    sessionStorage.getItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY),
  );

  React.useEffect(() => {
    const handleStorageChange = () => {
      setWalletType(sessionStorage.getItem(GNOSWAP_WALLET_TYPE_KEY));
      setSocialType(sessionStorage.getItem(GNOSWAP_SOCIAL_LOGIN_TYPE_KEY));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (isSwitchNetwork) return <IconFailed className="fail-icon render-wallet-icon" />;

  if (walletType === "SOCIAL_WALLET") {
    switch (socialType) {
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

  if (walletType === "ADENA") return <IconAdenaLogo className="render-wallet-icon" />;

  // UI while loading wallet information
  return <div style={{ width: 16, height: 16 }} />;
};

export default React.memo(RenderWalletIcon);
