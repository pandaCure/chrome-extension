const getAllStorageValue = async <T>() => {
  return new Promise<T>((resolve, _reject) => {
    chrome.storage.sync.get((result: T) => {
      resolve(result);
    });
  });
};
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ env: 'boe', lane: 'boe_prod' });
});
const setRules = (storageValue: any) => {
  chrome.declarativeNetRequest.getDynamicRules((rules) => {
    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: rules.map((v) => v.id) });
  });
  const { env, lane } = storageValue;
  const RULE: any = {
    id: 1998,
    condition: {
      resourceTypes: ['xmlhttprequest'],
      urlFilter: '*cont-constr*^api',
    },
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        { header: 'x-tt-env', operation: 'set', value: lane },
        { header: `x-use-${env}`, operation: 'set', value: `1` },
      ],
    },
    priority: 1,
  };
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [RULE],
  });
};
// chrome.tabs.onActivated.addListener(async () => {
// chrome.declarativeNetRequest.getDynamicRules((rules) => {
//   chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: rules.map((v) => v.id) });
// });
//   let storageValue = { env: 'boe', lane: 'boe_test' };
//   try {
//     storageValue = await getAllStorageValue<{ env: string; lane: string }>();
//   } catch (error) {
//     console.log(error);
//   }
//   setRules(storageValue)
// });

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log(11111);
  if (request.from === 'proxy') {
    setRules(request.params);
    return sendResponse({
      status: 'success',
    });
  }
  if (request.from === 'jump') {
    chrome.runtime.openOptionsPage();
    return sendResponse({ status: 'success' });
  }
});
