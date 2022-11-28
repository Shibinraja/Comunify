
import Page404Icon from '../../assets/images/404Page.svg';

export const Route404PageError = () => (
  <div className="flex flex-col items-center justify-center fixTableHead-nomember">
    <div>
      <img src={Page404Icon} alt="" className="w-[26.9819rem] h-[21.8819rem]" />
    </div>
    <div className="price font-Poppins font-bold text-[2.812rem] leading-9 pt-[3.1569rem]">404</div>
    <div className="font-Poppins font-normal text-workSpace text-[1.2051rem] leading-7 pt-[0.3856rem]">No results found</div>
  </div>
);
