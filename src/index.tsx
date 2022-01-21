import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
    ChakraProvider,
    Heading,
    VStack,
    Divider,
    HStack,
    Switch,
    Text,
    Skeleton,
    Checkbox,
} from "@chakra-ui/react";
import {
    sendAction,
    sendActionCB,
    getIntroKey,
    setCStorage,
    getOutroKey,
    rmItemCStorage,
} from "./utils";
import { theme } from "./components/theme";
import { SkipStack } from "./components/SkipStack";
import { Wrapper } from "./components/Wrapper";
import { PlayerInfo } from "./components/PlayerInfo";

const App: React.FC = () => {
    // ! Has Page Loaded
    const [mount, setMount] = useState(false);
    // ! Enable / Disable Extension Controlling Funimation
    const [isEnabled, setEnabled] = useState(true);

    // Player Keys
    const [playerTime, setPlayerTime] = useState<number | undefined>();
    const [videoLength, setVideoLength] = useState<number | undefined>();
    const [showName, setShowName] = useState("");

    // Chrome Storage Keys
    const [introTime, setIntroTime] = useState<number | undefined>();
    const [outroTime, setOutroTime] = useState<number | undefined>();

    // additions
    const [maxQuality, setMaxQuality] = useState(false);

    // * Smooth Button Animations
    const [introBtnLoading, setIntroLoading] = useState(false);

    const [outroBtnLoading, setOutroLoading] = useState(false);

    // * Called on Inital Popup Load
    useEffect(() => {
        // ? Initial Things - Dont Need Timer
        // * IntroTime & OutroTime
        sendActionCB("getShowName", setShowName);
        sendActionCB("getIntroTime", setIntroTime);
        sendActionCB("getOutroTime", setOutroTime);
        sendActionCB("getVideoLength", setVideoLength);

        // ! Update Every Sec
        const interval = setInterval(() => {
            // ? Call Content Script for Player Time
            sendActionCB("getPlayerTime", setPlayerTime);
        }, 1000);
        return () => clearInterval(interval);
    }, [showName, playerTime, introTime, outroTime, videoLength]);

    useEffect(() => {
        setMount(true);
    }, []);

    if (!mount)
        return (
            <Wrapper>
                <Skeleton />
            </Wrapper>
        );

    return (
        <Wrapper>
            <VStack mx="auto" divider={<Divider borderColor="gray" />}>
                <VStack spacing={0} pt={".5rem"}>
                    <Heading lineHeight={"1"}>Funimation</Heading>
                    <Heading lineHeight={"1"}>Extended</Heading>
                </VStack>
                {/* HERO */}
                <HStack>
                    <Text textAlign={"center"} fontSize={"md"}>
                        Improve your watching experience!
                    </Text>
                    <VStack>
                        <Switch
                            defaultChecked={true}
                            size="lg"
                            colorScheme={"twitter"}
                            shadow={"md"}
                            onChange={() => {
                                setEnabled(!isEnabled);
                                sendAction(isEnabled ? "disable" : "enable");
                            }}
                        />
                        <Text fontSize={"1rem"}>
                            {isEnabled ? "Enabled" : "Disabled"}
                        </Text>
                    </VStack>
                </HStack>

                {/* // * Player Controls */}
                <PlayerInfo showname={showName} playerTime={playerTime} />

                {/* // * Intro Skipping */}
                <SkipStack
                    btn="Set Intro Skip"
                    timeTitle="Intro Time"
                    timeValue={introTime}
                    isLoading={introBtnLoading}
                    resetBTN={() => {
                        const waitkey = setTimeout(() => {
                            setIntroTime(0);
                            const introKey = getIntroKey(showName);
                            rmItemCStorage(introKey).then(() => {
                                console.log("Sucessfully cleared", introKey);
                            });
                        }, 1000);
                        return () => clearTimeout(waitkey);
                    }}
                    btnEvent={() => {
                        if (!playerTime) return;
                        setIntroLoading(true);
                        const waitkey = setTimeout(() => {
                            setIntroTime(playerTime);
                            const introKey = getIntroKey(showName);
                            setCStorage(introKey, playerTime);
                            setIntroLoading(false);
                        }, 1000);
                        return () => clearTimeout(waitkey);
                    }}
                />

                {/* Outro Skipping */}
                <SkipStack
                    btn="Set Outro Next ep."
                    timeTitle="Outro Time"
                    timeValue={outroTime}
                    isLoading={outroBtnLoading}
                    resetBTN={() => {
                        const waitkey = setTimeout(() => {
                            setOutroTime(undefined);
                            const outroKey = getOutroKey(showName);
                            rmItemCStorage(outroKey).then(() => {
                                console.log("Sucessfully cleared", outroKey);
                            });
                        }, 1000);
                        return () => clearTimeout(waitkey);
                    }}
                    btnEvent={() => {
                        setOutroLoading(true);
                        const waitkey = setTimeout(() => {
                            const outroKey = getOutroKey(showName);
                            setCStorage(outroKey, playerTime ?? 1920);
                            setOutroTime(playerTime);
                            setOutroLoading(false);
                        }, 1000);
                        return () => clearTimeout(waitkey);
                    }}
                />

                {/* Checkbox for 1080p */}
                <Checkbox
                    defaultChecked={maxQuality}
                    onChange={() => {
                        setMaxQuality(!maxQuality);
                        const waitkey = setTimeout(() => {
                            sendAction(
                                maxQuality
                                    ? "maxQuality-enable"
                                    : "maxQuality-disable"
                            );
                        }, 400);
                        return () => clearTimeout(waitkey);
                    }}
                >
                    Auto 1080p
                </Checkbox>
            </VStack>
        </Wrapper>
    );
};

ReactDOM.render(
    <ChakraProvider resetCSS theme={theme}>
        <App />
    </ChakraProvider>,
    document.getElementById("funnex-root-node")
);
