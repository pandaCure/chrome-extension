/* eslint-disable no-undef */
import React from 'react';
import {createRoot} from 'react-dom/client'
import "@arco-design/web-react/dist/css/arco.css";
import App from './src/components/app'
import './src/style/index.module.less'
const divDOM = document.createElement('div');
divDOM.setAttribute('id', 'content-dom')
divDOM.style.position = 'fixed';
divDOM.style.zIndex = '9999999'
divDOM.style.right = '20px';
divDOM.style.bottom = '20px';
divDOM.style.borderRadius = '100%';
divDOM.style.color = 'white';
divDOM.style.padding = '16px'
divDOM.textContent = '默认配置';
document.body.appendChild(divDOM);
const rootNode = document.getElementById('content-dom');
const root = createRoot(rootNode!);
root.render(<App />);