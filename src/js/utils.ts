import React from "react";

export interface msgObj {
  action: string;
  value?: number;
}

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
          if (response.value) {
            callbackfn(response.value);
          }
        }
      );
    }
  });
};

// This is broekn
export const sendAction = (action: string) => {
  chrome.tabs.query(tabQueryOpts).then((tabs) => {
    if (tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: action });
    }
  });
};

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time - minutes * 60);
  if (seconds === 60) {
    return `${minutes + 1}:00`;
  } else if (seconds.toString().length === 1) {
    return `${minutes}:0${seconds}`;
  }

  return `${minutes}:${seconds}`;
};

export const getIntroKey = (showname: string): string => {
  return `${showname}-intro`;
};
export const getOutroKey = (showname: string): string => {
  return `${showname}-outro`;
};

export const getCStorage = (key: string) =>
  chrome.storage.sync
    .get([key])
    .then((value) => value)
    .catch(() => console.log(`err fetch ${key}`));

export const setCStorage = (key: string, value: number) =>
  chrome.storage.sync
    .set({
      [key]: value,
    })
    .then((value) => value)
    .catch(() => console.error(`err ${key}:${value}`));

export const rmItemCStorage = (key: string) =>
  chrome.storage.sync
    .remove(key)
    .catch(() => console.error(`err clearing ${key}`));
