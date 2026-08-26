import { useState, useEffect } from "react";
import { content } from "../../data/data";
import { useNavigate } from "react-router";
import Nav from "../Nav";
import {
  startDuty,
  finishDuty,
  getDutyStatus,
} from "../../services/dutyService";
import { createReport, updateReport, getReports } from "../../services/reportService";
import { ClipboardPlus } from "lucide-react";
import { Droplets, Bed, UtensilsCrossed, Hand, CircleAlert } from 'lucide-react';
import { AnimatePresence, motion } from "motion/react";
import RecordHistoryView from "./RecordHistoryView";
import {
  fadeInUp,
  popIn,
  staggerContainer,
  modalBackdrop,
  modalPanelUp,
  modalPanelCenter,
  sheetUp,
  shakeX,
  tapScale,
  springSnappy,
  easeOutExpo,
} from "../../lib/animations";

// Report date — duty start ရက်ကို base ယူတယ် (night duty midnight crossing fix)
// ၂၄ နာရီကျော်နေတဲ့ ဆက်တိုက် duty (weekly/live-in) ဆိုရင်တော့ ဒီနေ့ရက်ကို သုံးတယ်
const reportDateFromDuty = (dutyStart) => {
  const todayStr = new Date().toISOString().split("T")[0];
  if (!dutyStart) return todayStr;
  const hoursActive = (Date.now() - new Date(dutyStart).getTime()) / 36e5;
  return hoursActive >= 24
    ? todayStr
    : new Date(dutyStart).toISOString().split("T")[0];
};

function FormModal({
  title,
  subtitle,
  timeLabel,
  timePlaceholder,
  descLabel,
  descPlaceholder,
  submitLabel,
  categoryName,
  recordTime,
  setRecordTime,
  recordDesc,
  setRecordDesc,
  reportError,
  reportLoading,
  onSubmit,
  onClose,
}) {
  return (
    <motion.div
      variants={modalBackdrop}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        variants={modalPanelUp}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <p className="font-bold font-nato text-[16px] text-gray-900">{title}</p>
          <motion.button
            onClick={() => {
              onClose();
              setRecordTime("");
              setRecordDesc("");
            }}
            whileTap={tapScale}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-[18px] transition-all cursor-pointer"
          >
            ✕
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <p className="font-nato text-[12px] font-medium leading-5 text-gray-500 bg-teal-50/50 p-3 rounded-xl border border-teal-100/30">
            {subtitle}
          </p>

          <div className="flex flex-col gap-5">
            <div>
              <label className="font-nato text-[12px] font-semibold text-gray-700 mb-2 block">
                {timeLabel}
              </label>
              <input
                type="text"
                value={recordTime}
                onChange={(e) => setRecordTime(e.target.value)}
                placeholder={timePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-800 text-[14px] outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="font-nato text-[12px] font-semibold text-gray-700 mb-2 block">
                {descLabel}
              </label>
              <textarea
                value={recordDesc}
                onChange={(e) => setRecordDesc(e.target.value)}
                placeholder={descPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-gray-800 text-[14px] outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-nato"
                rows="4"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {reportError && (
              <motion.p
                key={reportError}
                variants={shakeX}
                initial="hidden"
                animate="show"
                exit="exit"
                className="text-red-500 text-[12px] font-nato font-medium text-center bg-red-50 p-2.5 rounded-lg border border-red-100"
              >
                {reportError}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => onSubmit(categoryName)}
            disabled={reportLoading}
            whileTap={reportLoading ? undefined : tapScale}
            transition={springSnappy}
            className={`w-full py-4 rounded-xl font-bold font-nato text-[14px] text-white cursor-pointer transition-all shadow-md ${
              reportLoading ? "bg-gray-300" : "bg-primary shadow-primary/20 hover:bg-primary/95"
            }`}
          >
            {reportLoading ? "သွင်းနေသည်..." : submitLabel}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DutySession({ dutyData, activeDuty }) {
  const navigate = useNavigate();
  const [dutyLoading, setDutyLoading] = useState(false);
  const [dutyError, setDutyError] = useState("");
  const [finishLoading, setFinishLoading] = useState(false);
  const [finishError, setFinishError] = useState("");
  const [dutyStart, setDutyStart] = useState(activeDuty?.dutyStart || null);

  const [showHygieneForm, setShowHygieneForm] = useState(false);
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [exerciseForm, setExerciseForm] = useState(false);
  const [incidentForm, setIncidentForm] = useState(false);
  const [showViewRecordsModal, setShowViewRecordsModal] = useState(false);
  const [showDutyOutModal, setShowDutyOutModal] = useState(false);

  const [recordTime, setRecordTime] = useState("");
  const [recordDesc, setRecordDesc] = useState("");

  const [reportLoading, setReportLoading] = useState(false);
  const [todayReports, setTodayReports] = useState([]);

  const booking = dutyData?.[0];
  const bookingId = booking?._id;
  const dutyLogId = activeDuty?._id;

  const childName = booking?.childName || "ကလေးငယ်";
  const serviceType = booking?.serviceType || "Day Duty";

  useEffect(() => {
    const fetchReports = async () => {
      if (!bookingId) return;
      try {
        const dateStr = reportDateFromDuty(dutyStart);
        const data = await getReports(dateStr, bookingId);
        setTodayReports(data);
      } catch {
        /* ignore */
      }
    };
    fetchReports();
  }, [bookingId, dutyStart]);

  const now = new Date();
  const dayStr = now.getDate().toString().padStart(2, "0");
  const monthStr = (now.getMonth() + 1).toString().padStart(2, "0");
  const yearStr = now.getFullYear().toString().slice(-2);
  const badgeDateStr = `${dayStr} / ${monthStr} / ${yearStr} Duty`;

  const handleDutyStart = async () => {
    setDutyLoading(true);
    setDutyError("");
    try {
      await startDuty(bookingId);
      const status = await getDutyStatus();
      setDutyStart(status?.activeDuty?.dutyStart || new Date().toISOString());
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

  const handleRecordCreate = async (categoryName) => {
    if (!recordTime || !recordDesc) return;
    setReportLoading(true);
    try {
      const newRecord = { category: categoryName, time: recordTime, desc: recordDesc };
      const existing = todayReports.find((r) => r.booking?._id === bookingId);
      if (existing) {
        await updateReport(existing._id, {
          ...existing,
          records: [...(existing.records || []), newRecord],
          status: "draft",
        });
      } else {
        await createReport({
          bookingId,
          date: reportDateFromDuty(dutyStart),
          status: "draft",
          records: [newRecord],
        });
      }
      setShowHygieneForm(false);
      setShowSleepForm(false);
      setShowNutritionForm(false);
      setExerciseForm(false);
      setIncidentForm(false);
      setRecordTime("");
      setRecordDesc("");
      const data = await getReports(reportDateFromDuty(dutyStart), bookingId);
      setTodayReports(data);
    } catch {
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden pb-28">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.img
          className="h-full w-full object-cover opacity-90"
          src={content.login.background}
          alt="background"
        />
      </div>

      {/* Top Navigation */}
      <div className="w-full px-5 pt-4 z-20">
        <Nav onViewRecords={() => setShowViewRecordsModal(true)} />
      </div>

      {!dutyStart ? (
        <div className="flex-1 flex items-center justify-center px-5 py-6 z-10">
          <motion.div
            variants={modalPanelCenter}
            initial="hidden"
            animate="show"
            className="w-full max-w-[370px] bg-white rounded-[20px] p-5 sm:p-6 border border-[#D9D9D9] shadow-sm flex flex-col items-center"
          >
            <h2 className="font-bold font-nato text-[22px] text-gray-950 text-center tracking-tight mb-2">
              Duty စဝင်မယ်
            </h2>
            <p className="font-nato text-[14px] text-[#4a494e] font-medium text-center leading-[1.65] mb-5">
              Healthy Nara Team ဘက်ကနေ<br />
              <span className="font-bold text-gray-800">{childName}</span> အိမ်ကို{" "}
              <span className="font-bold text-gray-800">{serviceType}</span><br />
              Assigned ချထားပါတယ်
            </p>
            <div className="w-full overflow-hidden rounded-[14px] bg-[#f8fafc] flex justify-center mb-5">
              <img
                src={content.dutySession.popupImg || "/images/duty.png"}
                alt="Duty စဝင်မယ်"
                className="w-full h-auto object-cover rounded-[14px]"
              />
            </div>
            {dutyError && <p className="text-red-500 text-[12px] font-nato font-medium text-center mb-3">{dutyError}</p>}
            <motion.button
              whileTap={!dutyLoading ? tapScale : undefined}
              transition={springSnappy}
              onClick={handleDutyStart}
              disabled={dutyLoading}
              className="w-full bg-[#1cb89b] text-white p-3 rounded-[12px] flex items-center justify-between cursor-pointer shadow-md shadow-primary/25 hover:bg-[#18a48a] transition-all"
            >
              <div className="w-10 h-10 rounded-[8px] bg-white text-[#1cb89b] flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <div className="flex flex-col text-right font-nato pr-1">
                <p className="font-bold text-[15px] leading-tight">{dutyLoading ? "စတင်နေပါသည်..." : "Duty စဝင်မယ်"}</p>
                <p className="font-medium text-[11px] opacity-90">ဒီကိုနှိပ်ပါ</p>
              </div>
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 w-full px-5 pt-4 z-10">
          <div className="flex items-center justify-between mt-2 mb-5">
            <h2 className="font-bold font-nato text-[18px] sm:text-[20px] text-gray-950">Record အမျိုးအစားရွေးပါ</h2>
            <div className="px-3.5 py-1 bg-[#e6f7f4] border border-primary/30 text-primary font-poppins font-semibold text-[11px] sm:text-[12px] rounded-full">
              {badgeDateStr}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 mb-3.5 sm:mb-4">
            <motion.div whileTap={tapScale} onClick={() => setShowHygieneForm(true)} className="bg-white border border-[#D9D9D9] rounded-[16px] p-4 flex flex-col justify-between items-start min-h-[125px] cursor-pointer hover:border-primary transition-all shadow-sm active:scale-98">
              <div className="w-9 h-9 rounded-[10px] bg-[#1cb89b] text-white flex items-center justify-center mb-3"><Droplets size={20} strokeWidth={2.2} /></div>
              <p className="font-bold font-nato text-[14px] text-gray-900 leading-snug">တစ်ကိုယ်ရည်<br />သန့်ရှင်းရေး <span className="font-poppins text-[13px]">Record</span></p>
            </motion.div>
            <motion.div whileTap={tapScale} onClick={() => setShowSleepForm(true)} className="bg-white border border-[#D9D9D9] rounded-[16px] p-4 flex flex-col justify-between items-start min-h-[125px] cursor-pointer hover:border-primary transition-all shadow-sm active:scale-98">
              <div className="w-9 h-9 rounded-[10px] bg-[#1cb89b] text-white flex items-center justify-center mb-3"><Bed size={20} strokeWidth={2.2} /></div>
              <p className="font-bold font-nato text-[14px] text-gray-900 leading-snug">ကလေးအိပ်စက်ချိန်<br /><span className="font-poppins text-[13px]">Record</span></p>
            </motion.div>
            <motion.div whileTap={tapScale} onClick={() => setExerciseForm(true)} className="bg-white border border-[#D9D9D9] rounded-[16px] p-4 flex flex-col justify-between items-start min-h-[125px] cursor-pointer hover:border-primary transition-all shadow-sm active:scale-98">
              <div className="w-9 h-9 rounded-[10px] bg-[#1cb89b] text-white flex items-center justify-center mb-3"><Hand size={20} strokeWidth={2.2} /></div>
              <p className="font-bold font-nato text-[14px] text-gray-900 leading-snug">ကိုယ်လက် လှုပ်ရှားမှု<br /><span className="font-poppins text-[13px]">Record</span></p>
            </motion.div>
            <motion.div whileTap={tapScale} onClick={() => setShowNutritionForm(true)} className="bg-white border border-[#D9D9D9] rounded-[16px] p-4 flex flex-col justify-between items-start min-h-[125px] cursor-pointer hover:border-primary transition-all shadow-sm active:scale-98">
              <div className="w-9 h-9 rounded-[10px] bg-[#1cb89b] text-white flex items-center justify-center mb-3"><UtensilsCrossed size={20} strokeWidth={2.2} /></div>
              <p className="font-bold font-nato text-[14px] text-gray-900 leading-snug">အာဟာရတိုက်<br />ကျွေးခြင်း <span className="font-poppins text-[13px]">Record</span></p>
            </motion.div>
          </div>
          <motion.div whileTap={tapScale} onClick={() => setIncidentForm(true)} className="w-full bg-white border border-[#D9D9D9] rounded-[16px] p-4 flex flex-col justify-between items-start min-h-[115px] cursor-pointer hover:border-primary transition-all shadow-sm active:scale-98 mb-6">
            <div className="w-9 h-9 rounded-[10px] bg-[#1cb89b] text-white flex items-center justify-center mb-3"><CircleAlert size={20} strokeWidth={2.2} /></div>
            <p className="font-bold font-nato text-[14px] text-gray-900 leading-snug">ထူးခြားဖြစ်စဉ်<br />မှတ်တမ်း <span className="font-poppins text-[13px]">Record</span></p>
          </motion.div>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 z-30 flex flex-col items-center">
            <div className="w-full px-1">
              <motion.button whileTap={tapScale} transition={springSnappy} onClick={() => setShowDutyOutModal(true)} className="w-full bg-[#1cb89b] text-white p-3 rounded-[12px] flex items-center justify-between cursor-pointer shadow-lg shadow-primary/25 hover:bg-[#18a48a] transition-all">
                <div className="w-10 h-10 rounded-[8px] bg-white text-[#1cb89b] flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <div className="flex flex-col text-right font-nato pr-1">
                  <p className="font-bold text-[15px] leading-tight">Duty ထွက်မယ်</p>
                  <p className="font-medium text-[11px] opacity-90">ဒီကိုနှိပ်ပါ</p>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showHygieneForm && (
          <FormModal key="hygiene-form" title={content.dutySession.hygieneRecord.title} subtitle={content.dutySession.hygieneRecord.subtitle} timeLabel="အချိန်" timePlaceholder="ဥပမာ - 10:00 AM" descLabel="အသေးစိတ်" descPlaceholder="ဖော်ပြချက်" submitLabel={content.dutySession.hygieneRecord.submitBtn} categoryName="Personal Hygiene" recordTime={recordTime} setRecordTime={setRecordTime} recordDesc={recordDesc} setRecordDesc={setRecordDesc} onClose={() => setShowHygieneForm(false)} onSubmit={handleRecordCreate} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSleepForm && (
          <FormModal key="sleep-form" title={content.dutySession.sleepRecord.title} subtitle={content.dutySession.sleepRecord.subtitle} timeLabel="အချိန်" timePlaceholder="ဥပမာ - 01:00 PM" descLabel="အသေးစိတ်" descPlaceholder="ဖော်ပြချက်" submitLabel={content.dutySession.sleepRecord.submitBtn} categoryName="Sleeping" recordTime={recordTime} setRecordTime={setRecordTime} recordDesc={recordDesc} setRecordDesc={setRecordDesc} onClose={() => setShowSleepForm(false)} onSubmit={handleRecordCreate} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNutritionForm && (
          <FormModal key="nutrition-form" title={content.dutySession.nutritionRecord.title} subtitle={content.dutySession.nutritionRecord.subtitle} timeLabel="အချိန်" timePlaceholder="ဥပမာ - 08:30 AM" descLabel="အသေးစိတ်" descPlaceholder="ဖော်ပြချက်" submitLabel={content.dutySession.nutritionRecord.submitBtn} categoryName="Nutrition and Feeding" recordTime={recordTime} setRecordTime={setRecordTime} recordDesc={recordDesc} setRecordDesc={setRecordDesc} onClose={() => setShowNutritionForm(false)} onSubmit={handleRecordCreate} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {exerciseForm && (
          <FormModal key="exercise-form" title={content.dutySession.exerciseRecord.title} subtitle={content.dutySession.exerciseRecord.subtitle} timeLabel="အချိန်" timePlaceholder="ဥပမာ - 04:30 PM" descLabel="အသေးစိတ်" descPlaceholder="ဖော်ပြချက်" submitLabel={content.dutySession.exerciseRecord.submitBtn} categoryName="Activity and exercise" recordTime={recordTime} setRecordTime={setRecordTime} recordDesc={recordDesc} setRecordDesc={setRecordDesc} onClose={() => setExerciseForm(false)} onSubmit={handleRecordCreate} />
        )}
      </AnimatePresence>
      {/* Incident Record Form Modal */}
      <AnimatePresence>
        {incidentForm && (
          <FormModal
            key="incident-form"
            title={content.dutySession.incident.title}
            subtitle={content.dutySession.incident.subtitle}
            timeLabel="အချိန်"
            timePlaceholder="ဥပမာ - 02:00 PM"
            descLabel="ထူးခြားဖြစ်စဉ် အသေးစိတ်"
            descPlaceholder="သတိထားမိသမျှ ထူးခြားဖြစ်စဉ်အကြောင်း အပြည့်အစုံ ရေးပေးပါ"
            submitLabel={content.dutySession.incident.submitBtn}
            categoryName="Analysis and Unusual Findings"
            recordTime={recordTime}
            setRecordTime={setRecordTime}
            recordDesc={recordDesc}
            setRecordDesc={setRecordDesc}
            onClose={() => setIncidentForm(false)}
            onSubmit={handleRecordCreate}
          />
        )}
      </AnimatePresence>

      {/* Duty Out Confirmation Modal */}
      <AnimatePresence>
        {showDutyOutModal && (
          <motion.div
            key="duty-out-confirm-modal"
            variants={modalBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-nato"
            onClick={() => setShowDutyOutModal(false)}
          >
            <motion.div
              variants={modalPanelCenter}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={springSnappy}
              className="bg-white rounded-[24px] p-6 max-w-[360px] w-full border border-gray-100 shadow-2xl flex flex-col items-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowDutyOutModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold"
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-[20px] font-bold text-gray-900 text-center mb-1.5 mt-1">
                Duty ကနေထွက်မယ်
              </h2>

              {/* Subtitle */}
              <div className="text-[13.5px] text-gray-600 text-center leading-relaxed mb-4 px-2">
                <p>Healthy Nara Team ဘက်ကနေ</p>
                <p>Assigned ချထားတဲ့ Duty ချိန်ပြီးလို့</p>
                <p>Duty ထွက်ဖို့ သေချာပါပြီ</p>
              </div>

              {/* Nurse Goodbye Image */}
              <div className="w-full rounded-[16px] overflow-hidden bg-gray-50 border border-gray-100 mb-5 shadow-xs flex items-center justify-center">
                <img
                  src="/images/dutyout.png"
                  alt="Duty Out"
                  className="w-full h-auto object-cover max-h-[220px]"
                />
              </div>

              {/* Finish Error message if any */}
              {finishError && (
                <p className="text-red-500 text-[12px] font-medium text-center mb-3 w-full bg-red-50 p-2 rounded-lg border border-red-100">
                  {finishError}
                </p>
              )}

              {/* Green Confirm Duty Out Button */}
              <motion.button
                whileTap={!finishLoading ? tapScale : undefined}
                transition={springSnappy}
                onClick={handleDutyFinish}
                disabled={finishLoading}
                className="w-full bg-[#1cb89b] text-white p-3 rounded-[12px] flex items-center justify-between cursor-pointer shadow-lg shadow-primary/20 hover:bg-[#18a48a] transition-all"
              >
                <div className="w-10 h-10 rounded-[8px] bg-white text-[#1cb89b] flex items-center justify-center shrink-0 shadow-2xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
                <div className="flex flex-col text-right font-nato pr-1">
                  <p className="font-bold text-[15px] leading-tight">
                    {finishLoading ? "Duty ထွက်နေသည်..." : "Duty ထွက်မယ်"}
                  </p>
                  <p className="font-medium text-[11px] opacity-90">ဒီကိုနှိပ်ပါ</p>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Records View (မှတ်တမ်း တွေကြည့်မယ်) */}
      <AnimatePresence>
        {showViewRecordsModal && (
          <RecordHistoryView
            bookingId={bookingId}
            currentDateStr={reportDateFromDuty(dutyStart)}
            activeDuty={activeDuty}
            onClose={() => setShowViewRecordsModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default DutySession;
