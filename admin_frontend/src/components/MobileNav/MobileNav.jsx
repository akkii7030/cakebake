import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdDesignServices, MdNotifications, MdAssignment } from 'react-icons/md';
import { BsFillPeopleFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FaPeopleCarry } from 'react-icons/fa';
import { MdDynamicFeed } from 'react-icons/md';
import { BiLogOut, BiMenu, BiX } from 'react-icons/bi';
import { IoStorefrontOutline } from 'react-icons/io5';
import './MobileNav.css';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { id: 1, path: '/admin/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { id: 2, path: '/admin/designtool', icon: MdDesignServices, label: 'Custom' },
    { id: 4, path: '/admin/orders', icon: MdAssignment, label: 'Orders' },
    { id: 5, path: '/admin/customers', icon: BsFillPeopleFill, label: 'Customers' },
    { id: 6, path: '/admin/staff', icon: FaPeopleCarry, label: 'Staff' },
    { id: 7, path: '/admin/products', icon: IoStorefrontOutline, label: 'Products' },
    { id: 8, path: '/admin/feedbacks', icon: MdDynamicFeed, label: 'Reviews' },
    { id: 9, path: '/admin/question', icon: MdNotifications, label: 'Messages' },
    { id: 10, path: '/admin/Profile', icon: CgProfile, label: 'Profile' }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMenu}>
        {isOpen ? <BiX /> : <BiMenu />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="mobile-nav-overlay" onClick={closeMenu}></div>}

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isOpen ? 'mobile-nav-open' : ''}`}>
        <div className="mobile-nav-header">
          <h3>Bake & Take Admin</h3>
          <button className="mobile-nav-close" onClick={closeMenu}>
            <BiX />
          </button>
        </div>
        
        <ul className="mobile-nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.id} className="mobile-nav-item">
                <Link 
                  to={item.path} 
                  className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <IconComponent className="mobile-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="mobile-nav-item">
            <Link to="/logout" className="mobile-nav-link logout" onClick={closeMenu}>
              <BiLogOut className="mobile-nav-icon" />
              <span>Log Out</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MobileNav;