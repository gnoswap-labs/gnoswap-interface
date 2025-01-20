import React from "react";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useAtom } from "jotai";
import { WalletState } from "@states/index";
import { useSessionExpiredModal } from "@hooks/wallet/ui/use-session-expired-modal";

const INACTIVITY_TIMEOUT_MINUTES = 5 * 60 * 1000; // 5 minutes

/**
 *
 * Custom hook that manages automatic disconnection of social wallets after inactivity
 *
 * @description
 * Implements an auto-disconnect security feature that monitors user activity and
 * disconnects social wallet users after a period of inactivity (1 minute).
 * Shows a session expired modal before disconnecting.
 *
 * @listens {UserEvents} Following user activities reset the inactivity timer:
 * - mousedown
 * - mousemove
 * - keydown
 * - scroll
 * - touchstart
 * - click
 *
 * @requires
 * - walletClient must be SOCIAL_WALLET type
 * - account must exist
 *
 * @dependencies
 * - useWallet - For account info and disconnect functionality
 * - useSessionExpiredModal - For displaying session expiry notification
 * - WalletState - For wallet client information
 *
 */
export const useAutoDisconnect = () => {
  const [walletClient] = useAtom(WalletState.client);

  const { openModal: openSessionExpiredModal } = useSessionExpiredModal();
  const { account, disconnectWallet } = useWallet();

  const inactivityTimerRef = React.useRef<NodeJS.Timeout>();

  /**
   * Handles the wallet disconnection process
   * Shows the sesion expired modal and disconnects the wallet
   */
  const handleDisconnect = () => {
    openSessionExpiredModal();
    disconnectWallet();
  };

  /**
   * Restarts the inactivity timer when user activity is detected
   * Clears existing timer and sets a new one
   */
  const restartInactivityTimer = React.useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      handleDisconnect();
    }, INACTIVITY_TIMEOUT_MINUTES);
  }, []);

  /**
   * Sets up event listeners for user activity monitoring
   *
   * @effects
   * - Adds event listeners for user activity events
   * - Initializes inactivity timer
   * - Cleans up listeners and timer on unmount
   */
  React.useEffect(() => {
    if (!walletClient || walletClient.getWalletType() !== "SOCIAL_WALLET" || !account) {
      return;
    }

    const userActivityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];

    userActivityEvents.forEach(eventName => {
      window.addEventListener(eventName, restartInactivityTimer);
    });

    restartInactivityTimer();

    return () => {
      userActivityEvents.forEach(event => {
        window.removeEventListener(event, restartInactivityTimer);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [restartInactivityTimer, walletClient, account]);
};
