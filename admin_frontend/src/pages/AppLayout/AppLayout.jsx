import "./AppLayout.css";
import { Toolbar, Header } from "../../adminExportFiles";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const AppLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div>
        <div className="AppLayout">
          <Toolbar 
            isMobileMenuOpen={isMobileMenuOpen} 
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <div className="layoutContent">
            <Header 
              isMobileMenuOpen={isMobileMenuOpen} 
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <div className="layoutContentMain">
              <Outlet />
            </div>
          </div>
        </div>
    </div>
  );
};

export default AppLayout;
