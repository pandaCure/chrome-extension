/* eslint-disable no-undef */
import React, { useLayoutEffect, useState } from 'react';
import { Button } from '@arco-design/web-react';
const log = (v: any) => {
  chrome.runtime.sendMessage(
    {
      from: 'devtools',
      log: v,
    },
    (response) => {
      console.log('Received response', response);
    },
  );
};
const App = () => {
  const [num, setNum] = useState<undefined | number>();
  const [num1, setNum1] = useState<any>([]);
  const handleSendMessage = () => {
    log('send info')
    chrome.devtools.inspectedWindow.eval("window.alert(1)", () => {})
    chrome.runtime.sendMessage(
      {
        from: 'devtools',
        val1: 1,
        val2: 2,
      },
      (response) => {
        log('Received response' + response);
        setNum(response.value);
      },
    );
  };
  const handleSendMessage1 = () => {
    chrome.devtools.inspectedWindow.eval('window.initData()', (result: any, isException) => {
      if (isException) {
        log(isException);
        setNum1(JSON.stringify(isException));
      } else {
        setNum1(
          Object.keys(result.map).map((v) => {
            return { tagName: result.map[v].tagName, id: v };
          }),
        );
      }
    });
  };
  useLayoutEffect(() => {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.from === 'content') {
        sendResponse({
          value: request.val1 + request.val2,
        });
      }
    });
    // // Create a connection to the background page
    // let backgroundPageConnection = chrome.runtime.connect({
    //   name: 'panel',
    // });

    // backgroundPageConnection.postMessage({
    //   name: 'init',
    //   tabId: chrome.devtools.inspectedWindow.tabId,
    // });
  });
  const handleClick = (v: any) => {
    chrome.devtools.inspectedWindow.eval(`inspect(window.getElement(${v.id}))`, (result: any, isException) => {
      if (isException) {
        log(isException);
        // setNum1(JSON.stringify(isException));
      } else {
        log(result);
      }
    });
  };
  useLayoutEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener((request) => {
      log(request);
      if (request.request.url.includes('baidu.com')) {
      chrome.devtools.inspectedWindow.eval(
        // 'console.log("Large image: " + unescape("' + escape(request.request.url) + '"))',÷
        'console.log("' + JSON.stringify(request) + '"))',
      );
      }
    });
  }, []);
  return (
    <div>
      <h1>hello world devtools xxx</h1>
      <Button onClick={handleSendMessage}>Content消息</Button>
      <Button onClick={handleSendMessage1}>Content消息1</Button>
      <h1>{num}</h1>
      <ul>
        {num1.map((v: any, index: number) => {
          return (
            <li key={index} onClick={() => handleClick(v)}>
              {v.tagName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default App;
