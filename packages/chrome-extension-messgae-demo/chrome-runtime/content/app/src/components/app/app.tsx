/* eslint-disable no-undef */
import React, { useLayoutEffect } from 'react';
import { Button } from '@arco-design/web-react';
import { useState } from 'react';
import { add } from 'lodash';
const App = () => {
  const [num, setNumber] = useState<number | undefined>();
  const [num1, setNumber1] = useState<number | undefined>();
  const handleSendBackgroundMessage = () => {
    chrome.runtime.sendMessage({ val1: 1, val2: 2, from: 'content' }, (response) => {
      console.log('content.js收到background.js信息 ---> 发起');
      setNumber(response.res);
    });
  };
  const handleSendPopupMessage = () => {
    chrome.runtime.sendMessage({ val1: 5, val2: 3, from: 'content' }, (response) => {
      console.log('content.js收到popup.js信息 ---> 发起');
      setNumber1(response.res);
    });
  };
  useLayoutEffect(() => {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      const { val1, val2, from } = request;
      if (from === 'background') {
        console.log('content.js收到background.js信息 ---> 接受');
        return sendResponse({ res: add(val1, val2) });
      }
      if (from === 'popup') {
        console.log('content.js收到popup.js信息 ---> 接受');
        return sendResponse({ res: add(val1, val2) });
      }
    });
  }, []);
  return (
    <div className="flex flex-col">
      <Button onClick={handleSendBackgroundMessage}>Background通信</Button>
      <Button onClick={handleSendPopupMessage}>Popup通信</Button>
      <div className="text-fuchsia-700">
        计算1+2=<span>{num}</span>
      </div>
      <div className="text-yellow-600">
        计算3+5=<span>{num1}</span>
      </div>
    </div>
  );
};
export default App;
