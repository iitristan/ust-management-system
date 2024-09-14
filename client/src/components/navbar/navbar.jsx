import React from 'react';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faUsers, faChartLine, faCalendarAlt, faUserCog, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const NavItem = ({ to, text, icon }) => (
  <Link to={to} className="sidebar__item">
    <FontAwesomeIcon icon={icon} className="sidebar__item-icon" />
    <span>{text}</span>
  </Link>
);

const MENU_LIST = [
  { text: "Home (Dashboard)", to: "/dashboard", icon: faHome },
  { text: "Asset Lists", to: "/assets", icon: faList },
  { text: "Supplier Lists", to: "/supplierlist", icon: faUsers },
  { text: "Finance Tracking", to: "/financetracking", icon: faChartLine },
  { text: "Events Management", to: "/events", icon: faCalendarAlt },
  { text: "User Management", to: "/usermanagement", icon: faUserCog },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar__profile">
        <img src="https://via.placeholder.com/50" alt="Profile" className="sidebar__profile-image" />
        <div className="sidebar__profile-info">
          <span className="sidebar__profile-name">Super Admin</span>
          <span className="sidebar__profile-role">Admin</span>
        </div>
      </div>
      <nav className="sidebar__menu">
        {MENU_LIST.map((menu) => (
          <NavItem
            key={menu.text}
            {...menu}
          />
        ))}
      </nav>
      <div className="sidebar__footer">
        <NavItem to="/settings" text="Settings" icon={faCog} />
        <NavItem to="/signout" text="Sign Out" icon={faSignOutAlt} />
      </div>
    </div>
  );
};

export default Sidebar;
