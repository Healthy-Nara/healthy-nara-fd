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
  const [showDutyInPopup, setShowDutyInPopup] = useState(false);
  const [dutyLoading, setDutyLoading] = useState(false);
  const [dutyError, setDutyError] = useState("");
  const [finishLoading, setFinishLoading] = useState(false);
  const [finishError, setFinishError] = useState("");
  const [dutyStart, setDutyStart] = useState(activeDuty?.dutyStart || null);
  const [showRecordPopup, setShowRecordPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showHygieneForm, setShowHygieneForm] = useState(false);
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [exerciseForm, setExerciseForm] = useState(false);
  const [incidentForm, setIncidentForm] = useState(false);

  const [recordTime, setRecordTime] = useState("");
  const [recordDesc, setRecordDesc] = useState("");

  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [todayReports, setTodayReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const bookingId = dutyData?.[0]?._id;
  const dutyLogId = activeDuty?._id;

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

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
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

  const handleRecordSubmit = () => {
    setShowRecordPopup(false)

    if (selectedRecord === 1) {
      setShowHygieneForm(true)
    } else if (selectedRecord === 2) {
      setShowSleepForm(true)
    } else if (selectedRecord === 3) {
      setShowNutritionForm(true)
    } else if (selectedRecord === 4) {
      setExerciseForm(true)
    } else if (selectedRecord === 5) {
      setIncidentForm(true)
    }
  }

  const recordIcons = {
    1: Droplets,
    2: Bed,
    3: UtensilsCrossed,
    4: Hand,
    5: CircleAlert,
  }

  const buildBasePayload = () => ({
    bookingId,
    date: reportDateFromDuty(dutyStart),
    status: "draft",
    records: [],
  });

  const findExistingReport = () => {
    return todayReports.find((r) => r.booking?._id === bookingId) || null;
  };

  const refreshReports = async () => {
    try {
      const dateStr = reportDateFromDuty(dutyStart);
      const data = await getReports(dateStr, bookingId);
      setTodayReports(data);
    } catch {
      /* ignore */
    }
  };

  const hasCategoryRecord = (catName) => {
    return todayReports.some(
      (r) => r.records?.some((rec) => rec.category === catName)
    );
  };

  const hasHygiene = hasCategoryRecord("Personal Hygiene");
  const hasFeeding = hasCategoryRecord("Nutrition and Feeding");
  const hasSleep = hasCategoryRecord("Sleeping");
  const hasActivityRecord = hasCategoryRecord("Activity and exercise");
  const hasAbnormality = hasCategoryRecord("Analysis and Unusual Findings");

  const handleRecordCreate = async (categoryName) => {
    if (!recordTime || !recordDesc) {
      setReportError("အချိန်နှင့် အကြောင်းအရာကို ဖြည့်စွက်ပေးပါ");
      return;
    }
    setReportLoading(true);
    setReportError("");
    try {
      const newRecord = {
        category: categoryName,
        time: recordTime,
        desc: recordDesc,
      };

      const existing = findExistingReport();
      if (existing) {
        await updateReport(existing._id, {
          ...existing,
          records: [...(existing.records || []), newRecord],
          status: "draft",
        });
      } else {
        await createReport({
          ...buildBasePayload(),
          records: [newRecord],
        });
      }

      // Close all form overlays
      setShowHygieneForm(false);
      setShowSleepForm(false);
      setShowNutritionForm(false);
      setExerciseForm(false);
      setIncidentForm(false);

      // Reset states
      setRecordTime("");
      setRecordDesc("");
      await refreshReports();
    } catch {
      setReportError("အစီရင်ခံစာ တင်သွင်းခြင်း မအောင်မြင်ပါ");
    } finally {
      setReportLoading(false);
    }
  };

  const today = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedDate = `${today.getDate()} , ${months[today.getMonth()]} , ${today.getFullYear()}`;

  return (
    <div className="m-5">
      <Nav />
      <div className="w-full border-t border-[#D9D9D9] mt-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOutExpo }}
          className="font-poppins font-semibold text-[16px] pt-6"
        >
          {formattedDate} Duty
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12, 0.15)}
          initial="hidden"
          animate="show"
          className="flex justify-between gap-5 mt-3"
        >
          {/* dutyin */}
          <motion.button
            variants={fadeInUp}
            whileTap={!dutyStart ? tapScale : undefined}
            transition={springSnappy}
            onClick={() => !dutyStart && setShowDutyInPopup(true)}
            disabled={!!dutyStart}
            className="p-3 text-white rounded w-[50%] flex flex-col justify-center items-start gap-3 cursor-pointer bg-secondry shadow-md shadow-secondry/25"
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
                {dutyStart
                  ? content.dutySession.dutyStarted
                  : content.dutySession.dutyin}
              </p>
              <p className="font-medium text-[12px]">
                {dutyStart
                  ? formatDateTime(dutyStart)
                  : content.dutySession.dutyInBtn}
              </p>
            </div>
          </motion.button>

          {/* dutyout */}
          <motion.button
            variants={fadeInUp}
            whileTap={dutyStart && !finishLoading ? tapScale : undefined}
            transition={springSnappy}
            onClick={handleDutyFinish}
            disabled={!dutyStart || finishLoading}
            className={`p-3 text-white rounded w-[50%] flex flex-col justify-center items-start gap-3 cursor-pointer ${(!dutyStart || finishLoading) ? "bg-gray-400" : "bg-primary shadow-md shadow-primary/25"
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
                {finishLoading
                  ? "Duty ထွက်နေသည်..."
                  : content.dutySession.dutyout}
              </p>
              <p className="font-medium text-[12px]">
                {content.dutySession.dutyOutBtn}
              </p>
            </div>
          </motion.button>
          {finishError && (
            <p className="text-red-500 text-[11px] font-nato font-medium text-center mt-3">
              {finishError}
            </p>
          )}
        </motion.div>
      </div>

      {/* today record log */}
      <div className="mt-8">
        <p className="font-poppins font-semibold text-[16px] mb-4">
          Today Record Log
        </p>
        <motion.div
          variants={staggerContainer(0.06, 0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-wrap gap-2"
        >
          {[
            { key: "hygiene", label: "သန့်ရှင်းရေး", has: hasHygiene },
            { key: "feeding", label: "အာဟာရ", has: hasFeeding },
            { key: "sleep", label: "အိပ်စက်ချိန်", has: hasSleep },
            { key: "activity", label: "ကိုယ်လက်လှုပ်ရှားမှု", has: hasActivityRecord },
            { key: "abnormality", label: "ထူးခြားဖြစ်စဉ်", has: hasAbnormality },
          ].map((cat) => (
            <motion.button
              key={cat.key}
              variants={popIn}
              whileTap={tapScale}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.key ? null : cat.key
                )
              }
              className={`px-4 py-2 rounded-full font-nato text-[12px] font-medium cursor-pointer transition-colors ${selectedCategory === cat.key
                ? "bg-primary text-white"
                : cat.has
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence initial={false}>
          {selectedCategory && (
            <motion.div
              key="detail-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: easeOutExpo }}
              className="overflow-hidden"
            >
              <div className="mt-4 border border-[#D9D9D9] rounded-[12px] p-4">
            <p className="font-nato text-[14px] font-bold text-primary mb-3">
              {selectedCategory === "hygiene" && content.dutySession.recordLog.hygieneTitle}
              {selectedCategory === "sleep" && content.dutySession.recordLog.sleepTitle}
              {selectedCategory === "feeding" && content.dutySession.recordLog.feedingTitle}
              {selectedCategory === "activity" && content.dutySession.recordLog.activityTitle}
              {selectedCategory === "abnormality" && content.dutySession.recordLog.abnormalityTitle}
            </p>

            <div className="flex flex-col gap-2">
              {(() => {
                const categoryEnumMap = {
                  hygiene: "Personal Hygiene",
                  sleep: "Sleeping",
                  feeding: "Nutrition and Feeding",
                  activity: "Activity and exercise",
                  abnormality: "Analysis and Unusual Findings",
                };
                const targetEnum = categoryEnumMap[selectedCategory];
                const filteredRecords = todayReports.flatMap(r =>
                  (r.records || [])
                    .filter(rec => rec.category === targetEnum)
                    .map(rec => ({ ...rec, reportId: r._id }))
                );

                if (filteredRecords.length === 0) {
                  return (
                    <p className="font-nato text-[12px] text-gray-400">
                      {content.dutySession.recordLog.noRecord}
                    </p>
                  );
                }

                return filteredRecords.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.06, duration: 0.35, ease: easeOutExpo },
                    }}
                    className="flex items-start justify-between font-nato text-[13px] border-b border-gray-100 pb-2 last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col gap-1 flex-1 pr-4">
                      <span className="text-gray-800 font-semibold">{rec.desc}</span>
                      <span className="text-gray-400 text-[11px]">အချိန်: {rec.time}</span>
                    </div>
                  </motion.div>
                ));
              })()}
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* record button */}
      <AnimatePresence>
        {dutyStart && (
          <motion.div
            key="record-btn"
            variants={sheetUp}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 px-5 pb-5 z-40"
          >
            <motion.button
              onClick={() => setShowRecordPopup(true)}
              whileTap={tapScale}
              transition={springSnappy}
              className="w-full flex items-center justify-center gap-2 bg-[#1cb89b] text-white py-4 rounded-lg font-nato text-[14px] font-semibold shadow-xl shadow-primary/30"
            >
              <ClipboardPlus />
              {content.dutySession.recordBtn}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* record popup */}
      <AnimatePresence>
        {showRecordPopup && (
          <motion.div
            key="record-popup"
            variants={modalBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            className="fixed inset-0 z-50 bg-white/100 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              variants={modalPanelCenter}
              className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mt-10 mx-2 border-[1px] border-[#D9D9D9]"
            >
              <div className="flex justify-between items-center px-6 pt-6 pb-2">
                <p className="font-bold font-nato text-[16px] text-secondry">
                  {content.dutySession.recordPopup.title}
                </p>

                <motion.button
                  onClick={() => setShowRecordPopup(false)}
                  whileTap={tapScale}
                  className="text-secondry hover:text-blue-600 text-[22px] leading-none cursor-pointer"
                >
                  ✕
                </motion.button>
              </div>

              <div className="flex-1 flex flex-col items-start justify-center px-6 pb-6">
                <p className="font-nato text-[12px] font-medium leading-5 text-[#4A494E] text-start mb-2 w-[80%]">
                  {content.dutySession.recordPopup.subtitle}
                </p>

                <motion.div
                  variants={staggerContainer(0.07, 0.12)}
                  initial="hidden"
                  animate="show"
                  className="w-full flex flex-col gap-4"
                >
                  {content.dutySession.recordPopup.options.map((opt) => {
                    const Icon = recordIcons[opt.id]

                    return (
                      <motion.button
                        key={opt.id}
                        variants={popIn}
                        whileTap={tapScale}
                        type="button"
                        onClick={() => setSelectedRecord(opt.id)}
                        className={`flex items-center justify-between gap-4 px-5 py-4 rounded-[12px] border text-left font-nato text-[14px] font-bold cursor-pointer transition-colors ${selectedRecord === opt.id
                            ? "border-secondry bg-secondry text-white"
                            : "border-secondry text-secondry bg-white"
                          }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selectedRecord === opt.id
                              ? "bg-white text-secondry"
                              : "text-secondry"
                            }`}
                        >
                          {Icon && <Icon size={18} strokeWidth={2.3} />}
                        </div>

                        <span className="flex-1 text-right">
                          {opt.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </motion.div>

                <motion.button
                  disabled={!selectedRecord}
                  onClick={handleRecordSubmit}
                  whileTap={selectedRecord ? tapScale : undefined}
                  transition={springSnappy}
                  className={`w-full mt-8 py-4 rounded-[8px] font-bold font-nato text-[12px] text-white cursor-pointer transition-colors ${selectedRecord ? "bg-primary" : "bg-gray-300"
                    }`}
                >
                  {content.dutySession.recordPopup.submitBtn}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* hygiene record form */}
      <AnimatePresence>
        {showHygieneForm && (
          <FormModal
            key="hygiene-form"
            title={content.dutySession.hygieneRecord.title}
            subtitle={content.dutySession.hygieneRecord.subtitle}
            timeLabel="သန့်ရှင်းရေးလုပ်ပေးသည့် အချိန်"
            timePlaceholder="ဥပမာ - 10:00 AM / နေ့လည် ၁ နာရီ"
            descLabel="သန့်ရှင်းရေးမှတ်တမ်း အသေးစိတ်"
            descPlaceholder="ဥပမာ - ရေချိုးပေးခြင်း၊ ဒိုင်ပါ ၂ ကြိမ်လဲပေးခြင်း"
            submitLabel={content.dutySession.hygieneRecord.submitBtn}
            categoryName="Personal Hygiene"
            recordTime={recordTime}
            setRecordTime={setRecordTime}
            recordDesc={recordDesc}
            setRecordDesc={setRecordDesc}
            reportError={reportError}
            reportLoading={reportLoading}
            onSubmit={handleRecordCreate}
            onClose={() => setShowHygieneForm(false)}
          />
        )}
      </AnimatePresence>

      {/* sleep record form */}
      <AnimatePresence>
        {showSleepForm && (
          <FormModal
            key="sleep-form"
            title={content.dutySession.sleepRecord.title}
            subtitle={content.dutySession.sleepRecord.subtitle}
            timeLabel="အိပ်စက်သည့် အချိန်"
            timePlaceholder="ဥပမာ - 01:00 PM / နေ့လည် ၁ နာရီ"
            descLabel="အိပ်စက်ခြင်းမှတ်တမ်း အသေးစိတ်"
            descPlaceholder="ဥပမာ - နေ့လည် ၁ နာရီမှ ၃ နာရီအထိ နှစ်နှစ်ခြိုက်ခြိုက်အိပ်ပျော်သည်"
            submitLabel={content.dutySession.sleepRecord.submitBtn}
            categoryName="Sleeping"
            recordTime={recordTime}
            setRecordTime={setRecordTime}
            recordDesc={recordDesc}
            setRecordDesc={setRecordDesc}
            reportError={reportError}
            reportLoading={reportLoading}
            onSubmit={handleRecordCreate}
            onClose={() => setShowSleepForm(false)}
          />
        )}
      </AnimatePresence>

      {/* nutrition record form */}
      <AnimatePresence>
        {showNutritionForm && (
          <FormModal
            key="nutrition-form"
            title={content.dutySession.nutritionRecord.title}
            subtitle={content.dutySession.nutritionRecord.subtitle}
            timeLabel="အစာကျွေးသည့် အချိန်"
            timePlaceholder="ဥပမာ - 08:30 AM / ညနေ ၆ နာရီ"
            descLabel="အာဟာရနှင့် အစာကျွေးခြင်းမှတ်တမ်း အသေးစိတ်"
            descPlaceholder="ဥပမာ - နို့ ၁ ခွက်နှင့် ဆန်ပြုတ် ၁ ပန်းကန်ကျွေးပြီး၊ ဆေးတိုက်ပြီး"
            submitLabel={content.dutySession.nutritionRecord.submitBtn}
            categoryName="Nutrition and Feeding"
            recordTime={recordTime}
            setRecordTime={setRecordTime}
            recordDesc={recordDesc}
            setRecordDesc={setRecordDesc}
            reportError={reportError}
            reportLoading={reportLoading}
            onSubmit={handleRecordCreate}
            onClose={() => setShowNutritionForm(false)}
          />
        )}
      </AnimatePresence>

      {/* exercise record form */}
      <AnimatePresence>
        {exerciseForm && (
          <FormModal
            key="exercise-form"
            title={content.dutySession.exerciseRecord.title}
            subtitle={content.dutySession.exerciseRecord.subtitle}
            timeLabel="လေ့ကျင့်ခန်းပြုလုပ်သည့် အချိန်"
            timePlaceholder="ဥပမာ - 04:30 PM / ညနေ ၄ နာရီခွဲ"
            descLabel="လှုပ်ရှားမှုမှတ်တမ်း အသေးစိတ်"
            descPlaceholder="ဥပမာ - ၁၅ မိနစ် လမ်းလျှောက်လေ့ကျင့်ခန်းလုပ်ပေးခြင်း၊ အကြောလျှော့ပေးခြင်း"
            submitLabel={content.dutySession.exerciseRecord.submitBtn}
            categoryName="Activity and exercise"
            recordTime={recordTime}
            setRecordTime={setRecordTime}
            recordDesc={recordDesc}
            setRecordDesc={setRecordDesc}
            reportError={reportError}
            reportLoading={reportLoading}
            onSubmit={handleRecordCreate}
            onClose={() => setExerciseForm(false)}
          />
        )}
      </AnimatePresence>

      {/* incident record form */}
      <AnimatePresence>
        {incidentForm && (
          <FormModal
            key="incident-form"
            title={content.dutySession.incident.title}
            subtitle={content.dutySession.incident.subtitle}
            timeLabel="ဖြစ်ပွားသည့် အချိန်"
            timePlaceholder="ဥပမာ - 02:00 PM / နေ့လည် ၂ နာရီ"
            descLabel="ထူးခြားဖြစ်စဉ် အသေးစိတ်"
            descPlaceholder="ဥပမာ - နေ့လည်ပိုင်းတွင် အပူချိန် ၁၀၀°F ရှိပြီး ချောင်းအနည်းငယ်ဆိုးသည်"
            submitLabel={content.dutySession.incident.submitBtn}
            categoryName="Analysis and Unusual Findings"
            recordTime={recordTime}
            setRecordTime={setRecordTime}
            recordDesc={recordDesc}
            setRecordDesc={setRecordDesc}
            reportError={reportError}
            reportLoading={reportLoading}
            onSubmit={handleRecordCreate}
            onClose={() => setIncidentForm(false)}
          />
        )}
      </AnimatePresence>

      {/* duty in popup */}
      <AnimatePresence>
        {showDutyInPopup && (
          <motion.div
            key="duty-in-popup"
            variants={modalBackdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => setShowDutyInPopup(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm px-4"
          >
            <motion.div
              variants={modalPanelCenter}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[370px] rounded-[12px] bg-white p-5 border border-[#D9D9D9]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {dutyLoading ? (
                  <motion.div
                    key="duty-loading"
                    className="flex flex-col items-center justify-center py-10 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
                    <p className="font-nato text-[14px] text-gray-500 font-medium">
                      Check In ဝင်နေသည်...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="duty-content"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
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
                      <AnimatePresence mode="wait">
                        {dutyError && (
                          <motion.p
                            key={dutyError}
                            variants={shakeX}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="text-red-500 text-[11px] font-nato font-medium text-center mt-3"
                          >
                            {dutyError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <motion.button
                        onClick={handleDutyStart}
                        disabled={dutyLoading}
                        whileTap={tapScale}
                        transition={springSnappy}
                        className="w-full px-16 py-4 text-white rounded-[8px] font-bold font-nato text-[12px] mt-5 bg-primary shadow-lg shadow-primary/25"
                      >
                        {content.dutySession.pupupBtn}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DutySession;
