/* eslint-disable no-undef */
import React, { useLayoutEffect, useState } from 'react';
import { Button } from '@arco-design/web-react';
const App = () => {
  const [num, setNum] = useState<undefined | number>();
  const handleSendMessage = () => {
    chrome.runtime.sendMessage(
      {
        from: 'devtools',
        val1: 1,
        val2: 2,
      },
      (response) => {
        console.log('Received response', response);
        setNum(response.value);
      },
    );
  };
  useLayoutEffect(() => {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      // Messages from content scripts should have sender.tab set
      if (request.from === 'content') {
        console.log('I am here!');
        sendResponse({
          value: request.val1 + request.val2,
        });
      }
    });
    // Create a connection to the background page
    let backgroundPageConnection = chrome.runtime.connect({
      name: 'panel',
    });

    backgroundPageConnection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  });
  return (
    <div>
      <h1>hello world devtools xxx</h1>
      <Button onClick={handleSendMessage}>Content消息</Button>
      <h1>{num}</h1>
    </div>
  );
};
export default App;
