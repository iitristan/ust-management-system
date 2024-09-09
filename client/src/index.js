import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AssetList from './assetlist';
import Events from './components/events/eventslist';
ReactDOM.render(
  <React.StrictMode>
    <AssetList />  {/* Use the correct component name with an uppercase letter */}
    <Events/>
  </React.StrictMode>,
  document.getElementById('root')
);
