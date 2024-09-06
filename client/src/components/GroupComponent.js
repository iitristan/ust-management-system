import PropTypes from "prop-types";

const GroupComponent = ({ className = "" }) => {
  return (
    <div
      className={`mt-[-235px] self-stretch bg-[#f7cc5f] flex flex-col items-end justify-start pt-[30px] px-[79px] pb-[17px] gap-[78px] shrink-0 z-[1] text-center text-[4px] text-[#000] font-[Inter] mq450:gap-[39px] mq450:pl-[20px] mq450:pr-[20px] mq450:box-border ${className}`}
    >
      <div className="w-[18.8px] h-[18px] relative hidden" />
      <div className="w-[314px] h-[192px] relative bg-[#f7cc5f] hidden" />
      <div className="w-[76px] flex flex-row items-start justify-end py-[0px] px-[7px] box-border">
        <div className="h-[31px] flex-1 relative">
          <div className="absolute top-[0px] left-[6px] rounded-[50%] bg-[#ff6262] w-[32px] h-[31px] z-[4]" />
          <img
            className="absolute top-[10px] left-[13px] w-[17px] h-[20px] z-[5]"
            loading="lazy"
            alt=""
            src="/vuesaxlinearnotification.svg"
          />
          <a className="[text-decoration:none] absolute top-[7px] left-[0px] text-[inherit] inline-block w-[62px] z-[5]">
            1
          </a>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start text-[16px] text-[#0d062d]">
        <div className="self-stretch flex flex-row items-start justify-start py-[0px] pl-[9px] pr-[10px]">
          <div className="flex-1 flex flex-row items-start justify-start relative">
            <div className="flex-1 relative z-[2] whitespace-nowrap overflow-hidden">Vince Albert Juson</div>
            <img
              className="h-[100px] w-[90px] absolute !m-[0] top-[-99px] left-[calc(50%_-_45px)] rounded-[50%] object-cover z-[3]"
              alt=""
              src="/vince-image.jpg"
            />
          </div>
        </div>
        <a className="[text-decoration:none] self-stretch relative text-[14px] text-[#787486] z-[2]">
          Student
        </a>
      </div>
    </div>
  );
};

GroupComponent.propTypes = {
  className: PropTypes.string,
};

export default GroupComponent;
