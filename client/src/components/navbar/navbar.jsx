import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faUsers, faChartLine, faCalendarAlt, faUserCog, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const NavItem = ({ to, text, icon }) => (
  <Link to={to} className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition duration-200">
    <FontAwesomeIcon icon={icon} className="mr-3 text-gray-500" />
    <span className="font-medium">{text}</span>
  </Link>
);

const MENU_LIST = [
  { text: "Home (Dashboard)", to: "/dashboard", icon: faHome },
  { text: "Asset Lists", to: "/assets", icon: faList },
  { text: "Supplier Lists", to: "/supplierlist", icon: faUsers },
  { text: "Finance Tracking", to: "/financetracking", icon: faChartLine },
  { text: "Events Management", to: "/events", icon: faCalendarAlt },
  { text: "User Management", to: "/users", icon: faUserCog },
];

const Sidebar = ({ user }) => {
  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col">
      <div className="flex items-center p-4 border-b border-gray-200">
        {/* Display user's picture and details */}
        <img src={user?.picture || "https://via.placeholder.com/50"} alt="Profile" className="w-12 h-12 rounded-full" />
        <div className="ml-3">
          <span className="block font-semibold text-gray-900">{user?.name || "ROLE"}</span>
          <span className="block text-sm text-gray-600">{user?.role || "Admin"}</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {MENU_LIST.map((menu) => (
          <NavItem key={menu.text} {...menu} />
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <NavItem to="/settings" text="Settings" icon={faCog} />
        <NavItem to="/" text="Sign Out" icon={faSignOutAlt} />
      </div>
    </div>
  );
};

export default Sidebar;
