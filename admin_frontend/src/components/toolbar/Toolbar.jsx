import React, { useState, useEffect } from "react";
import "./toolbar.css";
import logo from "../../images/logo.ico";
import { MdDashboard } from "react-icons/md";
import { MdDesignServices } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { MdAssignment } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaPeopleCarry } from "react-icons/fa";
import { MdDynamicFeed } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { IoStorefrontOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

// Create context for mobile menu
export const MobileMenuContext = React.createContext();


const Toolbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [currentLink, setCurrentLink] = useState(1);
  const location = useLocation();

  // Update active link based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) setCurrentLink(1);
    else if (path.includes('designtool')) setCurrentLink(2);
    else if (path.includes('orders')) setCurrentLink(4);
    else if (path.includes('customers')) setCurrentLink(5);
    else if (path.includes('staff')) setCurrentLink(6);
    else if (path.includes('products')) setCurrentLink(7);
    else if (path.includes('feedbacks')) setCurrentLink(8);
    else if (path.includes('question')) setCurrentLink(9);
    else if (path.includes('profile')) setCurrentLink(10);
  }, [location.pathname]);

  const menuItems = [
    { id: 1, path: '/admin/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { id: 2, path: '/admin/designtool', icon: MdDesignServices, label: 'Custom Orders' },
    { id: 4, path: '/admin/orders', icon: MdAssignment, label: 'Orders' },
    { id: 5, path: '/admin/customers', icon: BsFillPeopleFill, label: 'Customers' },
    { id: 6, path: '/admin/staff', icon: FaPeopleCarry, label: 'Staff' },
    { id: 7, path: '/admin/products', icon: IoStorefrontOutline, label: 'Products' },
    { id: 8, path: '/admin/feedbacks', icon: MdDynamicFeed, label: 'Reviews' },
    { id: 9, path: '/admin/question', icon: MdNotifications, label: 'Messages' },
    { id: 10, path: '/admin/Profile', icon: CgProfile, label: 'Profile' }
  ];

  const handleLinkClick = (id) => {
    setCurrentLink(id);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay active" 
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
        ></div>
      )}
      <div className={`bt-toolbar ${isMobileMenuOpen ? 'mobile-visible' : ''}`}>
        <div className="bt-toolbar-brand">
          <img src={logo} alt="Bake & Take Admin" />
        </div>
        <div className="links">
          <ul>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={currentLink === item.id ? "active" : ""}
                >
                  <Link to={item.path}>
                    <IconComponent /> 
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link to="/logout" onClick={() => handleLinkClick(0)}>
                <BiLogOut /> 
                <span>Log Out</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
