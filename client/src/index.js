import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AssetList from './pages/assetlist';
import Events from './components/events/eventslist';
import App from './App';
ReactDOM.render(
  <React.StrictMode>
    <AssetList />
    <Events/>
  </React.StrictMode>,
  document.getElementById('root')
);
