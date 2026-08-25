import { useState } from "react";
import { content } from "../../data/data";
import { motion, AnimatePresence } from "motion/react";
import { modalPanelCenter, easeOutExpo } from "../../lib/animations";
import Nav from "../Nav";
import RecordHistoryView from "./RecordHistoryView";

function NonDutySession() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.img
          className="h-full w-full object-cover opacity-90"
          src={content.login.background}
          alt="background"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: easeOutExpo }}
        />
      </div>

      {/* Top Navigation */}
      <div className="w-full px-5 pt-4 z-20">
        <Nav onViewRecords={() => setShowHistory(true)} />
      </div>

      {/* Main Center Card */}
      <div className="flex-1 flex items-center justify-center px-5 py-6 z-10">
        <motion.div
          variants={modalPanelCenter}
          initial="hidden"
          animate="show"
          className="w-full max-w-[370px] bg-white rounded-[20px] p-5 sm:p-6 border border-[#D9D9D9] shadow-sm flex flex-col items-center"
        >
          {/* Title */}
          <h2 className="font-bold font-nato text-[22px] text-gray-950 text-center tracking-tight mb-3">
            {content.nonDutySession.popupTitle}
          </h2>

          {/* Subtitle */}
          <p className="font-nato text-[14px] text-[#4a494e] font-medium text-center leading-[1.7] whitespace-pre-line mb-5">
            {content.nonDutySession.popupSub}
          </p>

          {/* Nurse with Clipboard Image */}
          <div className="w-full overflow-hidden rounded-[14px] bg-[#f8fafc] flex justify-center">
            <img
              src={content.nonDutySession.img || "/images/noduty.png"}
              alt={content.nonDutySession.popupTitle}
              className="w-full h-auto object-cover rounded-[14px]"
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom spacer for balance */}
      <div className="h-4 z-0 pointer-events-none" />

      {/* Record History View Overlay */}
      <AnimatePresence>
        {showHistory && (
          <RecordHistoryView
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default NonDutySession;

