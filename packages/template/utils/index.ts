async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
function injectScript(tabId: number, filePath: string[]) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      { files: filePath, target: { tabId, allFrames: true } },
      (a) => {
        resolve(a);
      },
    );
  });
}
const log = (v: any) => {
  chrome.runtime.sendMessage(
    {
      from: 'debugger',
      log: v,
    },
    (response) => {
      console.log('debugger:::: --->', response);
    },
  );
};
const getAllStorageValue = async <T,>() => {
  return new Promise<T>((resolve, _reject) => {
    chrome.storage.sync.get((result: T) => {
      resolve(result)
    });
  })
}
export default {
  getCurrentTab,
  injectScript,
  log,
  getAllStorageValue
}