import Button from "@components/common/button/Button";
import IconStrokeArrowLeft from "@components/common/icons/IconStrokeArrowLeft";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { Overlay } from "@components/common/modal/Modal.styles";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { ThemeState } from "@states/index";
import { useAtomValue } from "jotai";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  BoxImage,
  LearnMoreModalBackground,
  LearnMoreModalWrapper,
  Progress,
  Slider,
  Title,
} from "./LearnMoreModal.styles";

interface Props {
  setIsShowLearnMoreModal: Dispatch<SetStateAction<boolean>>;
}

interface LearnMoreProps {
  title: string;
  description: JSX.Element;
  darkImageUrl: string;
  lightImageURL: string;
}

const LEARN_MORE_DATA: LearnMoreProps[] = [
  {
    title: "How to get xGNOS",
    description: (
      <>
        Stake liquidity from GNOT-GNS pools to earn xGNOS,
        <br />
        which represent your voting shares in the Gnoswap Governance.
      </>
    ),
    lightImageURL:
      "https://media.discordapp.net/attachments/1138037908482314292/1162098588118167803/image_55.png?ex=653ab3a6&is=65283ea6&hm=636cd11c78cc8c37cbddea2df74e27913b05c517a81f1222f749c315a88056aa",
    darkImageUrl:
      "https://media.discordapp.net/attachments/1138037908482314292/1162054336499695767/image_53.png?ex=653a8a6f&is=6528156f&hm=289336d87487c2c25490a4834333ea9663b3ed477d4ef818329bc03540a6fdfd",
  },
  {
    title: "Create a Proposal",
    description: (
      <>
        Submit a well-discussed and refined argument <br />
        in the forum as a formal proposal.
      </>
    ),
    lightImageURL:
      "https://media.discordapp.net/attachments/1138037908482314292/1162098588118167803/image_55.png?ex=653ab3a6&is=65283ea6&hm=636cd11c78cc8c37cbddea2df74e27913b05c517a81f1222f749c315a88056aa",
    darkImageUrl:
      "https://media.discordapp.net/attachments/1138037908482314292/1162054336499695767/image_53.png?ex=653a8a6f&is=6528156f&hm=289336d87487c2c25490a4834333ea9663b3ed477d4ef818329bc03540a6fdfd",
  },
  {
    title: "Cast Your Votes",
    description: (
      <>
        Enable community ownership by voting with xGNOS, <br />
        which represent your voting shares in the Gnoswap Governance.
      </>
    ),
    lightImageURL:
      "https://media.discordapp.net/attachments/1138037908482314292/1162098588118167803/image_55.png?ex=653ab3a6&is=65283ea6&hm=636cd11c78cc8c37cbddea2df74e27913b05c517a81f1222f749c315a88056aa",
    darkImageUrl:
      "https://media.discordapp.net/attachments/1138037908482314292/1162054336499695767/image_53.png?ex=653a8a6f&is=6528156f&hm=289336d87487c2c25490a4834333ea9663b3ed477d4ef818329bc03540a6fdfd",
  },
];

const LearnMoreModal: React.FC<Props> = ({ setIsShowLearnMoreModal }) => {
  const [index, setIndex] = useState(0);
  const themeKey = useAtomValue(ThemeState.themeKey);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (typeof window !== "undefined" && modalRef.current) {
      const height = modalRef.current.getBoundingClientRect().height;
      if (height >= window?.innerHeight) {
        modalRef.current.style.top = "0";
        modalRef.current.style.transform = "translateX(-50%)";
      } else {
        modalRef.current.style.top = "50%";
        modalRef.current.style.transform = "translate(-50%, -50%)";
      }
    }
  };

  useEscCloseModal(() => setIsShowLearnMoreModal(false));

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [modalRef]);

  return (
    <>
      <LearnMoreModalBackground>
        <LearnMoreModalWrapper ref={modalRef}>
          <Progress>
            {LEARN_MORE_DATA.map((_, i) => (
              <div
                key={i}
                className={`${index >= i ? "active-progress" : ""}`}
              ></div>
            ))}
          </Progress>
          <Slider>
            <Title onMouseDown={e => e.preventDefault()}>
              <h3>{LEARN_MORE_DATA[index].title}</h3>
              <div>{LEARN_MORE_DATA[index].description}</div>
            </Title>
            <BoxImage>
              <img
                onDragStart={e => e.preventDefault()}
                onMouseDown={e => e.preventDefault()}
                draggable="false"
                src={
                  themeKey === "dark"
                    ? LEARN_MORE_DATA[index].darkImageUrl
                    : LEARN_MORE_DATA[index].lightImageURL
                }
                alt="logo img"
              />
              <IconStrokeArrowRight
                onClick={() =>
                  setIndex(
                    index < LEARN_MORE_DATA.length - 1
                      ? index + 1
                      : LEARN_MORE_DATA.length - 1,
                  )
                }
                className={`slide-icon right-icon ${
                  index < LEARN_MORE_DATA.length - 1 ? "active-icon" : ""
                }`}
              />
              <IconStrokeArrowLeft
                onClick={() => setIndex(index > 0 ? index - 1 : 0)}
                className={`slide-icon left-icon ${
                  index > 0 ? "active-icon" : ""
                }`}
              />
            </BoxImage>
          </Slider>
          <Button
            text="Close"
            className="learn-more-btn"
            style={{
              fullWidth: true,
              fontType: "body7",
              textColor: "text01",
            }}
            onClick={() => setIsShowLearnMoreModal(false)}
          />
        </LearnMoreModalWrapper>
      </LearnMoreModalBackground>
      <Overlay onClick={() => setIsShowLearnMoreModal(false)}/>
    </>
  );
};

export default LearnMoreModal;
