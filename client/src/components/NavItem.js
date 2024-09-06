import { useMemo } from "react";
import PropTypes from "prop-types";

const NavItem = ({
  className = "",
  dashboard,
  arrowRight2,
  propDisplay,
  propMinWidth,
}) => {
  const dashboardStyle = useMemo(() => {
    return {
      display: propDisplay,
      minWidth: propMinWidth,
    };
  }, [propDisplay, propMinWidth]);

  return (
    <div
      className={`self-stretch rounded-[3.66px] bg-[#fff] flex flex-row items-center justify-start py-[0px] px-[7px] text-left text-[16px] text-[#4b4b4b] font-[Poppins] ${className}`}
    >
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-row items-center justify-center py-[7.3px] px-[7px]">
          <input
            className="m-[0px] h-[29.3px] w-[29.3px] relative overflow-hidden shrink-0"
            type="checkbox"
          />
        </div>
        <div className="flex flex-row items-center justify-center pt-[7.4px] px-[7px] pb-[7.2px]">
          <div
            className="relative tracking-[0.01em] leading-[22px]"
            style={dashboardStyle}
          >
            {dashboard}
          </div>
        </div>
      </div>
      <div className="hidden flex-row items-start justify-start text-[11.9px] text-[#0c7fda]">
        <div className="flex flex-row items-start justify-start">
          <div className="h-[22px] w-[22px] relative rounded-[3.66px] bg-[#fff] overflow-hidden shrink-0">
            <div className="absolute top-[-1.8px] left-[8.2px] leading-[26.53px]">
              1
            </div>
          </div>
        </div>
        <div className="flex flex-row items-start justify-start">
          <img
            className="h-[22px] w-[22px] relative overflow-hidden shrink-0 object-contain"
            alt=""
            src={arrowRight2}
          />
        </div>
      </div>
    </div>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  dashboard: PropTypes.string,
  arrowRight2: PropTypes.string,

  /** Style props */
  propDisplay: PropTypes.any,
  propMinWidth: PropTypes.any,
};

export default NavItem;
