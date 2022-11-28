/* eslint-disable no-undef */
import React, { useLayoutEffect, useState } from 'react';
import { Button } from '@arco-design/web-react';
const App = () => {
  const [num, setNum] = useState<undefined | number>();
  const hanldeDevtoolsClick = () => {
    chrome.runtime.sendMessage(
      {
        from: 'content',
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
      console.log(`############`)
      // Messages from content scripts should have sender.tab set
      if (request.from === 'devtools') {
        console.log('I am here!');
        sendResponse({
          value: request.val1 + request.val2,
        });
      }
    });
  });
  return (
    <div className="flex flex-col">
      <Button onClick={hanldeDevtoolsClick}>Devtools发消息</Button>
      <div>{num}</div>
    </div>
  );
};
export default App;
