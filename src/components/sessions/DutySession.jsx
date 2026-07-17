import { useState } from "react"
import { content } from "../../data/data"
import { useNavigate } from "react-router"
import Nav from "../Nav"


function DutySession() {
    const navigate = useNavigate()
    const [showDutyInPopup, setShowDutyInPopup] = useState(false)

    return (
        <div className="m-5">
            <Nav />
            <div className="w-full border-t border-[#D9D9D9] mt-6">
                <div className="font-poppins font-semibold text-[16px] pt-6">
                    16 , July , 2026 Duty
                </div>

                <div className="flex justify-between gap-5 mt-3">
                    {/* dutyin */}
                    <button
                        onClick={() => setShowDutyInPopup(true)}
                        className="bg-secondry p-3 text-white rounded w-[50%] flex flex-col justify-center items-start gap-3 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z" />
                        </svg>

                        <div className="flex flex-col text-start font-nato gap-1">
                            <p className="font-semibold text-[14px]">{content.dutySession.dutyin}</p>
                            <p className="font-medium text-[12px]">{content.dutySession.dutyInBtn}</p>
                        </div>
                    </button>

                    {/* dutyout */}
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-primary p-3 text-white rounded w-[50%] flex flex-col justify-center items-start gap-3 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z" className="rotate-y-180 origin-center" />
                        </svg>

                        <div className="flex flex-col text-start font-nato gap-1">
                            <p className="font-semibold text-[14px]">{content.dutySession.dutyout}</p>
                            <p className="font-medium text-[12px]">{content.dutySession.dutyOutBtn}</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* duty in popup */}
            {showDutyInPopup && (
                <div onClick={() => setShowDutyInPopup(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm px-4">
                    <div className="w-full max-w-[370px] rounded-[12px] bg-white p-5 border border-[#D9D9D9]">
                        <div className="flex justify-center">
                            <img src={content.dutySession.popupImg} alt="" className="w-full" />
                        </div>
                        <div className="mt-7">
                            <p className="font-bold font-nato text-[16px] text-secondry">{content.dutySession.popupTitle}</p>
                            <p className="mt-2 font-nato text-[12px] font-medium leading-5">
                                {content.dutySession.popupSub}
                            </p>
                            <button
                                onClick={() => setShowDutyInPopup(false)}
                                className="bg-primary w-full px-16 py-4 text-white rounded-[8px] font-bold font-nato text-[12px] mt-5"
                            >
                                {content.dutySession.pupupBtn}
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default DutySession