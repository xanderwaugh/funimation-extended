import React, { useState, useEffect } from "react";
import {
  setCStorage,
  sendActionCB,
  getIntroKey,
  getOutroKey,
  tabQueryOpts,
} from "../js/utils";
import {
  VStack,
  Divider,
  Heading,
  HStack,
  Switch,
  Checkbox,
  Text,
  useColorMode,
  ColorMode,
} from "@chakra-ui/react";
import {
  PlayerInfo,
  SkipStack,
  Wrapper,
  ColorModeSwitch,
  TitleCard,
  CustomDivider,
} from "../components";

const Popup: React.FC = () => {
  // * Main States
  const [mount, setMount] = useState(false);
  const [CSState, setCSState] = useState(false);
  const [isEnabled, setEnabled] = useState(true);
  // * Video Player Data
  const [showName, setShowName] = useState("");
  const [playerTime, setPlayerTime] = useState<number | undefined>();
  const [videoLength, setVideoLength] = useState<number | undefined>();
  // * Chrome Storage
  const [introTime, setIntroTime] = useState<number | undefined>();
  const [outroTime, setOutroTime] = useState<number | undefined>();
  const [maxQuality, setMaxQuality] = useState(false);
  // * UI / UX
  const [introAnim, setIntroAnim] = useState(false);
  const [outroAnim, setOutroAnim] = useState(false);
  const { colorMode } = useColorMode();

  // * Logic
  useEffect(() => {
    if (!CSState) return;

    // * Calls to Content Script
    sendActionCB("getShowName", setShowName);
    sendActionCB("getIntroTime", setIntroTime);
    sendActionCB("getOutroTime", setOutroTime);
    sendActionCB("getVideoLength", setVideoLength);

    // ! Poll Every Sec
    const interval = setInterval(() => {
      sendActionCB("getPlayerTime", setPlayerTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [showName, playerTime, introTime, outroTime, videoLength, CSState]);

  // * Initial Things
  useEffect(() => {
    // * Check if on funimation
    sendActionCB("isOnFunimation", setCSState);

    chrome.storage.sync.get(["maxQuality"]).then((value) => {
      setMaxQuality(value["maxQuality"] ?? false);
    });

    setMount(true);
  }, []);

  if (!mount || !CSState)
    return (
      <Wrapper>
        <TemplatePopup colorMode={colorMode} />
      </Wrapper>
    );

  return (
    <Wrapper>
      <VStack
        mx="auto"
        spacing={12}
        divider={<CustomDivider colorMode={colorMode} />}
      >
        {/* //* HERO */}
        <TitleCard />
        <HStack>
          <Text textAlign={"center"} fontSize={"md"}>
            Improve your watching experience!
          </Text>
          <VStack>
            <Switch
              defaultChecked={true}
              size="lg"
              colorScheme={"twitter"}
              // shadow={"md"}
              onChange={() => {
                setEnabled(!isEnabled);
                chrome.tabs.query(tabQueryOpts).then((tabs) => {
                  if (tabs[0].id)
                    chrome.tabs.sendMessage(tabs[0].id, {
                      action: isEnabled ? "disable" : "enable",
                    });
                });
              }}
            />
            <Text fontSize={"1rem"}>
              {isEnabled ? "Enabled" : "Disabled"}
            </Text>
          </VStack>
        </HStack>

        {/* //* Player Info */}
        <PlayerInfo showname={showName} playerTime={playerTime} />

        {/* //* Skip Intro */}
        <SkipStack
          btn="Set Intro Time"
          timeTitle="Intro Time @:"
          timeValue={introTime}
          isLoading={introAnim}
          resetBTN={() => {
            const waitkey = setTimeout(() => {
              setIntroTime(0);
              chrome.storage.sync.remove(getIntroKey(showName));
            }, 1000);
            return () => clearTimeout(waitkey);
          }}
          btnEvent={() => {
            if (!playerTime) return;
            setIntroAnim(true);
            const waitkey = setTimeout(() => {
              setIntroTime(playerTime);
              const introKey = getIntroKey(showName);
              setCStorage(introKey, playerTime);
              setIntroAnim(false);
            }, 1000);
            return () => clearTimeout(waitkey);
          }}
        />

        {/* //* Skip Outro */}
        <SkipStack
          btn="Set Outro Time"
          timeTitle="Outro Time @:"
          timeValue={outroTime}
          isLoading={outroAnim}
          resetBTN={() => {
            const waitkey = setTimeout(() => {
              chrome.storage.sync.remove(getOutroKey(showName));
            }, 1000);
            return () => clearTimeout(waitkey);
          }}
          btnEvent={() => {
            setOutroAnim(true);
            const waitkey = setTimeout(() => {
              const outroKey = getOutroKey(showName);
              setCStorage(outroKey, playerTime ?? 1920);
              setOutroTime(playerTime);
              setOutroAnim(false);
            }, 1000);
            return () => clearTimeout(waitkey);
          }}
        />

        {/* //* Max Quality */}
        <Checkbox
          defaultChecked={maxQuality}
          onChange={(e) => {
            e.preventDefault();
            setMaxQuality(e.target.checked);
            chrome.tabs.query(tabQueryOpts).then((tabs) => {
              if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: e.target.checked
                    ? "maxQuality-enable"
                    : "maxQuality-disable",
                });
              }
            });
          }}
        >
          Auto 1080p
        </Checkbox>
      </VStack>
    </Wrapper>
  );
};
export { Popup };

interface TemplateProps {
  colorMode: ColorMode;
}
const TemplatePopup: React.FC<TemplateProps> = ({ colorMode }) => {
  return (
    <Wrapper>
      <VStack
        mx="auto"
        divider={
          <Divider
            borderColor={colorMode === "light" ? "gray" : "white"}
          />
        }
      >
        <HStack>
          <VStack spacing={0} pt={".5rem"}>
            <Heading lineHeight={"1"}>Funimation</Heading>
            <Heading lineHeight={"1"}>Extended</Heading>
          </VStack>
          <ColorModeSwitch />
        </HStack>
        {/* HERO */}
        <HStack>
          <Text textAlign={"center"} fontSize={"md"}>
            You must be watching on funimation to use this extension!
          </Text>
        </HStack>
      </VStack>
    </Wrapper>
  );
};
