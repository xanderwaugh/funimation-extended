import * as React from "react";
import { VStack, Button, Heading, HStack } from "@chakra-ui/react";
import { formatTime } from "../lib/utils";

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
  return (
    <VStack mx="auto" textAlign={"center"}>
      <Button
        size="sm"
        p={1}
        colorScheme={"twitter"}
        onClick={btnEvent}
        isLoading={isLoading}
        shadow="md">
        {btn}
      </Button>
      <HStack>
        <Heading fontSize={"md"}>
          {timeTitle} <br />
          {timeValue ? formatTime(timeValue) : "00:00"}
        </Heading>
        <Button
          size="sm"
          p={1}
          colorScheme={"twitter"}
          shadow="md"
          onClick={() => {
            resetBTN();
          }}>
          Reset
        </Button>
      </HStack>
    </VStack>
  );
};

export { SkipStack };
