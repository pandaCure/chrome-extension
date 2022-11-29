import React from 'react';
import {createRoot} from 'react-dom/client'
import App from '@theme-components/app'
import "@arco-design/web-react/dist/css/arco.css";
import './style'
const rootNode = document.getElementById('root');
const root = createRoot(rootNode!);
root.render(<App />);