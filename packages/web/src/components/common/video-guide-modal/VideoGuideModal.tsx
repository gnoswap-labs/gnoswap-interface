import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { YOUTUBE_LINKS, VideoGuideType } from "@constants/youtube-links.constant";
import { VIDEO_GUIDE_CONFIG } from "@constants/video-guide-config.constant";
import { createYoutubeEmbedUrl } from "@utils/youtube.utils";

import { VideoGuideModalWrapper } from "./VideoGuideModal.styles";
import withLocalModal from "@components/hoc/with-local-modal";
import Button, { ButtonHierarchy } from "../button/Button";
import IconLink from "../icons/IconLink";
import IconRightArrow from "../icons/IconRightArrow";
import IconLearnMoreLink from "../icons/IconLearnMoreLink";
import IconClose from "../icons/IconCancel";

interface VideoGuideModalProps {
  videoType: VideoGuideType;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const VideoGuideModal = ({ videoType, setIsOpen }: VideoGuideModalProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const Modal = React.useMemo(() => withLocalModal(VideoGuideModalWrapper, setIsOpen), [setIsOpen]);

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const config = VIDEO_GUIDE_CONFIG[videoType];
  const videoId = YOUTUBE_LINKS[videoType];

  const embedUrl = createYoutubeEmbedUrl(videoId);

  const handleClose = React.useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = "";
    }
    setIsOpen(false);
  }, [setIsOpen]);

  const handleIframeLoad = React.useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  }, []);

  return (
    <Modal>
      <div className="modal-body">
        <div className="header-actions">
          <div className="icon-wrap">
            <button onClick={handleClose}>
              <IconLink className="header-action-icon" />
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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
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
          <Button
            className="button"
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
            text={t(config.internalAction.textKey)}
            onClick={() => router.push(config.internalAction.route)}
            rightIcon={<IconRightArrow />}
          />
          <Button
            className="button"
            style={{ hierarchy: ButtonHierarchy.Primary, fullWidth: true }}
            text={"Close"}
            onClick={handleClose}
          />
        </div>
      </div>
    </Modal>
  );
};

export default VideoGuideModal;
