import GroupComponent from "../components/GroupComponent";
import NavItem from "../components/NavItem";
import UserInfo from "../components/UserInfo";

const DASHBOARD = () => {
  return (
    <div className="w-full h-[1184px] relative bg-[#fff2b2] overflow-hidden flex flex-row items-start justify-start pt-[223px] px-[0px] pb-[0px] box-border gap-[486px] leading-[normal] tracking-[normal] text-left text-[14.6px] text-[#4b4b4b] font-[Poppins] lg:gap-[243px] mq750:gap-[121px] mq750:pl-[20px] mq750:pr-[20px] mq750:box-border mq450:gap-[61px]">
      <div className="mt-[-229px] w-[314px] shadow-[0px_3px_35.16px_rgba(0,_0,_0,_0.08)] bg-[#fff] flex flex-col items-start justify-start pt-[6px] px-[0px] pb-[0px] box-border gap-[441.3px] mq750:hidden mq450:gap-[221px]">
        <div className="self-stretch h-[682.7px] flex flex-col items-end justify-start pt-[229px] px-[0px] pb-[0px] box-border gap-[43px] mq450:gap-[21px] mq450:pt-[97px] mq450:box-border mq1050:pt-[149px] mq1050:pb-[20px] mq1050:box-border">
          <GroupComponent />
          <div className="self-stretch flex flex-row items-start justify-end py-[0px] pl-[23px] pr-[22px]">
            <div className="flex-1 flex flex-col items-start justify-start relative gap-[14.6px] shrink-0">
              <div className="w-[253.4px] rounded-[3.66px] bg-[#fff] flex flex-row items-center justify-between py-[0px] px-[7px] box-border gap-[13.25px]">
                <div className="flex flex-row items-center justify-center">
                  <div className="flex flex-row items-center justify-center py-[7.3px] px-[7px]">
                    <img
                      className="h-[29.3px] w-[29.3px] relative overflow-hidden shrink-0"
                      loading="lazy"
                      alt=""
                      src="/chat.svg"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-center pt-[7.4px] px-[7px] pb-[7.2px]">
                    <div className="relative tracking-[0.01em] leading-[22px] font-[Poppins]">
                      Home (Dashboard)
                    </div>
                  </div>
                </div>
                <div className="h-[22px] w-[22px] flex flex-row items-start justify-start text-[11.9px] text-[#1e252b]">
                  <div className="hidden flex-row items-start justify-start">
                    <div className="h-[22px] w-[22px] relative rounded-[3.66px] bg-[#e9f5fe] overflow-hidden shrink-0">
                      <div className="absolute top-[-1.8px] left-[8.2px] leading-[26.53px]">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="hidden flex-row items-start justify-start">
                    <img
                      className="h-[22px] w-[22px] relative overflow-hidden shrink-0 object-contain"
                      alt=""
                      src="/arrow--right-2@2x.png"
                    />
                  </div>
                </div>
              </div>
              <div className="self-stretch shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-[3.66px] bg-[#f0f6ff] flex flex-row items-center justify-start py-[0px] px-[7px]">
                <div className="flex flex-row items-center justify-center">
                  <div className="flex flex-row items-center justify-center pt-[7.4px] px-[7px] pb-[7.2px]">
                    <img
                      className="h-[29.3px] w-[29.3px] relative overflow-hidden shrink-0"
                      alt=""
                      src="/edit-square.svg"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-center py-[7.3px] px-[7px]">
                    <div className="relative tracking-[0.01em] leading-[22px] font-semibold inline-block min-w-[79px]">
                      Asset Lists
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
                      src="/arrow--right-2-1@2x.png"
                    />
                  </div>
                </div>
              </div>
              <div className="self-stretch rounded-[3.66px] bg-[#fff] flex flex-row items-center justify-start py-[0px] px-[7px] text-[16px]">
                <div className="flex flex-row items-center justify-center">
                  <div className="flex flex-row items-center justify-center py-[7.3px] px-[7px]">
                    <img
                      className="h-[29.3px] w-[29.3px] relative overflow-hidden shrink-0"
                      alt=""
                      src="/edit-square-1.svg"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-center py-[7.3px] px-[7px]">
                    <div className="relative tracking-[0.01em] leading-[22px] inline-block min-w-[115px]">
                      Asset Request
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
                      src="/arrow--right-2-2@2x.png"
                    />
                  </div>
                </div>
              </div>
              <NavItem
                dashboard="Asset History"
                arrowRight2="/arrow--right-2-3@2x.png"
                propDisplay="inline-block"
                propMinWidth="104px"
              />
              <NavItem
                dashboard="Finance Tracking"
                arrowRight2="/arrow--right-2-4@2x.png"
                propDisplay="unset"
                propMinWidth="unset"
              />
              <NavItem
                dashboard="Events Management"
                arrowRight2="/arrow--right-2-5@2x.png"
                propDisplay="unset"
                propMinWidth="unset"
              />
              <div className="self-stretch rounded-[3.66px] bg-[#fff] flex flex-row items-center justify-start py-[0px] px-[7px] text-[16px]">
                <div className="flex flex-row items-center justify-center">
                  <div className="flex flex-row items-center justify-center py-[7.3px] px-[7px]">
                    <img
                      className="h-[29.3px] w-[29.3px] relative overflow-hidden shrink-0"
                      alt=""
                      src="/edit-square-5.svg"
                    />
                  </div>
                  <div className="flex flex-row items-center justify-center py-[7.3px] px-[7px]">
                    <div className="relative tracking-[0.01em] leading-[22px] inline-block min-w-[84px]">
                      Audit Logs
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
                      src="/arrow--right-2-6@2x.png"
                    />
                  </div>
                </div>
              </div>
              <NavItem
                dashboard="User Management"
                arrowRight2="/arrow--right-2-7@2x.png"
              />
              <div className="w-[41px] !m-[0] absolute top-[120px] right-[-7px] bg-[#ff5959] flex flex-row items-start justify-start py-[8px] px-[18px] box-border z-[1] text-[12px]">
                <div className="h-[38px] w-[41px] relative bg-[#ff5959] hidden" />
                <div className="relative tracking-[0.01em] leading-[22px] text-transparent !bg-clip-text [background:linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_#fff] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] inline-block min-w-[4px] z-[2]">
                  1
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start">
          <button className="cursor-pointer [border:none] pt-[19px] px-[49px] pb-[17px] bg-[#d9d9d9] flex-1 flex flex-row items-start justify-start z-[6]">
            <div className="h-[60px] w-[157px] relative bg-[#d9d9d9] hidden" />
            <div className="h-[48px] w-[44px] hidden" />
            <a className="[text-decoration:none] relative text-[12px] tracking-[0.01em] leading-[24px] font-[Poppins] text-transparent !bg-clip-text [background:linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_#262626] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-left inline-block min-w-[50px] z-[7]">
              Settings
            </a>
          </button>
          <button className="cursor-pointer [border:none] pt-[19px] px-[52px] pb-[17px] bg-[#4e4e4e] flex flex-row items-start justify-start z-[6]">
            <div className="h-[60px] w-[157px] relative bg-[#4e4e4e] hidden" />
            <div className="h-[48px] w-[44px] hidden" />
            <div className="relative text-[12px] tracking-[0.01em] leading-[24px] font-[Poppins] text-transparent !bg-clip-text [background:linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_#fff] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-left inline-block min-w-[52px] z-[7]">
              Sign Out
            </div>
          </button>
        </div>
      </div>
      <div className="w-[566px] flex flex-col items-start justify-start max-w-[calc(100%_-_800px)] shrink-0 sm:max-w-full">
        <div className="self-stretch bg-[#f7cc5f] flex flex-row flex-wrap items-start justify-center pt-[23px] pb-[39px] pl-[23px] pr-[20px] box-border max-w-full">
          <div className="h-[283px] w-[566px] relative rounded-[26px] bg-[#f7cc5f] hidden sm:block max-w-full" />
          <img
            className="h-[221px] w-[221px] relative rounded-[50%] object-cover z-[1] sm:mx-auto"
            loading="lazy"
            alt=""
            src="/vince-image.jpg"
          />
        </div>
        <UserInfo className="sm:w-full sm:px-4 lg:px-12" />
      </div>
    </div>
  );
};

export default DASHBOARD;