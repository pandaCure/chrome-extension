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
    console.log('jianting')
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.from === 'devtools') {
        sendResponse({
          value: request.val1 + request.val2,
        });
      }
    });
  });
  return (
    <div className="flex flex-col bg-slate-500">
      <Button onClick={hanldeDevtoolsClick}>Devtools发消息</Button>
      <Button>{num}</Button>
    </div>
  );
};
export default App;
