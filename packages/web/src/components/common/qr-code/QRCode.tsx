import { QRCodeSVG } from "qrcode.react";
import { QRCodeContainer } from "./QRCode.styled";

type Props = {
  text: string;
  size: number;
  logo: string;
};

export const QRCodeGenerator = ({ text, size = 200, logo }: Props) => {
  return (
    <QRCodeContainer>
      <QRCodeSVG
        value={text}
        size={size}
        imageSettings={{
          src: logo,
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: false,
        }}
      />
    </QRCodeContainer>
  );
};
