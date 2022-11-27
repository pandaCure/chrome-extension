/* eslint-disable no-undef */
// const getStorageValue = async <T,>(key?: string) => {
//   return new Promise<T>((resolve, reject) => {
//     chrome.storage.sync.get((result: T) => {
//       resolve(result)
//     });
//   })
// }
// chrome.runtime.onInstalled.addListener(async () => {
//   chrome.declarativeNetRequest.getDynamicRules(rules => {
//     chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: rules.map(v => v.id)})
//   })
//   const storageValue = await getStorageValue<{env: string, lane: string}>()
//   console.log(storageValue)
//   const {env, lane} = storageValue
//   const RULE: any = {
//     id: Number(String(Math.random()).split('.')[1].slice(0, 4)),
//     condition: {
//       resourceTypes: ['xmlhttprequest'],
//       urlFilter: 'cont-constr*^api',
//     },
//     action: {
//       type: 'modifyHeaders',
//       requestHeaders: [
//         {header: 'x-tt-env', operation: 'set', value: lane},
//         {header: `x-use-${env}`, operation: 'set', value: `1`},
//       ],
//     },
//     priority: 1
//   };
//   chrome.declarativeNetRequest.updateDynamicRules({
//     addRules: [RULE],
//   });
//   chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((a) => {
//     console.log(a)
//   })
//   chrome.runtime.onMessage.addListener((req,sender, sendResponse) => {
//     sendResponse('我收到了你的来信')
//     console.log('接收了来自 content.js的消息', req.info)
//     chrome.runtime.openOptionsPage();
// })
// //   chrome.webRequest.onBeforeSendHeaders.addListener(
// //     (defaultHeaders) => {
// //       console.log(defaultHeaders)
// //       defaultHeaders.requestHeaders.push({ name: `x-tt-env`, value: 'boe_open_new_lishiwei' })
// //       defaultHeaders.requestHeaders.push({ name: `x-use-boe`, value: `1` })
// //       console.log(defaultHeaders.requestHeaders)
// //       return {
// //         requestHeaders: defaultHeaders.requestHeaders
// //       }
// //     },
// //     { urls: ['<all_urls>'] },
// //     ['blocking', 'requestHeaders']
// //   )
// });