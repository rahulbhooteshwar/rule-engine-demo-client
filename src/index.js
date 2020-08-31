import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "antd/dist/antd.css";
import './index.css';
import { ReactQueryDevtools } from 'react-query-devtools';

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ReactQueryDevtools initialIsOpen={false} />
      <App />
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);