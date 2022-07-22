const MembersCard = () => {
    return (
        <div className="container mx-auto ">
        <div className="flex gap-2.28">
          <div className="flex  flex-col items-center justify-center bg-member1 rounded-0.9 w-full h-8.34 cursor-pointer">
            <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">
              162.9k
            </div>
            <div className="text-Poppins font-semibold text-infoBlack text-member leading-4">
              Total Members
            </div>
            <div className="text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">
              10% Increase from Last Week
            </div>
          </div>
          <div className=" flex-col items-center justify-center flex bg-member2 rounded-0.9 w-full h-8.34 cursor-pointer">
            <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">
              4.3k
            </div>
            <div className="text-Poppins font-semibold text-infoBlack text-member leading-4">
              New Members
            </div>
            <div className="text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">
              12% Increase from Last Week
            </div>
          </div>
          <div className=" flex-col items-center justify-center flex bg-member3 rounded-0.9 w-full h-8.34 cursor-pointer">
            <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">
              2.1k
            </div>
            <div className="text-Poppins font-semibold text-infoBlack text-member leading-4">
              Active Members
            </div>
            <div className="text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">
              3% Decrease from Last Week
            </div>
          </div>
          <div className=" flex-col items-center justify-center flex bg-member4 rounded-0.9 w-full h-8.34 cursor-pointer">
            <div className="text-infoBlack font-Poppins font-semibold text-signIn leading-3.18">
              541
            </div>
            <div className="text-Poppins font-semibold text-infoBlack text-member leading-4">
              Inactive Members
            </div>
            <div className="text-card font-Poppins font-normal leading-1.12 text-status mt-0.151">
              16% Decrease from Last Week
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default MembersCard;