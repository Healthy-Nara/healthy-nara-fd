import { content } from "../../data/data"
import { motion } from "motion/react"
import { modalBackdrop, modalPanelCenter, easeOutExpo } from "../../lib/animations"

function NonDutySession() {
    return (
        <div>
            <div className="fixed inset-0">
                <motion.img
                    className="h-screen w-full object-cover"
                    src={content.login.background}
                    alt="background"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.4, ease: easeOutExpo }}
                />
            </div>

            <motion.div
                variants={modalBackdrop}
                initial="hidden"
                animate="show"
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
                <motion.div
                    variants={modalPanelCenter}
                    className="w-full max-w-[370px] rounded-[12px] bg-white p-5 border border-[#D9D9D9]"
                >
                    <div className="flex justify-center">
                        <img src={content.dutySession.popupImg} alt="" className="w-full" />
                    </div>
                    <div className="mt-7">
                        <p className="font-bold font-nato text-[16px] text-secondry">{content.nonDutySession.popupTitle}</p>
                        <p className="mt-2 font-nato text-[12px] font-medium leading-5">
                            {content.nonDutySession.popupSub}
                        </p>
                    </div>
                    <div className="absolute bg-white w-full mx-auto left-0 right-0 z-10 bottom-0 border-[0.1px] border-[#D9D9D9] p-4 text-center">
                        <button className='bg-gray-400 w-full px-16 py-4 text-gray-300 rounded-[8px] font-bold font-nato text-[12px]'>{content.footer.loginBtn}</button>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default NonDutySession
