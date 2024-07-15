export interface IconTriangleWarningOutlinedProps {
  width?: string;
  height?: string;
  stroke?: string;
}

export const IconTriangleWarningOutlined = ({
  width,
  height,
  stroke,
}: IconTriangleWarningOutlinedProps) => {
  return (
    <svg
      width={width || "16"}
      height={height || "16"}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.99992 12.0013C8.36811 12.0013 8.66659 11.7028 8.66659 11.3346C8.66659 10.9664 8.36811 10.668 7.99992 10.668C7.63173 10.668 7.33325 10.9664 7.33325 11.3346C7.33325 11.7028 7.63173 12.0013 7.99992 12.0013Z"
        fill={stroke || "#EA3943"}
      />
      <path
        d="M8 6.66797V9.33464"
        stroke={stroke || "#EA3943"}
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.29825 12.0681L6.8075 3.04955C7.2989 2.06681 8.7013 2.06682 9.1927 3.04955L13.702 12.0681C14.1452 12.9547 13.5006 13.9977 12.5094 13.9977H3.49082C2.49964 13.9977 1.85498 12.9547 2.29825 12.0681Z"
        stroke={stroke || "#EA3943"}
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
