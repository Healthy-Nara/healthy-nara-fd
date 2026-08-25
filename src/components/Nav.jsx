import { content } from "../data/data"
import { motion } from "motion/react"
import { easeOutExpo } from "../lib/animations"

function Nav({ rightElement, onViewRecords }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="flex justify-between items-center w-full"
        >
            <div className="flex items-center">
                <img src={content.login.logo} alt="Healthy Nara" className="w-[100px] h-[36px] object-contain object-left" />
            </div>
            {rightElement !== undefined ? (
                rightElement
            ) : (
                <button
                    onClick={onViewRecords}
                    className="px-3.5 py-1.5 border border-primary text-primary bg-[#e6f7f4] font-nato font-bold text-[12px] rounded-[8px] cursor-pointer hover:bg-primary/15 active:scale-98 transition-all"
                >
                    {content.nonDutySession?.recordBtn || "မှတ်တမ်း တွေကြည့်မယ်"}
                </button>
            )}
        </motion.div>
    )
}

export default Nav
