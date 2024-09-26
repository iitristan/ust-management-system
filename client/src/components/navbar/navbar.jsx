import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faUsers, faChartLine, faCalendarAlt, faUserCog, faCog, faSignOutAlt, faClipboardList, faHistory, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

// Modal Component
const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Sign Out</h2>
        <p>Are you sure you want to sign out?</p>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="mr-4 text-gray-500">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">Confirm</button>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, text, icon, isActive, isExpanded }) => (
  <Link 
    to={to} 
    className={`flex items-center p-3 rounded-md transition duration-200 ${isActive ? 'text-yellow-500' : 'text-white'} hover:bg-[#303030]`}
  >
    <FontAwesomeIcon icon={icon} className="mr-3" />
    <span className={`font-medium transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} ${isExpanded ? '' : 'invisible'}`}>{text}</span>
  </Link>
);

const MENU_LIST = [
  { text: "Home (Dashboard)", to: "/dashboard", icon: faHome },
  { text: "Asset Lists", to: "/assets", icon: faList },
  { text: "Assets Request", to: "/assetsrequest", icon: faClipboardList },
  { text: "Supplier Lists", to: "/supplierlist", icon: faUsers },
  { text: "Finance Tracking", to: "/financetracking", icon: faChartLine },
  { text: "Events Management", to: "/events", icon: faCalendarAlt },
  { text: "User Management", to: "/users", icon: faUserCog },
];

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const handleLogoutClick = () => {
    setIsModalOpen(true); // Open modal when sign out is clicked
  };

  const handleConfirmLogout = () => {
    onLogout(); // Call the logout function
    setIsModalOpen(false); // Close modal
  };

  return (
    <>
      <div 
        className={`h-screen bg-[#202020] shadow-lg flex flex-col transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`} 
        onMouseEnter={() => setIsExpanded(true)} 
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center justify-center p-4">
          <img src='/logo.png' alt="Logo" className={`transition-all duration-300 ${isExpanded ? 'w-40' : 'w-0'} h-auto`} />
        </div>
        
        {/* Clickable div for user name and role */}
        <Link to="/profile" className="flex items-center p-4 border-b border-gray-700 hover:bg-[#303030] transition duration-200">
          <img src={user?.picture || "https://via.placeholder.com/50"} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
          <div className={`ml-3 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} ${isExpanded ? '' : 'invisible'}`}>
            {/* User name and role displayed as part of the clickable div */}
            <span className="block font-semibold text-[#FEC00F] uppercase whitespace-nowrap overflow-hidden overflow-ellipsis">{user?.name ?? "ROLE"}</span>
            <span className="block text-sm text-gray-400">{user?.role || "Admin"}</span>
          </div>
        </Link>

        <nav className="flex-1 p-4 space-y-2">
          {MENU_LIST.map((menu) => (
            <NavItem 
              key={menu.text} 
              {...menu} 
              isActive={location.pathname === menu.to} 
              isExpanded={isExpanded}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <NavItem to="/settings" text="Settings" icon={faCog} isExpanded={isExpanded} />
          <button onClick={handleLogoutClick} className="flex items-center p-3 text-white rounded-md hover:bg-[#303030] transition duration-200">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
            <span className={`font-medium transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'} ${isExpanded ? '' : 'invisible'}`}>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Modal for confirmation */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmLogout} 
      />
    </>
  );
};

export default Sidebar;