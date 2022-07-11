import comunifyLogo from '../../assets/images/Group 2 (1).svg';

const Header: React.FC = () => {
  return (
    <nav className="container-lg ml-4.68 mx-auto h-7.9 flex  sticky top-0 bg-white py-4 z-50">
      <div className="flex items-center">
        <div>
          <img src={comunifyLogo} alt="" />
        </div>
        <div className="pl-14">
          <h1 className="font-Outfit text-logo font-bold leading-1.6 text-lightBlack">
            COMUNIFY
          </h1>
        </div>
      </div>
    </nav>
  );
};

export default Header;
