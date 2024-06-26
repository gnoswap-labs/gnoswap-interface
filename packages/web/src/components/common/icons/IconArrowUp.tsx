const IconArrowUp = ({ className, fill, width, height }: { className?: string, fill?: string, width?: string, height?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width={width || "16"} height={height || "16"} viewBox="0 0 16 16" fill="none">
    <path d="M11.06 10.2733L8 7.21998L4.94 10.2733L4 9.33331L8 5.33332L12 9.33332L11.06 10.2733Z" fill={fill || "white"} />
  </svg>
);

export default IconArrowUp;