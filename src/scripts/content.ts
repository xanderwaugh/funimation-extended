// ! Stuff here
import { getIntroKey, getOutroKey, setCStorage } from "../lib/utils";

interface msgObj {
  action: string;
  value?: number;
}

const getShowname = (): string => {
  if (window.location.href.includes("https://www.funimation.com/v/")) {
    return window.location.href.split("/v/")[1].split("/")[0];
  }
  return "";
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
  const playerDuration =
    document.querySelector("video")?.duration ?? _outro;
  let introTime = _intro ?? 0;
  let outroTime = playerDuration;
  let isEnabled = true;

  // Message Handler
  chrome.runtime.onMessage.addListener(
    (req: msgObj, _msgSender, send) => {
      switch (req.action) {
        case "getShowName": {
          send({
            value: getShowname(),
          });
          break;
        }
        case "getPlayerTime": {
          send({
            value: document.querySelector("video")?.currentTime,
          });
          break;
        }
        case "getIntroTime": {
          send({
            value: introTime,
          });
          break;
        }
        case "getOutroTime": {
          send({
            value: outroTime ?? 1920,
          });
          break;
        }
        case "getVideoLength": {
          send({
            value: document.querySelector("video")?.duration,
          });
          break;
        }
        case "disable": {
          console.log("Funex Disabled");
          isEnabled = false;
          break;
        }
        case "enable": {
          console.log("Funex Enabled");
          isEnabled = true;
          break;
        }
        case "maxQuality-enable": {
          console.log("1080p Enabled");
          document.getElementById("input-111")?.click();
          break;
        }
        case "maxQuality-disable": {
          console.log("1080p Disabled");
          break;
        }
      }
    }
  );

  console.log("Content Script Ready");

  // Listen for cstorage updates
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

  const pollingRate = 5000; // ms
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
        console.log("Skipping to Next Episode...");
        // Todo Show Next Episode Card
        const nextEP: HTMLElement = document.getElementsByClassName(
          "hydra-video-next"
        )[0] as HTMLElement;
        nextEP.click();
      }
    }
  }, pollingRate);
  return () => clearInterval(timer);
};
