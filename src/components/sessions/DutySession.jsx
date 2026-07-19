import { useState } from "react";
import { content } from "../../data/data";
import { useNavigate } from "react-router";
import Nav from "../Nav";
import { startDuty, finishDuty, getDutyStatus } from "../../services/dutyService";

function DutySession({ dutyData, activeDuty }) {
  const navigate = useNavigate();
  const [showDutyInPopup, setShowDutyInPopup] = useState(false);
  const [dutyLoading, setDutyLoading] = useState(false);
  const [dutyError, setDutyError] = useState("");
  const [finishLoading, setFinishLoading] = useState(false);
  const [finishError, setFinishError] = useState("");
  const [dutyStart, setDutyStart] = useState(activeDuty?.dutyStart || null);

  const bookingId = dutyData?.[0]?._id;
  const dutyLogId = activeDuty?._id;

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${d.getDate()} , ${months[d.getMonth()]} , ${d.getFullYear()} ${hours}:${minutes}`;
  };

  const handleDutyStart = async () => {
    setDutyLoading(true);
    setDutyError("");
    try {
      await startDuty(bookingId);
      const status = await getDutyStatus();
      setDutyStart(status?.activeDuty?.dutyStart || null);
      setShowDutyInPopup(false);
    } catch {
      setDutyError("Duty start မအောင်မြင်ပါ");
    } finally {
      setDutyLoading(false);
    }
  };

  const handleDutyFinish = async () => {
    setFinishLoading(true);
    setFinishError("");
    try {
      await finishDuty(dutyLogId);
      navigate("/login");
    } catch {
      setFinishError("Duty finish မအောင်မြင်ပါ");
    } finally {
      setFinishLoading(false);
    }
  };

  const today = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const formattedDate = `${today.getDate()} , ${months[today.getMonth()]} , ${today.getFullYear()}`;

  return (
    <div className="m-5">
      <Nav />
      <div className="w-full border-t border-[#D9D9D9] mt-6">
        <div className="font-poppins font-semibold text-[16px] pt-6">
          {formattedDate} Duty
        </div>

        <div className="flex justify-between gap-5 mt-3">
          {/* dutyin */}
          <button
            onClick={() => !dutyStart && setShowDutyInPopup(true)}
            disabled={!!dutyStart}
            className="p-3 text-white rounded w-[50%] flex flex-col justify-center items-start gap-3 cursor-pointer bg-secondry"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"
              />
            </svg>

            <div className="flex flex-col text-start font-nato gap-1">
              <p className="font-semibold text-[14px]">
                {dutyStart ? content.dutySession.dutyStarted : content.dutySession.dutyin}
              </p>
              <p className="font-medium text-[12px]">
                {dutyStart ? formatDateTime(dutyStart) : content.dutySession.dutyInBtn}
              </p>
            </div>
          </button>

          {/* dutyout */}
          <button
            onClick={handleDutyFinish}
            disabled={finishLoading}
            className={`p-3 text-white rounded w-[50%] flex flex-col justify-center items-start gap-3 cursor-pointer ${
              finishLoading ? "bg-gray-400" : "bg-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"
                className="rotate-y-180 origin-center"
              />
            </svg>

            <div className="flex flex-col text-start font-nato gap-1">
              <p className="font-semibold text-[14px]">
                {finishLoading ? "Duty ထွက်နေသည်..." : content.dutySession.dutyout}
              </p>
              <p className="font-medium text-[12px]">
                {content.dutySession.dutyOutBtn}
              </p>
            </div>
          </button>
          {finishError && (
            <p className="text-red-500 text-[11px] font-nato font-medium text-center mt-3">
              {finishError}
            </p>
          )}
        </div>
      </div>

      {/* duty in popup */}
      {showDutyInPopup && (
        <div
          onClick={() => setShowDutyInPopup(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm px-4"
        >
          <div className="w-full max-w-[370px] rounded-[12px] bg-white p-5 border border-[#D9D9D9]">
            {dutyLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
                <p className="font-nato text-[14px] text-gray-500 font-medium">
                  Check In ဝင်နေသည်...
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <img
                    src={content.dutySession.popupImg}
                    alt=""
                    className="w-full"
                  />
                </div>
                <div className="mt-7">
                  <p className="font-bold font-nato text-[16px] text-secondry">
                    {content.dutySession.popupTitle}
                  </p>
                  <p className="mt-2 font-nato text-[12px] font-medium leading-5">
                    {content.dutySession.popupSub}
                  </p>
                  {dutyError && (
                    <p className="text-red-500 text-[11px] font-nato font-medium text-center mt-3">
                      {dutyError}
                    </p>
                  )}
                  <button
                    onClick={handleDutyStart}
                    disabled={dutyLoading}
                    className="w-full px-16 py-4 text-white rounded-[8px] font-bold font-nato text-[12px] mt-5 bg-primary"
                  >
                    {content.dutySession.pupupBtn}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DutySession;
