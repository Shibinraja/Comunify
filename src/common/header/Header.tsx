import React from 'react';
import comunifyLogo from '../../assets/images/logo-text.svg';

const Header: React.FC = () => (
  <nav className="container-lg pl-4 xl:pl-4.68  h-7.9 flex  sticky top-0 bg-white py-4 z-50">
    <div className="flex items-center">
      <div>
        <img src={comunifyLogo} alt="" className="" />
      </div>

    </div>
  </nav>
);

export default Header;
