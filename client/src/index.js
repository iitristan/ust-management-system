import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AssetList from './assetlist';

ReactDOM.render(
  <React.StrictMode>
    <AssetList />  {/* Use the correct component name with an uppercase letter */}
  </React.StrictMode>,
  document.getElementById('root')
);
