/* eslint-disable no-undef */
import React from 'react';
import { Button, Modal } from '@arco-design/web-react';
import { useState } from 'react';
const App = () => {
  const hanldeGlobalClick = () => {
    console.log(chrome);
    chrome.runtime.sendMessage(
      {
        info: '我是 content.js',
      },
      (res) => {
        alert(res);
      },
    );
  };
  const [visible, setVisible] = useState(false)
  return (
    <div className='flex flex-col'>
      <Button onClick={() => setVisible(true)}>配置泳道</Button>
      <Button onClick={hanldeGlobalClick}>全局配置</Button>
      <Modal title='配置泳道' visible={visible}>
        <ul>112</ul>
      </Modal>
    </div>
  );
};
export default App;
