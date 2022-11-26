/* eslint-disable no-undef */
// 接受popup.js 通讯
const add = (...rest: number[]) => rest.reduce((a, b) => a + b, 0);
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const { val1, val2, from } = request;
  if (from === 'popup') {
    console.log('background.js收到popup.js信息');
    return sendResponse({ res: add(val1, val2) });
  }
  if (from === 'content') {
    console.log('background.js收到content.js信息');
    return sendResponse({ res: add(val1, val2) });
  }
});

chrome.tabs.onActivated.addListener(() => {
  chrome.runtime.sendMessage({ val1: 1, val2: 2 }, (response) => {
    console.log('background.js收到popup.js信息', response);
  });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id!, { from: 'background.js', val1: 1, val2: 2 }, (response) => {
      console.log('background -> content script infos have been sended', response);
    });
  });
});
