import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Droplets, Bed, UtensilsCrossed, Hand, CircleAlert, LogIn, LogOut } from "lucide-react";
import { getReports, getAllReports } from "../../services/reportService";
import { getDutyLogs } from "../../services/dutyService";
import { content } from "../../data/data";
import { tapScale, easeOutExpo, modalBackdrop, modalPanelCenter, springSnappy } from "../../lib/animations";

const categoryMeta = {
  "Personal Hygiene": {
    label: "တစ်ကိုယ်ရည် သန့်ရှင်းရေး",
    Icon: Droplets,
  },
  "Nutrition and Feeding": {
    label: "အာဟာရတိုက်ကျွေးခြင်း",
    Icon: UtensilsCrossed,
  },
  "Sleeping": {
    label: "ကလေးအိပ်စက်ချိန်",
    Icon: Bed,
  },
  "Activity and exercise": {
    label: "ကိုယ်လက် လှုပ်ရှားမှု",
    Icon: Hand,
  },
  "Analysis and Unusual Findings": {
    label: "ထူးခြားဖြစ်စဉ်",
    Icon: CircleAlert,
  },
};

const formatDateToBadge = (dateObj) => {
  const d = new Date(dateObj);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear().toString().slice(-2);
  return `${day} / ${month} / ${year}`;
};

const formatTimeTo12Hour = (dateOrStr) => {
  if (!dateOrStr) return "-";
  if (typeof dateOrStr === "string" && (dateOrStr.includes("AM") || dateOrStr.includes("PM"))) {
    return dateOrStr;
  }
  const d = new Date(dateOrStr);
  if (isNaN(d.getTime())) {
    return dateOrStr;
  }
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours} : ${minutes} ${ampm}`;
};

export default function RecordHistoryView({
  bookingId,
  currentDateStr,
  activeDuty,
  onClose,
}) {
  const [viewMode, setViewMode] = useState("detail");
  const [selectedDate, setSelectedDate] = useState(
    currentDateStr || new Date().toISOString().split("T")[0]
  );
  const [allReports, setAllReports] = useState([]);
  const [detailReports, setDetailReports] = useState([]);
  const [currentDutyLog, setCurrentDutyLog] = useState(null);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const dateInputRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reports, logs] = await Promise.all([
          getAllReports(bookingId).catch(() => []),
          getDutyLogs(null, bookingId).catch(() => []),
        ]);
        setAllReports(reports || []);
      } catch {
        /* ignore */
      }
    };
    fetchAll();
  }, [bookingId]);

  useEffect(() => {
    const fetchDateData = async () => {
      if (!selectedDate) return;
      setLoading(true);
      try {
        const [reports, logs] = await Promise.all([
          getReports(selectedDate, bookingId).catch(() => []),
          getDutyLogs(selectedDate, bookingId).catch(() => []),
        ]);
        setDetailReports(reports || []);
        const matchedLog = (logs && logs.length > 0) ? logs[0] : null;
        setCurrentDutyLog(matchedLog);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchDateData();
  }, [selectedDate, bookingId]);

  const dateList = Array.from(
    new Set([
      selectedDate,
      ...allReports.map((r) =>
        r.date ? new Date(r.date).toISOString().split("T")[0] : null
      ).filter(Boolean),
    ])
  ).sort((a, b) => new Date(b) - new Date(a));

  const handleSelectDate = (dateStr) => {
    setSelectedDate(dateStr);
    setViewMode("detail");
  };

  const handleDatePickerChange = (e) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
      setViewMode("detail");
    }
  };

  const formattedSelectedBadge = formatDateToBadge(selectedDate);

  // Live Duty Start and End times from API
  const dutyStartTime = currentDutyLog?.dutyStart
    ? formatTimeTo12Hour(currentDutyLog.dutyStart)
    : activeDuty?.dutyStart && selectedDate === new Date().toISOString().split("T")[0]
    ? formatTimeTo12Hour(activeDuty.dutyStart)
    : "-";

  const dutyEndTime = currentDutyLog?.dutyEnd
    ? formatTimeTo12Hour(currentDutyLog.dutyEnd)
    : (currentDutyLog?.status === "active" || (activeDuty?.status === "active" && selectedDate === new Date().toISOString().split("T")[0]))
    ? "တာဝန်ထမ်းဆောင်ဆဲ"
    : "-";

  const records = detailReports.flatMap((r) => r.records || []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-nato bg-white">
      {/* Background Pattern like Home page */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <img
          className="h-full w-full object-cover opacity-90"
          src={content.login.background}
          alt="background"
        />
      </div>

      <div className="min-h-screen w-full px-5 pt-4 pb-8 flex flex-col">
        <AnimatePresence mode="wait">
          {viewMode === "detail" ? (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25, ease: easeOutExpo }}
              className="flex-1 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9] mb-4">
                <button
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-2 text-gray-900 font-bold text-[16px] sm:text-[17px] cursor-pointer active:opacity-70"
                >
                  <ArrowLeft size={18} />
                  <span className="font-poppins">{formattedSelectedBadge}</span>{" "}
                  <span>Duty မှတ်တမ်း</span>
                </button>

                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-700 text-[13px] font-bold px-2 py-1 cursor-pointer"
                >
                  ပိတ်မည်
                </button>
              </div>

              {/* Top Timing Summary Card */}
              <div className="bg-white border border-[#D9D9D9] rounded-[16px] p-4 grid grid-cols-2 divide-x divide-gray-200 mb-4 shadow-sm">
                <div className="flex flex-col items-center justify-center pr-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-[6px] bg-[#1cb89b] text-white flex items-center justify-center shrink-0">
                      <LogIn size={13} strokeWidth={2.5} />
                    </div>
                    <span className="font-poppins font-bold text-[14px] sm:text-[15px] text-gray-950">
                      {dutyStartTime}
                    </span>
                  </div>
                  <span className="text-[12px] font-bold text-gray-800">
                    Duty စဝင်ချိန်
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center pl-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-[6px] bg-[#1cb89b] text-white flex items-center justify-center shrink-0">
                      <LogOut size={13} strokeWidth={2.5} />
                    </div>
                    <span className="font-poppins font-bold text-[14px] sm:text-[15px] text-gray-950">
                      {dutyEndTime}
                    </span>
                  </div>
                  <span className="text-[12px] font-bold text-gray-800">
                    Duty ထွက်ချိန်
                  </span>
                </div>
              </div>

              {/* Records List for this Date */}
              <div className="flex-1 flex flex-col gap-2.5">
                {loading ? (
                  <div className="py-12 text-center text-gray-400 text-[13px]">
                    မှတ်တမ်းများ ရယူနေပါသည်...
                  </div>
                ) : records.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-[13px] bg-white/80 rounded-2xl border border-dashed border-gray-200">
                    ဤရက်စွဲအတွက် မှတ်တမ်းသွင်းထားခြင်း မရှိသေးပါ
                  </div>
                ) : (
                  records.map((rec, index) => {
                    const meta =
                      categoryMeta[rec.category] || {
                        label: rec.category || "မှတ်တမ်း",
                        Icon: CircleAlert,
                      };
                    const Icon = meta.Icon;

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={tapScale}
                        onClick={() => setSelectedRecordDetail(rec)}
                        transition={{ delay: index * 0.04, duration: 0.25 }}
                        className="w-full bg-[#eaf8f5] hover:bg-[#d8f3ec] rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between shadow-xs border border-[#1cb89b]/20 cursor-pointer active:scale-98 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[8px] bg-[#1cb89b] text-white flex items-center justify-center shrink-0">
                            <Icon size={16} strokeWidth={2.2} />
                          </div>
                          <span className="font-bold text-[13px] sm:text-[14px] text-gray-900">
                            {meta.label}
                          </span>
                        </div>

                        <span className="font-poppins font-semibold text-[12px] sm:text-[13px] text-gray-900">
                          {formatTimeTo12Hour(rec.time)}
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25, ease: easeOutExpo }}
              className="flex-1 flex flex-col"
            >
              {/* Header with Title & Date Select Button */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D9D9D9] mb-4">
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-gray-900 font-bold text-[17px] sm:text-[18px] cursor-pointer active:opacity-70"
                >
                  <ArrowLeft size={20} />
                  <span>Record မှတ်တမ်းများ</span>
                </button>

                <button
                  onClick={() => dateInputRef.current?.showPicker ? dateInputRef.current.showPicker() : dateInputRef.current?.click()}
                  className="px-3 py-1.5 border border-[#1cb89b] text-[#1cb89b] bg-[#e6f7f4] font-nato font-bold text-[12px] rounded-[8px] cursor-pointer hover:bg-primary/15 active:scale-98 transition-all"
                >
                  ရက်စွဲရွေးမယ်
                </button>
                <input
                  ref={dateInputRef}
                  type="date"
                  onChange={handleDatePickerChange}
                  className="hidden opacity-0 pointer-events-none absolute"
                />
              </div>

              {/* Date Cards List */}
              <div className="flex flex-col gap-3">
                {dateList.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 text-[13px] bg-white/80 rounded-2xl border border-dashed border-gray-200">
                    မှတ်တမ်းများ မရှိသေးပါ
                  </div>
                ) : (
                  dateList.map((dStr, idx) => {
                    const badgeText = formatDateToBadge(dStr);

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.25 }}
                        className="bg-white border border-[#D9D9D9] rounded-[16px] p-4 flex items-center justify-between shadow-sm"
                      >
                        <span className="font-bold text-[14px] sm:text-[15px] text-gray-900">
                          <span className="font-poppins">{badgeText}</span>{" "}
                          <span>Duty မှတ်တမ်း</span>
                        </span>

                        <motion.button
                          whileTap={tapScale}
                          onClick={() => handleSelectDate(dStr)}
                          className="px-3.5 py-1 border border-[#1cb89b] text-[#1cb89b] bg-[#e6f7f4] font-nato font-bold text-[12px] rounded-[8px] cursor-pointer hover:bg-primary/15 active:scale-98 transition-all"
                        >
                          ကြည့်မယ်
                        </motion.button>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Record Detail Modal */}
        <AnimatePresence>
          {selectedRecordDetail && (
            <motion.div
              key="record-detail-modal"
              variants={modalBackdrop}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setSelectedRecordDetail(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                variants={modalPanelCenter}
                initial="hidden"
                animate="show"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[360px] bg-white rounded-[20px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col p-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      const meta =
                        categoryMeta[selectedRecordDetail.category] || {
                          label: selectedRecordDetail.category || "မှတ်တမ်း",
                          Icon: CircleAlert,
                        };
                      const Icon = meta.Icon;
                      return (
                        <>
                          <div className="w-8 h-8 rounded-[8px] bg-[#1cb89b] text-white flex items-center justify-center shrink-0">
                            <Icon size={16} strokeWidth={2.2} />
                          </div>
                          <p className="font-bold font-nato text-[15px] text-gray-900">
                            {meta.label}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => setSelectedRecordDetail(null)}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold transition-all cursor-pointer text-[13px]"
                  >
                    ✕
                  </button>
                </div>

                {/* Time row */}
                <div className="flex items-center justify-between bg-[#f0fbf8] border border-[#1cb89b]/25 rounded-[10px] px-3.5 py-2 mb-4">
                  <span className="font-nato text-[12px] font-bold text-[#1cb89b]">
                    မှတ်တမ်းသွင်းချိန်
                  </span>
                  <span className="font-poppins font-bold text-[13px] text-gray-900">
                    {formatTimeTo12Hour(selectedRecordDetail.time)}
                  </span>
                </div>

                {/* Description details */}
                <div className="mb-5">
                  <p className="font-nato text-[12px] font-bold text-gray-500 mb-1.5">
                    မှတ်တမ်း အသေးစိတ်
                  </p>
                  <div className="bg-[#f8fafc] border border-gray-200 rounded-[12px] p-3.5 min-h-[90px] max-h-[220px] overflow-y-auto">
                    <p className="font-nato text-[13px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {selectedRecordDetail.desc || "အသေးစိတ် ဖော်ပြချက် မရှိပါ"}
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <motion.button
                  whileTap={tapScale}
                  transition={springSnappy}
                  onClick={() => setSelectedRecordDetail(null)}
                  className="w-full bg-[#1cb89b] text-white font-nato font-bold text-[13px] py-3 rounded-[12px] shadow-md shadow-primary/20 hover:bg-[#18a48a] transition-all cursor-pointer"
                >
                  ပိတ်မည်
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
