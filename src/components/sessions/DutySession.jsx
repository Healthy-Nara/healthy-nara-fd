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
  const [cleaningTime, setCleaningTime] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [diaperStatus, setDiaperStatus] = useState("");
  const [hasActivity, setHasActivity] = useState(null);
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [sleepTime, setSleepTime] = useState("");
  const [sleepDuration, setSleepDuration] = useState("");
  const [sleepPeriod, setSleepPeriod] = useState("");
  const [sleepDislike, setSleepDislike] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [todayReports, setTodayReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showNutritionForm, setShowNutritionForm] = useState(false)
  const [nutritionTime, setNutritionTime] = useState("")
  const [nutritionType, setNutritionType] = useState("")
  const [nutritionAmount, setNutritionAmount] = useState("")
  const [exerciseForm, setExerciseForm] = useState(false)
  const [exerciseTime, setExerciseTime] = useState("")
  const [exerciseType, setExerciseType] = useState("")
  const [incidentForm, setIncidentForm] = useState(false)
  const [incidentText, setIncidentText] = useState("")

  const bookingId = dutyData?.[0]?._id;
  const dutyLogId = activeDuty?._id;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const dateStr = new Date().toISOString().split("T")[0];
        const data = await getReports(dateStr);
        setTodayReports(data);
      } catch {
        /* ignore */
      }
    };
    fetchReports();
  }, []);

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
    date: new Date().toISOString(),
    status: "draft",
    feedingRecords: [],
    hygiene: {},
    sleepRecords: [],
    activities: [],
    abnormalities: "",
  });

  const findExistingReport = () => {
    return todayReports.find((r) => r.booking?._id === bookingId) || null;
  };

  const refreshReports = async () => {
    try {
      const dateStr = new Date().toISOString().split("T")[0];
      const data = await getReports(dateStr);
      setTodayReports(data);
    } catch {
      /* ignore */
    }
  };

  const hasHygiene = todayReports.some(
    (r) => r.hygiene && Object.keys(r.hygiene).length > 0
  );
  const hasFeeding = todayReports.some(
    (r) => r.feedingRecords?.length > 0
  );
  const hasSleep = todayReports.some(
    (r) => r.sleepRecords?.length > 0
  );
  const hasActivityRecord = todayReports.some(
    (r) => r.activities?.length > 0
  );
  const hasAbnormality = todayReports.some((r) => r.abnormalities);

  const handleHygieneSubmit = async () => {
    setReportLoading(true);
    setReportError("");
    try {
      const today = new Date();
      const [hours, minutes] = cleaningTime.split(":");
      const bathTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        Number(hours),
        Number(minutes)
      ).toISOString();

      const hygieneData = {
        bathTime,
        bathType: timePeriod === "wipe" ? "sponge_bath" : "bath",
        diaperChanges: Number(diaperStatus) || 0,
        rashCheck: hasActivity ?? false,
      };

      const existing = findExistingReport();
      if (existing) {
        await updateReport(existing._id, {
          ...existing,
          hygiene: hygieneData,
          status: "submitted",
        });
      } else {
        await createReport({
          ...buildBasePayload(),
          hygiene: hygieneData,
        });
      }

      setShowHygieneForm(false);
      setCleaningTime("");
      setTimePeriod("");
      setDiaperStatus("");
      setHasActivity(null);
      await refreshReports();
    } catch {
      setReportError("Report သွင်းခြင်း မအောင်မြင်ပါ");
    } finally {
      setReportLoading(false);
    }
  };

  const handleSleepSubmit = async () => {
    setReportLoading(true);
    setReportError("");
    try {
      const today = new Date();
      const [sh, sm] = sleepDuration.split(":");
      const [eh, em] = sleepPeriod.split(":");
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        Number(sh),
        Number(sm)
      );
      const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        Number(eh),
        Number(em)
      );

      const newSleepRecord = {
        type: sleepTime,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        onSchedule: sleepDislike ?? false,
      };

      const existing = findExistingReport();
      if (existing) {
        await updateReport(existing._id, {
          ...existing,
          sleepRecords: [...(existing.sleepRecords || []), newSleepRecord],
          status: "submitted",
        });
      } else {
        await createReport({
          ...buildBasePayload(),
          sleepRecords: [newSleepRecord],
        });
      }

      setShowSleepForm(false);
      setSleepTime("");
      setSleepDuration("");
      setSleepPeriod("");
      setSleepDislike(null);
      await refreshReports();
    } catch {
      setReportError("Report သွင်းခြင်း မအောင်မြင်ပါ");
    } finally {
      setReportLoading(false);
    }
  };

  const handleNutritionSubmit = async () => {
    setReportLoading(true)
    setReportError("")

    try {
      const today = new Date()
      const [hours, minutes] = nutritionTime.split(":")

      const feedingTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        Number(hours),
        Number(minutes)
      ).toISOString()

      const newFeedingRecord = {
        type: nutritionType,
        time: feedingTime,
        amount: nutritionAmount,
      }

      const existing = findExistingReport()

      if (existing) {
        await updateReport(existing._id, {
          ...existing,
          feedingRecords: [...(existing.feedingRecords || []), newFeedingRecord],
          status: "submitted",
        })
      } else {
        await createReport({
          ...buildBasePayload(),
          feedingRecords: [newFeedingRecord],
        })
      }

      setShowNutritionForm(false)
      setNutritionTime("")
      setNutritionType("")
      setNutritionAmount("")
      await refreshReports()
    } catch {
      setReportError("Nutrition report သွင်းခြင်း မအောင်မြင်ပါ")
    } finally {
      setReportLoading(false)
    }
  }

  const handleExerciseSubmit = async () => {
    setReportLoading(true)
    setReportError("")

    try {
      const newActivity = {
        name: exerciseType,
        time: exerciseTime,
      }

      const existing = findExistingReport()

      if (existing) {
        await updateReport(existing._id, {
          ...existing,
          activities: [...(existing.activities || []), newActivity],
          status: "submitted",
        })
      } else {
        await createReport({
          ...buildBasePayload(),
          activities: [newActivity],
        })
      }

      setExerciseForm(false)
      setExerciseTime("")
      setExerciseType("")
      await refreshReports()
    } catch {
      setReportError("Exercise report သွင်းခြင်း မအောင်မြင်ပါ")
    } finally {
      setReportLoading(false)
    }
  }

  const handleIncidentSubmit = async () => {
    setReportLoading(true)
    setReportError("")

    try {
      const existing = findExistingReport()

      if (existing) {
        await updateReport(existing._id, {
          ...existing,
          abnormalities: incidentText,
          status: "submitted",
        })
      } else {
        await createReport({
          ...buildBasePayload(),
          abnormalities: incidentText,
        })
      }

      setIncidentForm(false)
      setIncidentText("")
      await refreshReports()
    } catch {
      setReportError("Incident report သွင်းခြင်း မအောင်မြင်ပါ")
    } finally {
      setReportLoading(false)
    }
  }

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
          </button>

          {/* dutyout */}
          <button
            onClick={handleDutyFinish}
            disabled={finishLoading}
            className={`p-3 text-white rounded w-[50%] flex flex-col justify-center items-start gap-3 cursor-pointer ${finishLoading ? "bg-gray-400" : "bg-primary"
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
          </button>
          {finishError && (
            <p className="text-red-500 text-[11px] font-nato font-medium text-center mt-3">
              {finishError}
            </p>
          )}
        </div>
      </div>

      {/* today record log */}
      <div className="mt-8">
        <p className="font-poppins font-semibold text-[16px] mb-4">
          Today Record Log
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "hygiene", label: "သန့်ရှင်းရေး", has: hasHygiene },
            { key: "feeding", label: "အာဟာရ", has: hasFeeding },
            { key: "sleep", label: "အိပ်စက်ချိန်", has: hasSleep },
            { key: "activity", label: "ကိုယ်လက်လှုပ်ရှားမှု", has: hasActivityRecord },
            { key: "abnormality", label: "ထူးခြားဖြစ်စဉ်", has: hasAbnormality },
          ].map((cat) => (
            <button
              key={cat.key}
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
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-4 border border-[#D9D9D9] rounded-[12px] p-4">
            <p className="font-nato text-[14px] font-bold text-primary mb-3">
              {selectedCategory === "hygiene" && content.dutySession.recordLog.hygieneTitle}
              {selectedCategory === "sleep" && content.dutySession.recordLog.sleepTitle}
              {selectedCategory === "feeding" && content.dutySession.recordLog.feedingTitle}
              {selectedCategory === "activity" && content.dutySession.recordLog.activityTitle}
              {selectedCategory === "abnormality" && content.dutySession.recordLog.abnormalityTitle}
            </p>

            <div className="flex flex-col gap-2">
              {selectedCategory === "hygiene" &&
                todayReports
                  .filter((r) => r.hygiene && Object.keys(r.hygiene).length > 0)
                  .map((r) => (
                    <div key={r._id} className="flex flex-col gap-1">
                      {r.hygiene.bathTime && (
                        <div className="flex items-center justify-between font-nato text-[12px]">
                          <span className="flex items-center gap-2 text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {r.hygiene.bathType === "sponge_bath"
                              ? content.dutySession.recordLog.spongeLabel
                              : content.dutySession.recordLog.bathLabel}
                          </span>
                          <span className="text-gray-500">
                            {new Date(r.hygiene.bathTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                          </span>
                        </div>
                      )}
                      {r.hygiene.diaperChanges > 0 && (
                        <div className="flex items-center justify-between font-nato text-[12px]">
                          <span className="flex items-center gap-2 text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {content.dutySession.recordLog.diaperLabel}
                          </span>
                          <span className="text-gray-500">
                            {r.hygiene.diaperChanges} {content.dutySession.recordLog.times}
                          </span>
                        </div>
                      )}
                      {r.hygiene.rashCheck && (
                        <div className="flex items-center gap-2 font-nato text-[12px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span className="text-red-500 font-medium">
                            {content.dutySession.recordLog.rashLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              {selectedCategory === "hygiene" &&
                todayReports.filter((r) => r.hygiene && Object.keys(r.hygiene).length > 0).length === 0 && (
                  <p className="font-nato text-[12px] text-gray-400">
                    {content.dutySession.recordLog.noRecord}
                  </p>
                )}

              {selectedCategory === "sleep" &&
                todayReports
                  .filter((r) => r.sleepRecords?.length > 0)
                  .map((r) =>
                    r.sleepRecords.map((sr, i) => (
                      <div key={`${r._id}-${i}`} className="flex items-center justify-between font-nato text-[12px]">
                        <span className="flex items-center gap-2 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {sr.type === "day"
                            ? content.dutySession.recordLog.sleepDay
                            : content.dutySession.recordLog.sleepNight}
                          {" — "}
                          {new Date(sr.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                          {" - "}
                          {new Date(sr.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </span>
                        <span className="text-gray-500">
                          {sr.onSchedule
                            ? content.dutySession.recordLog.sleepOnSchedule
                            : content.dutySession.recordLog.sleepOffSchedule}
                        </span>
                      </div>
                    ))
                  )}
              {selectedCategory === "sleep" &&
                todayReports.filter((r) => r.sleepRecords?.length > 0).length === 0 && (
                  <p className="font-nato text-[12px] text-gray-400">
                    {content.dutySession.recordLog.noRecord}
                  </p>
                )}

              {selectedCategory === "feeding" &&
                todayReports
                  .filter((r) => r.feedingRecords?.length > 0)
                  .map((r) =>
                    r.feedingRecords.map((fr, i) => (
                      <div key={`${r._id}-${i}`} className="flex items-center justify-between font-nato text-[12px]">
                        <span className="flex items-center gap-2 text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {fr.type || "အာဟာရ"}
                        </span>
                        <span className="text-gray-500">
                          {fr.time && new Date(fr.time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                        </span>
                      </div>
                    ))
                  )}
              {selectedCategory === "feeding" &&
                todayReports.filter((r) => r.feedingRecords?.length > 0).length === 0 && (
                  <p className="font-nato text-[12px] text-gray-400">
                    {content.dutySession.recordLog.noRecord}
                  </p>
                )}

              {selectedCategory === "activity" &&
                todayReports
                  .filter((r) => r.activities?.length > 0)
                  .map((r) =>
                    r.activities.map((act, i) => (
                      <div key={`${r._id}-${i}`} className="flex items-center gap-2 font-nato text-[12px] text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {act.name || "ကိုယ်လက်လှုပ်ရှားမှု"}
                      </div>
                    ))
                  )}
              {selectedCategory === "activity" &&
                todayReports.filter((r) => r.activities?.length > 0).length === 0 && (
                  <p className="font-nato text-[12px] text-gray-400">
                    {content.dutySession.recordLog.noRecord}
                  </p>
                )}

              {selectedCategory === "abnormality" &&
                todayReports
                  .filter((r) => r.abnormalities)
                  .map((r) => (
                    <div key={r._id} className="flex items-center gap-2 font-nato text-[12px] text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {r.abnormalities}
                    </div>
                  ))}
              {selectedCategory === "abnormality" &&
                todayReports.filter((r) => r.abnormalities).length === 0 && (
                  <p className="font-nato text-[12px] text-gray-400">
                    {content.dutySession.recordLog.noRecord}
                  </p>
                )}
            </div>
          </div>
        )}
      </div>

      {/* record button */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-5 z-40">
        <button
          onClick={() => setShowRecordPopup(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#1cb89b] text-white py-4 rounded-lg font-nato text-[14px] font-semibold"
        >
          <ClipboardPlus />
          {content.dutySession.recordBtn}
        </button>
      </div>

      {/* record popup */}
      {showRecordPopup && (
        <div className="fixed inset-0 z-50 bg-white/100 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mt-10 mx-2 border-[1px] border-[#D9D9D9]">
            <div className="flex justify-between items-center px-6 pt-6 pb-2">
              <p className="font-bold font-nato text-[16px] text-secondry">
                {content.dutySession.recordPopup.title}
              </p>

              <button
                onClick={() => setShowRecordPopup(false)}
                className="text-secondry hover:text-blue-600 text-[22px] leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex flex-col items-start justify-center px-6 pb-6">
              <p className="font-nato text-[12px] font-medium leading-5 text-[#4A494E] text-start mb-2 w-[80%]">
                {content.dutySession.recordPopup.subtitle}
              </p>

              <div className="w-full flex flex-col gap-4">
                {content.dutySession.recordPopup.options.map((opt) => {
                  const Icon = recordIcons[opt.id]

                  return (
                    <button
                      key={opt.id}
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
                    </button>
                  )
                })}
              </div>

              <button
                disabled={!selectedRecord}
                onClick={handleRecordSubmit}
                className={`w-full mt-8 py-4 rounded-[8px] font-bold font-nato text-[12px] text-white cursor-pointer transition-colors ${selectedRecord ? "bg-primary" : "bg-gray-300"
                  }`}
              >
                {content.dutySession.recordPopup.submitBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* hygiene record form */}
      {showHygieneForm && (
        <div className="fixed inset-0 z-50 bg-white/100 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mt-10 mx-2 border-[1px] border-[#D9D9D9]">
            <div className="flex justify-between items-center px-6 pt-6 pb-2">
              <p className="font-bold font-nato text-[16px] text-secondry">
                {content.dutySession.hygieneRecord.title}
              </p>
              <button
                onClick={() => setShowHygieneForm(false)}
                className="text-secondry hover:text-blue-600 text-[20px] leading-none cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
              <p className="font-nato text-[13px] font-medium leading-5 text-gray-600 mb-6 w-[95%]">
                {content.dutySession.hygieneRecord.subtitle}
              </p>

              <div className="flex flex-col gap-5">
                {/* caregiver name */}
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    {content.dutySession.hygieneRecord.fields.cleaningTime}
                  </label>
                  <input
                    placeholder="အချိန်‌ထည့်မယ်"
                    // type="time"
                    value={cleaningTime}
                    onChange={(e) => setCleaningTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-black outline-none focus:border-primary placeholder:text-[#B3B3B380]"
                  />
                </div>

                {/* time period */}
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    {content.dutySession.hygieneRecord.fields.timePeriod}
                  </label>
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-black outline-none focus:border-primary appearance-none bg-white placeholder:text-[#B3B3B380]"
                  >
                    <option value="" disabled>
                      {content.dutySession.hygieneRecord.fields.timePeriodPlaceholder}
                    </option>
                    <option value="bath">ရေချိုးခြင်း</option>
                    <option value="wipe">ရေပတ်တိုက်ခြင်း</option>
                  </select>
                </div>

                {/* diaper status */}
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    {content.dutySession.hygieneRecord.fields.diaperStatus}
                  </label>
                  <input
                    type="text"
                    value={diaperStatus}
                    onChange={(e) => setDiaperStatus(e.target.value)}
                    placeholder={content.dutySession.hygieneRecord.fields.diaperPlaceholder}
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-black placeholder:text-[#B3B3B380] outline-none focus:border-primary"
                  />
                </div>

                {/* activity */}
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    {content.dutySession.hygieneRecord.fields.activityTitle}
                  </label>
                  <p className="font-nato text-[8px] font-medium text-gray-500 mb-3">
                    {content.dutySession.hygieneRecord.fields.activityNote}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setHasActivity(true)}
                      className={`flex-1 rounded-[10px] border font-nato text-[10px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-10 ${hasActivity === true
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-[#D9D9D9] text-[#D9D9D9] bg-white"
                        }`}
                    >
                      <span
                        className={`w-[15px] h-[15px] rounded-[3px] border-[1px] ${hasActivity === true
                          ? "border-primary bg-primary"
                          : "border-[#D9D9D9] bg-white"
                          }`}
                      ></span>

                      <span>{content.dutySession.hygieneRecord.fields.activityYes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasActivity(false)}
                      className={`flex-1 h-[64px] rounded-[10px] border font-nato text-[10px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-12 ${hasActivity === false
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-[#D9D9D9] text-[#D9D9D9] bg-white"
                        }`}
                    >
                      <span
                        className={`w-[15px] h-[15px] rounded-[3px] border-[1px] ${hasActivity === false
                          ? "border-primary bg-primary"
                          : "border-[#D9D9D9] bg-white"
                          }`}
                      ></span>

                      <span>{content.dutySession.hygieneRecord.fields.activityNo}</span>
                    </button>
                  </div>
                </div>
              </div>

              {reportError && (
                <p className="text-red-500 text-[11px] font-nato font-medium text-center mt-3">
                  {reportError}
                </p>
              )}
              <button
                onClick={handleHygieneSubmit}
                disabled={reportLoading}
                className={`w-full mt-5 py-4 rounded-[8px] font-bold font-nato text-[14px] text-white cursor-pointer transition-colors ${reportLoading ? "bg-gray-400" : "bg-primary"
                  }`}
              >
                {reportLoading ? "သွင်းနေသည်..." : content.dutySession.hygieneRecord.submitBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* sleep record form */}
      {showSleepForm && (
        <div className="fixed inset-0 z-50 bg-white/100 flex items-center justify-center p-4 backdrop-blur-sm" >
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mt-10 mx-2 border-[1px] border-[#D9D9D9]">
            <div className="flex justify-between items-center px-6 pt-6 pb-2">
              <p className="font-bold font-nato text-[16px] text-secondry">
                {content.dutySession.sleepRecord.title}
              </p>
              <button
                onClick={() => setShowSleepForm(false)}
                className="text-secondry hover:text-blue-600 text-[20px] leading-none cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
              <p className="font-nato text-[13px] font-medium leading-5 text-gray-600 mb-6 w-[95%]">
                {content.dutySession.sleepRecord.subtitle}
              </p>

              <div className="flex flex-col gap-5">
                {/* sleep time */}
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    {content.dutySession.sleepRecord.fields.sleepTime}
                  </label>
                  <select
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-gray-700 outline-none focus:border-primary appearance-none bg-white"
                  >
                    <option value="" disabled>
                      {content.dutySession.sleepRecord.fields.sleepTimePlaceholder}
                    </option>
                    <option value="day">နေ့ပိုင်း</option>
                    <option value="night">ညပိုင်း</option>
                  </select>
                </div>

                {/* sleep duration */}
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    {content.dutySession.sleepRecord.fields.sleepDuration}
                  </label>
                  <input
                    type="time"
                    value={sleepDuration}
                    onChange={(e) => setSleepDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-gray-700 outline-none focus:border-primary"
                  />
                </div>

                {/* sleep period */}
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    {content.dutySession.sleepRecord.fields.sleepPeriod}
                  </label>
                  <input
                    type="time"
                    value={sleepPeriod}
                    onChange={(e) => setSleepPeriod(e.target.value)}
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-gray-700 outline-none focus:border-primary"
                  />
                </div>

                {/* sleep dislike */}
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-3 block">
                    {content.dutySession.sleepRecord.fields.sleepDislike}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setHasActivity(true)}
                      className={`flex-1 rounded-[10px] border font-nato text-[10px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-10 ${hasActivity === true
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-[#D9D9D9] text-[#D9D9D9] bg-white"
                        }`}
                    >
                      <span
                        className={`w-[15px] h-[15px] rounded-[3px] border-[1px] ${hasActivity === true
                          ? "border-primary bg-primary"
                          : "border-[#D9D9D9] bg-white"
                          }`}
                      ></span>

                      <span>{content.dutySession.hygieneRecord.fields.activityYes}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHasActivity(false)}
                      className={`flex-1 h-[64px] rounded-[10px] border font-nato text-[10px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-12 ${hasActivity === false
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-[#D9D9D9] text-[#D9D9D9] bg-white"
                        }`}
                    >
                      <span
                        className={`w-[15px] h-[15px] rounded-[3px] border-[1px] ${hasActivity === false
                          ? "border-primary bg-primary"
                          : "border-[#D9D9D9] bg-white"
                          }`}
                      ></span>

                      <span>{content.dutySession.hygieneRecord.fields.activityNo}</span>
                    </button>
                  </div>
                </div>
              </div>

              {reportError && (
                <p className="text-red-500 text-[11px] font-nato font-medium text-center mt-3">
                  {reportError}
                </p>
              )}
              <button
                onClick={handleSleepSubmit}
                disabled={reportLoading}
                className={`w-full mt-8 py-4 rounded-[8px] font-bold font-nato text-[14px] text-white cursor-pointer transition-colors ${reportLoading ? "bg-gray-400" : "bg-primary"
                  }`}
              >
                {reportLoading ? "သွင်းနေသည်..." : content.dutySession.sleepRecord.submitBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* nutrition record form */}
      {showNutritionForm && (
        <div className="fixed inset-0 z-50 bg-white/100 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mt-10 mx-2 border-[1px] border-[#D9D9D9]">
            <div className="flex justify-between items-center px-6 pt-6 pb-2">
              <p className="font-bold font-nato text-[16px] text-secondry">
                {content.dutySession.nutritionRecord.title}
              </p>

              <button
                onClick={() => setShowNutritionForm(false)}
                className="text-secondry hover:text-blue-600 text-[20px] leading-none cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
              <p className="font-nato text-[13px] font-medium leading-5 text-gray-600 mb-6 w-[95%]">
                {content.dutySession.nutritionRecord.subtitle}
              </p>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    အချိန်
                  </label>
                  <input
                    type="time"
                    value={nutritionTime}
                    onChange={(e) => setNutritionTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-gray-700 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    အာဟာရအမျိုးအစား
                  </label>
                  <input
                    type="text"
                    value={nutritionType}
                    onChange={(e) => setNutritionType(e.target.value)}
                    placeholder="ဥပမာ - နို့ / ထမင်း / ဆေး"
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-gray-700 placeholder:text-[#B3B3B380] outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                    ပမာဏ
                  </label>
                  <input
                    type="text"
                    value={nutritionAmount}
                    onChange={(e) => setNutritionAmount(e.target.value)}
                    placeholder="ဥပမာ - ၁ ခွက် / ၁ ပန်းကန်"
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-gray-700 placeholder:text-[#B3B3B380] outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                onClick={handleNutritionSubmit}
                disabled={reportLoading}
                className={`w-full mt-8 py-4 rounded-[8px] font-bold font-nato text-[14px] text-white cursor-pointer transition-colors ${reportLoading ? "bg-gray-400" : "bg-primary"
                  }`}
              >
                {reportLoading ? "သွင်းနေသည်..." : content.dutySession.nutritionRecord.submitBtn}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* exercise record form */}
      {exerciseForm && (
        <div className="fixed inset-0 z-50 bg-white/100 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mt-10 mx-2 border-[1px] border-[#D9D9D9]">
            <div className="flex justify-between items-center px-6 pt-6 pb-2">
              <p className="font-bold font-nato text-[16px] text-secondry">
                {content.dutySession.exerciseRecord.title}
              </p>
              <button
                onClick={() => setExerciseForm(false)}
                className="text-secondry hover:text-blue-600 text-[20px] leading-none cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
              <p className="font-nato text-[13px] font-medium leading-5 text-gray-600 mb-6 w-[95%]">
                {content.dutySession.exerciseRecord.subtitle}
              </p>
            </div>


            <div className="flex flex-col px-6 gap-5">
              <div className="">
                <label className="font-nato text-[14px] font-semibold text-[#4AA3DF] mb-2 block">
                  {content.dutySession.exerciseRecord.fields.exerciseTime}
                </label>

                <input
                  type="time"
                  value={exerciseTime}
                  onChange={(e) => setExerciseTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-gray-700 outline-none focus:border-primary"
                />


                <div>
                  <label className="font-nato text-[14px] font-semibold text-[#4AA3DF] mb-2 block mt-5">
                    {content.dutySession.exerciseRecord.fields.exerciseType}
                  </label>

                  <select
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                    className="w-full px-4 py-3 rounded-[10px] border border-[#D9D9D9] font-nato text-[13px] text-gray-700 outline-none focus:border-primary"
                  >
                    <option value="" disabled>
                      လေ့ကျင့်ခန်း အမျိုးအစားရွေးချယ်ပါ
                    </option>
                    <option value="walking">လမ်းလျှောက်ခြင်း</option>
                    <option value="stretching">အကြောလျှော့ခြင်း</option>
                    <option value="hand_movement">လက်လှုပ်ရှားခြင်း</option>
                    <option value="leg_movement">ခြေထောက်လှုပ်ရှားခြင်း</option>
                  </select>
                </div>
              </div>

              {reportError && (
                <p className="text-red-500 text-[11px] font-nato font-medium text-center mt-3">
                  {reportError}
                </p>
              )}

              <button
                onClick={handleExerciseSubmit}
                disabled={reportLoading}
                className={`w-full mt-8 py-4 mb-5 rounded-[8px] font-bold font-nato text-[14px] text-white cursor-pointer transition-colors ${reportLoading ? "bg-gray-400" : "bg-primary"
                  }`}
              >
                {reportLoading ? "သွင်းနေသည်..." : content.dutySession.exerciseRecord.submitBtn}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* incident record form */}
      {incidentForm && (
        <div className="fixed inset-0 z-50 bg-white/100 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden mt-10 mx-2 border-[1px] border-[#D9D9D9]">
            <div className="flex justify-between items-center px-6 pt-6 pb-2">

              <p className="font-bold font-nato text-[16px] leading-8 text-secondry">
                {content.dutySession.incident.title}
              </p>
              <button
                onClick={() => setIncidentForm(false)}
                className="text-secondry hover:text-blue-600 text-[20px] leading-none cursor-pointer font-bold"
              >
                ✕
              </button>

            </div>
            <div className="flex-1 flex flex-col px-6 pb-5 overflow-y-auto">
              <p className="font-nato text-[13px] font-medium leading-5 text-gray-600 w-[95%]">
                {content.dutySession.incident.subtitle}
              </p>
            </div>

            <div className="flex flex-col px-6 pb-6">
              <div>
                <label className="font-nato text-[10px] font-semibold text-secondry mb-2 block">
                  {content.dutySession.incident.fields.incidentNote}
                </label>

                <textarea
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  placeholder={content.dutySession.incident.fields.incidentNotePlaceholder}
                  rows="6"
                  className="w-full px-5 py-4 rounded-[8px] border border-[#D9D9D9] font-nato text-[10px] text-gray-700 placeholder:text-[#D9D9D9] outline-none focus:border-[#4AA3DF] resize-none"
                />
              </div>

              {reportError && (
                <p className="text-red-500 text-[11px] font-nato font-medium text-center mt-3">
                  {reportError}
                </p>
              )}

              <button
                onClick={handleIncidentSubmit}
                disabled={reportLoading}
                className={`w-full mt-8 py-4 mb-5 rounded-[8px] font-bold font-nato text-[14px] text-white cursor-pointer transition-colors ${reportLoading ? "bg-gray-400" : "bg-primary"
                  }`}
              >
                {reportLoading ? "သွင်းနေသည်..." : content.dutySession.incident.submitBtn}
              </button>
            </div>
          </div>
        </div>
      )}

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
