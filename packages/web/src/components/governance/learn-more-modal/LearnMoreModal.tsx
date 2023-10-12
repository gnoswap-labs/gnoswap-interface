import Button from "@components/common/button/Button";
import IconStrokeArrowLeft from "@components/common/icons/IconStrokeArrowLeft";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
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
        Stake liquidity from GNOT-GNOS pools to earn xGNOS,
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

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (modalRef.current && modalRef.current.contains(e.target as Node)) {
        return;
      } else {
        e.stopPropagation();
        setIsShowLearnMoreModal(false);
      }
    };
    window.addEventListener("click", closeModal, true);
    return () => {
      window.removeEventListener("click", closeModal, true);
    };
  }, [modalRef, setIsShowLearnMoreModal]);
  return (
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
          <Title>
            <h3>{LEARN_MORE_DATA[index].title}</h3>
            <div>{LEARN_MORE_DATA[index].description}</div>
          </Title>
          <BoxImage>
            <img
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
          style={{
            fullWidth: true,
            height: 57,
            bgColor: "background12",
          }}
          onClick={() => setIsShowLearnMoreModal(false)}
        />
      </LearnMoreModalWrapper>
    </LearnMoreModalBackground>
  );
};

export default LearnMoreModal;
