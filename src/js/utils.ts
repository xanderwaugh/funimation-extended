import React from "react";

// * Send Action to content script w/ Response
export const tabQueryOpts: chrome.tabs.QueryInfo = {
  active: true,
  currentWindow: true,
};

export const sendActionCB = (
  action: string,
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  callbackfn: React.Dispatch<React.SetStateAction<any>>
) => {
  chrome.tabs.query(tabQueryOpts).then((tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: action },
        (response) => {
          if (response && response.value) {
            callbackfn(response.value);
          }
        }
      );
    }
  });
};

// This is broekn
export function sendAction(action: string) {
  chrome.tabs.query(tabQueryOpts).then((tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: action });
    }
  });
}

export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time - minutes * 60);
  if (seconds === 60) {
    return `${minutes + 1}:00`;
  } else if (seconds.toString().length === 1) {
    return `${minutes}:0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

export function getIntroKey(showname: string): string {
  return `${showname}-intro`;
}
export function getOutroKey(showname: string): string {
  return `${showname}-outro`;
}

export const getCStorage = (key: string) =>
  chrome.storage.sync.get([key]).then((value) => value);

export const setCStorage = (key: string, value: number) =>
  chrome.storage.sync
    .set({
      [key]: value,
    })
    .then((value) => value);

export const rmItemCStorage = (key: string) =>
  chrome.storage.sync.remove(key);

export const nextEPQ =
  "#vjs_video_3 > div.vjs-control-bar > div > div.video-player-controls__aux-controls > div.d-flex.align-center.justify-center.next-panel > a";

export function getShowname() {
  if (window.location.href.includes("https://www.funimation.com/v/")) {
    return window.location.href.split("/v/")[1].split("/")[0];
  }
  return "";
}
