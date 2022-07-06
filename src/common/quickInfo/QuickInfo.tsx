const QuickInfo: React.FC = () => {
  return (
    <div className="container mx-auto mt-5 ">
      <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18">Quick Info</h3>
      <div className="grid grid-cols-4 info-data h-8.37 box-border bg-white  rounded-0.6 mt-1.868 app-input-card-border shadow-profileCard">
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">162.9k</div>
          <div className="mt-0.15 text-member font-semibold font-Poppins leading-4 text-success">New Members</div>
          <div className="mt-0.15 font-Poppins font-normal text-status leading-1.12 text-xs">10% Increase from Last Week</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">4.3k</div>
          <div className="mt-0.15 text-member font-semibold font-Poppins leading-4 text-primary">Active Members</div>
          <div className="mt-0.15 font-Poppins font-normal text-status leading-1.12 text-xs">12% Increse from Last Week</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">2.1k</div>
          <div className="mt-0.15 text-member font-semibold font-Poppins leading-4 text-warn">Inactive Members</div>
          <div className="mt-0.15 font-Poppins font-normal text-status leading-1.12 text-xs">3% Decrease from Last Week</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="leading-3.18 text-infoBlack font-Poppins text-signIn font-semibold">541</div>
          <div className="mt-0.15 text-member font-semibold font-Poppins leading-4 text-info">New Activities</div>
          <div className="mt-0.15 font-Poppins font-normal text-status leading-1.12 text-xs">16% Decrease from Last Week</div>
        </div>
      </div>
    </div>
  );
};

export default QuickInfo;