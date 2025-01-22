import React from "react";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useAtom } from "jotai";
import { WalletState } from "@states/index";
import { useSessionExpiredModal } from "@hooks/wallet/ui/use-session-expired-modal";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const VISIBILITY_TIMEOUT_MS = 1 * 60 * 1000; // 5 minutes

/**
 *
 * Custom hook that manages automatic disconnection of social wallets after inactivity
 * or when the page becomes hidden (mobile lock screen, app switching, etc.)
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
  const visibilityTimerRef = React.useRef<NodeJS.Timeout>();

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
    }, INACTIVITY_TIMEOUT_MS);
  }, [handleDisconnect]);

  /**
   * Handles page visibility changes
   * Sets a timer when page becomes hidden and clears it when visible again
   */
  const handleVisibilityChange = React.useCallback(() => {
    if (document.hidden) {
      console.log(document.hidden, "hidden?");
      // Page is hidden (locked screen, switched apps, etc.)
      visibilityTimerRef.current = setTimeout(() => {
        handleDisconnect();
      }, VISIBILITY_TIMEOUT_MS);
    } else {
      console.log(document.hidden, "hidden?");
      // Page is visible again
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
      }
      // Restart inactivity timer when page becomes visible
      restartInactivityTimer();
    }
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

    document.addEventListener("visibilitychange", handleVisibilityChange);

    restartInactivityTimer();

    return () => {
      userActivityEvents.forEach(event => {
        window.removeEventListener(event, restartInactivityTimer);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
      }
    };
  }, [restartInactivityTimer, handleVisibilityChange, walletClient, account]);
};
