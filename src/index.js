import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "antd/dist/antd.css";
import './index.css';

ReactDOM.render(
  // <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);