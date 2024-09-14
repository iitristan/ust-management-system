import React from 'react';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faUsers, faChartLine, faCalendarAlt, faUserCog, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const NavItem = ({ href, text, icon }) => (
  <a href={href} className="sidebar__item">
    <FontAwesomeIcon icon={icon} className="sidebar__item-icon" />
    <span>{text}</span>
  </a>
);

const MENU_LIST = [
  { text: "Home (Dashboard)", href: "#", icon: faHome },
  { text: "Asset Lists", href: "#", icon: faList },
  { text: "Supplier Lists", href: "#", icon: faUsers },
  { text: "Finance Tracking", href: "#", icon: faChartLine },
  { text: "Events Management", href: "#", icon: faCalendarAlt },
  { text: "User Management", href: "#", icon: faUserCog },
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
        <NavItem href="#" text="Settings" icon={faCog} />
        <NavItem href="#" text="Sign Out" icon={faSignOutAlt} />
      </div>
    </div>
  );
};

export default Sidebar;
