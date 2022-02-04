import React from "react";
import { ColorModeSwitch } from "./ColorModeSwitch";
import { HStack, VStack, Heading } from "@chakra-ui/react";

const TitleCard: React.FC = () => {
  return (
    <HStack>
      <VStack spacing={0} pt={".5rem"}>
        <Heading lineHeight={"1"}>Funimation</Heading>
        <Heading lineHeight={"1"}>Extended</Heading>
      </VStack>
      <ColorModeSwitch />
    </HStack>
  );
};

export { TitleCard };
