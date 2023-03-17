import Header from "@components/common/header/Header";
import { useRouter } from "next/router";
import React, { useState } from "react";

const HeaderContainer: React.FC = () => {
  const { pathname } = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  return <Header pathname={pathname} isConnected={isConnected} />;
};

export default HeaderContainer;
