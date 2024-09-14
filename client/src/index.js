import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AssetList from './pages/assetlist';
import Events from './pages/eventslist';
import SupplierList from './pages/supplierlist';
import Navbar from './components/navbar/navbar';
ReactDOM.render(
  <React.StrictMode>
    <AssetList />
    <Events/>
    <Navbar/>
    <SupplierList/>
  </React.StrictMode>,
  document.getElementById('root')
);
