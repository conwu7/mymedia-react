import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import MyMediaListsApp from './my-media-lists-app';
import reportWebVitals from './other/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <MyMediaListsApp />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
