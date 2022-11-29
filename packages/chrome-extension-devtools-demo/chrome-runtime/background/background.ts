/* eslint-disable no-undef */
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
function injectScript(tab: any) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      { files: ['./content-js/inject.js'], target: { tabId: tab.id!, allFrames: true } },
      (a) => {
        resolve(a);
      },
    );
  });
}
chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.from === 'devtools') {
    return sendResponse({
      status: 'success',
    });
  }
  if (request.from === 'create') {
    const tab = await getCurrentTab();
    await injectScript(tab);
    sendResponse({
      status: 'success',
    });
    return true;
  }
});
