/* eslint-disable no-undef */
async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
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
  // Messages from content scripts should have sender.tab set
  if (request.from === 'create') {
    // console.log(request);
    const tab = await getCurrentTab();
    // console.log(tab);
    await injectScript(tab);
    sendResponse({
      status: 'success',
    });
    return true;
  } else if (request.from === 'devtools') {
    console.log(request);
    // const tab = await getCurrentTab()
    // console.log(tab)
    // await injectScript(tab)
    sendResponse({
      status: 'success',
    });
    return true;
  }
});
