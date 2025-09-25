import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import useCustomRouter from "@hooks/common/use-custom-router";
import { YOUTUBE_LINKS, VideoGuideType, VIDEO_GUIDE_CONFIG, VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";
import { createYoutubeEmbedUrl } from "@utils/video-guide.utils";
import { QUERY_PARAMETER } from "@constants/page.constant";

import { VideoGuideModalWrapper } from "./VideoGuideModal.styles";
import withLocalModal from "@components/hoc/with-local-modal";
import Button, { ButtonHierarchy } from "../button/Button";
import { CopyTooltip } from "../header/wallet-connector-button/wallet-connector-menu/WalletConnectorMenu.styles";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";
import IconLink from "../icons/IconLink";
import IconRightArrow from "../icons/IconRightArrow";
import IconLearnMoreLink from "../icons/IconLearnMoreLink";
import IconClose from "../icons/IconCancel";
import IconPolygon from "../icons/IconPolygon";

interface VideoGuideModalProps {
  videoType: VideoGuideType;
  setIsOpen: (value: boolean) => void;
  onInternalActionClick?: () => void;
}

const TIMEOUTS = {
  SCROLL_DELAY: 100,
  SCROLL_BEHAVIOR_RESET: 500,
  COPY_NOTIFICATION: 3_000,
} as const;

const MODAL_CLOSE_VIDEO_TYPES = new Set<VideoGuideType>([
  VIDEO_GUIDE_TYPES.LAUNCHPAD,
  VIDEO_GUIDE_TYPES.GOVERNANCE,
  VIDEO_GUIDE_TYPES.LEADERBOARD,
]);

const VideoGuideModal = ({ videoType, setIsOpen, onInternalActionClick }: VideoGuideModalProps) => {
  const router = useCustomRouter();
  const { t } = useTranslation();

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const Modal = React.useMemo(() => withLocalModal(VideoGuideModalWrapper, setIsOpen), [setIsOpen]);

  const config = React.useMemo(() => VIDEO_GUIDE_CONFIG[videoType], [videoType]);
  const videoId = React.useMemo(() => YOUTUBE_LINKS[videoType], [videoType]);
  const embedUrl = React.useMemo(() => createYoutubeEmbedUrl(videoId), [videoId]);

  const [isLoadingIframe, setIsLoadingIframe] = React.useState(true);
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleClose = React.useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = "";
    }
    setIsOpen(false);
  }, [setIsOpen]);

  const internalActionRoute = React.useMemo(() => {
    if (videoType === VIDEO_GUIDE_TYPES.STAKING) {
      const poolPath = router.getPoolPath();
      return poolPath ? `${config.internalAction.route}${poolPath}` : "/earn";
    }
    return config.internalAction.route;
  }, [router, videoType, config.internalAction.route]);

  const handleSmoothScrollToHash = React.useCallback(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    setTimeout(() => {
      const hash = window.location.hash;
      if (hash) {
        const targetElement = document.querySelector(hash);
        targetElement?.scrollIntoView({ block: "start" });
      }

      setTimeout(() => {
        document.documentElement.style.scrollBehavior = "";
      }, TIMEOUTS.SCROLL_BEHAVIOR_RESET);
    }, TIMEOUTS.SCROLL_DELAY);
  }, []);

  const shouldCloseModal = MODAL_CLOSE_VIDEO_TYPES.has(videoType);

  const handleInternalActionClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (onInternalActionClick) {
        e.preventDefault();
        onInternalActionClick();
      }

      if (shouldCloseModal) {
        handleClose();

        if (videoType === VIDEO_GUIDE_TYPES.LAUNCHPAD) {
          handleSmoothScrollToHash();
        }
      }
    },
    [onInternalActionClick, shouldCloseModal, handleClose, videoType, handleSmoothScrollToHash],
  );

  const handleIframeLoad = React.useCallback(() => {
    setIsLoadingIframe(false);
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  }, []);

  const handleCopyLink = React.useCallback(async () => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.searchParams.set(QUERY_PARAMETER.GUIDE, videoType);

    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), TIMEOUTS.COPY_NOTIFICATION);
    } catch (err) {
      console.error("Failed to copy the link:", err);
    }
  }, [videoType]);

  return (
    <Modal>
      <div className="modal-body">
        <div className="header-actions">
          <div className="icon-wrap">
            <button onClick={handleCopyLink}>
              <IconLink className="header-action-icon" />
              {copied && (
                <CopyTooltip>
                  <div className="box dark-shadow">
                    <span>{t("common:copied")}</span>
                  </div>
                  <IconPolygon className="polygon-icon" />
                </CopyTooltip>
              )}
            </button>
          </div>
          <div className="icon-wrap">
            <button onClick={handleClose}>
              <IconClose className="header-action-icon" />
            </button>
          </div>
        </div>

        <div className="title-wrapper">
          <h1 className="title">{t(config.title.key)}</h1>
          <h6 className="sub-title">{t(config.subtitle.key)}</h6>
        </div>

        <div className="content-wrapper">
          <div className="video-content">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              onLoad={handleIframeLoad}
              className={isLoadingIframe ? "loading" : ""}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {isLoadingIframe && (
              <div className="loading-overlay">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>

        <div className="footer">
          <Link href={config.externalLink.url} target="_blank">
            <Button
              className="button"
              style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
              text={t(config.externalLink.textKey)}
              rightIcon={<IconLearnMoreLink />}
            />
          </Link>
          <Link href={internalActionRoute} onClick={handleInternalActionClick} scroll={false}>
            <Button
              className="button"
              style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
              text={t(config.internalAction.textKey)}
              rightIcon={<IconRightArrow />}
            />
          </Link>
          <Button
            className="button"
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
            text={t("common:action.close")}
            onClick={handleClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default VideoGuideModal;
