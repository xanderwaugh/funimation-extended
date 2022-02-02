import React from "react";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { BiMoon } from "react-icons/bi";
import { ImSun } from "react-icons/im";

const ColorModeSwitch: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton
      aria-label="Toggle Contrast"
      size="sm"
      colorScheme={"messenger"}
      icon={CMIcon(colorMode)}
      _hover={{ shadow: "md" }}
      onClick={toggleColorMode}
    />
  );
};

export { ColorModeSwitch };

const CMIcon = (colorMode: "light" | "dark") => {
  let ChosenIcon = BiMoon;
  if (colorMode === "light") {
    ChosenIcon = ImSun;
  }
  return <ChosenIcon size={18} />;
};
