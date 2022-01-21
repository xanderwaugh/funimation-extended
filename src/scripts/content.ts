// ! Stuff here
import { getIntroKey, getOutroKey, setCStorage } from "../utils";

interface msgObj {
    action: string;
    value?: number;
}

const getShowname = (): string => {
    if (window.location.href.includes("https://www.funimation.com/v/")) {
        return window.location.href.split("/v/")[1].split("/")[0];
    } else {
        return "";
    }
};

window.addEventListener("load", () => {
    const showname = getShowname();
    const introKey = getIntroKey(showname);
    const outroKey = getOutroKey(showname);

    chrome.storage.sync.get([introKey, outroKey]).then((value) => {
        if (!value[introKey]) {
            setCStorage(introKey, 0);
        }
        if (!value[outroKey]) {
            const vid_duration = document.querySelector("video")?.duration;
            // Set Default Video Duration
            if (vid_duration) setCStorage(outroKey, vid_duration);
        }
        const introtime = value[introKey];
        const outrotime = value[outroKey];
        if (!chrome.runtime.onMessage) {
            setTimeout(() => {
                main(introtime, outrotime);
            }, 2000);
        } else {
            main(introtime, outrotime);
        }
    });
});

// * Document Done Loading
const main = (_intro?: number, _outro?: number) => {
    const playerDuration = document.querySelector("video")?.duration ?? _outro;
    let introTime = _intro ?? 0;
    let outroTime = playerDuration;
    let isEnabled = true;

    let maxQuality = false;

    // Message Handler
    chrome.runtime.onMessage.addListener(
        (request: msgObj, sender, sendResponse) => {
            if (request.action === "getShowName") {
                sendResponse({
                    value: getShowname(),
                });
            } else if (request.action === "getPlayerTime") {
                const playerTime = document.querySelector("video")?.currentTime;
                sendResponse({
                    value: playerTime,
                });
            } else if (request.action === "getIntroTime") {
                sendResponse({
                    value: introTime,
                });
            } else if (request.action === "getOutroTime") {
                sendResponse({
                    value: outroTime ?? 1920,
                });
            } else if (request.action === "getVideoLength") {
                const vidDuration = document.querySelector("video")?.duration;
                sendResponse({
                    value: vidDuration,
                });
            } else if (request.action === "disable") {
                console.log("Funex Disabled");
                isEnabled = false;
            } else if (request.action === "enable") {
                console.log("Funex Enabled");
                isEnabled = true;
            } else if (request.action === "maxQuality-enable") {
                console.log("1080p Enabled");
                maxQuality = true;
            } else if (request.action === "maxQuality-disable") {
                console.log("1080p Disabled");
                maxQuality = false;
            }
        }
    );

    console.log("Content Script Ready");

    chrome.storage.onChanged.addListener((changes) => {
        for (const [key, { newValue }] of Object.entries(changes)) {
            const showname = getShowname();
            if (key === getIntroKey(showname)) {
                introTime = newValue;
            } else if (key === getOutroKey(showname)) {
                outroTime = newValue;
            }
        }
    });

    // Iterate every second
    const timer = setInterval(() => {
        if (!isEnabled) {
            return;
        }

        const playerTime = document.querySelector("video")?.currentTime;
        if (introTime && playerTime) {
            // ! Check if player is before intro time
            if (playerTime < introTime) {
                // Todo SKIP or Add Skip Intro Button
                console.log("Skipping Intro...");
                // eslint-disable-next-line prefer-const
                let video = document.querySelector("video");
                if (video) video.currentTime = introTime;
            }
            // ! Check if player is after Outro Time
            if (outroTime && playerTime > outroTime) {
                // console.log("Skipping to Next Episode...");
                // Todo Show Next Episode Card
                const nextEP: HTMLElement = document.getElementsByClassName(
                    "hydra-video-next"
                )[0] as HTMLElement;
                nextEP.click();
            }
            // ! Check if MaxQuality
            if (maxQuality) {
                document.getElementById("input-111")?.click();
            }
        }
    }, 5000);
    return () => clearInterval(timer);
};
