/* eslint-disable no-undef */
function create() {
  let a = document.createElement('script');
  a.src = chrome.runtime.getURL('content-js/hook.js');
  document.body.append(a);
}

console.log(1111, '-> ', create());
