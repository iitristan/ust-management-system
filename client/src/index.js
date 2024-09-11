import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AssetList from './pages/assetlist';
import Events from './components/events/eventslist';
import SupplierList from './pages/supplierlist';
ReactDOM.render(
  <React.StrictMode>
    <AssetList />
    <Events/>
    <SupplierList/>
  </React.StrictMode>,
  document.getElementById('root')
);
