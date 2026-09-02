import React from "react";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useAtom } from "jotai";
import { WalletState } from "@states/index";
import { useSessionExpiredModal } from "@hooks/wallet/ui/use-session-expired-modal";

const SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const BACKGROUND_CHECK_INTERVAL = 10 * 1000;

export const AUTH_STORE_KEY = "auth_store";

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
  const { account, disconnectWallet, resetWeb3authSession } = useWallet();

  const inactivityTimerRef = React.useRef<NodeJS.Timeout>();
  const backgroundCheckIntervalRef = React.useRef<NodeJS.Timeout>();
  const lastActiveTimestampRef = React.useRef<number>(Date.now());

  /**
   * Handles the wallet disconnection process
   * Shows the sesion expired modal and disconnects the wallet
   */
  const handleDisconnect = React.useCallback(async () => {
    openSessionExpiredModal();
    await disconnectWallet();
    resetWeb3authSession();
  }, [disconnectWallet, openSessionExpiredModal]);

  /**
   * Updates the last active timestamp and restarts the inactivity timer
   */
  const updateLastActiveTimestamp = React.useCallback(() => {
    lastActiveTimestampRef.current = Date.now();

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      handleDisconnect();
    }, SESSION_TIMEOUT_MS);
  }, []);

  /**
   * Checks if the user has been inactive for too long while in background
   */
  const checkBackgroundInactivity = React.useCallback(() => {
    const now = Date.now();
    const timeSinceLastActive = now - lastActiveTimestampRef.current;

    if (timeSinceLastActive >= SESSION_TIMEOUT_MS) {
      handleDisconnect();
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
      window.addEventListener(eventName, updateLastActiveTimestamp);
    });

    backgroundCheckIntervalRef.current = setInterval(checkBackgroundInactivity, BACKGROUND_CHECK_INTERVAL);

    updateLastActiveTimestamp();

    return () => {
      userActivityEvents.forEach(event => {
        window.removeEventListener(event, updateLastActiveTimestamp);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (backgroundCheckIntervalRef.current) {
        clearInterval(backgroundCheckIntervalRef.current);
      }
    };
  }, [updateLastActiveTimestamp, checkBackgroundInactivity, walletClient, account]);
};
