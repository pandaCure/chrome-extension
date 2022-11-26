/* eslint-disable no-undef */
import { Button } from '@arco-design/web-react';
import React, { useLayoutEffect, useState } from 'react';
import { add } from 'lodash';
const getCurrentTab = async () => {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const App = () => {
  const [num, setNumber] = useState<number | undefined>();
  const [num1, setNumber1] = useState<number | undefined>();
  const handleSendBackgroundMessage = () => {
    chrome.runtime.sendMessage({ val1: 1, val2: 2, from: 'popup' }, (response) => {
      console.log('popup.js收到background.js信息 ---> 发起');
      setNumber(response.res);
    });
  };
  const handleSendContentMessage = async () => {
    const tab = await getCurrentTab();
    chrome.tabs.sendMessage(tab.id!, { from: 'popup', val1: 5, val2: 2 }, (response) => {
      console.log('popup.js收到content.js信息 ---> 发起');
      setNumber1(response.res);
    });
  };
  useLayoutEffect(() => {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      const { val1, val2, from } = request;
      if (from === 'background') {
        console.log('popup.js收到background.js信息 ---> 接受');
        return sendResponse({ res: add(val1, val2) });
      }
      if (from === 'content') {
        console.log('popup.js收到content.js信息 ---> 接受');
        return sendResponse({ res: add(val1, val2) });
      }
    });
  }, []);
  return (
    <div>
      <Button onClick={handleSendBackgroundMessage}>Background通信</Button>
      <Button onClick={handleSendContentMessage}>Content通信</Button>
      <div>
        计算1+2=<span>{num}</span>
      </div>
      <div>
        计算5+2=<span>{num1}</span>
      </div>
    </div>
  );
};
export default App;
