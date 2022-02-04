import * as React from "react";
import {
  VStack,
  Button,
  Heading,
  HStack,
  useColorMode,
} from "@chakra-ui/react";
import { formatTime } from "../js/utils";

interface CompProps {
  btn: string;
  timeTitle: string;
  timeValue: number | undefined;
  isLoading: boolean;
  btnEvent: React.MouseEventHandler<HTMLButtonElement>;
  resetBTN(): void;
}

const SkipStack: React.FC<CompProps> = ({
  btn,
  timeTitle,
  timeValue,
  isLoading,
  btnEvent,
  resetBTN,
}) => {
  const { colorMode } = useColorMode();
  return (
    <VStack mx="auto" textAlign={"center"}>
      <HStack
        rounded="md"
        p={"2px"}
        bg={colorMode === "light" ? "gray.400" : "gray"}
        spacing={4}
      >
        <Button
          size="sm"
          p={1}
          colorScheme={"twitter"}
          onClick={btnEvent}
          isLoading={isLoading}
          shadow="md"
        >
          {btn}
        </Button>
        <Button
          size="sm"
          p={1}
          colorScheme={"twitter"}
          shadow="md"
          onClick={() => {
            resetBTN();
          }}
        >
          Reset
        </Button>
      </HStack>
      <Heading fontSize={"md"}>
        {timeTitle} <br />
        {timeValue ? formatTime(timeValue) : "00:00"}
      </Heading>
    </VStack>
  );
};

export { SkipStack };
