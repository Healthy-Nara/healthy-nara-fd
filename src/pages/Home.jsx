import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getDutySession, getDutyStatus } from "../services/dutyService";
import DutySession from "../components/sessions/DutySession";
import NonDutySession from "../components/sessions/NonDutySession";

function Home() {
  const [dutyData, setDutyData] = useState(null);
  const [activeDuty, setActiveDuty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDuty = async () => {
      try {
        const [data, status] = await Promise.all([
          getDutySession(),
          getDutyStatus(),
        ]);
        setDutyData(data);
        setActiveDuty(status?.activeDuty || null);
      } catch {
        setError("Duty အချက်အလက်များ ရယူ၍မရပါ");
      } finally {
        setLoading(false);
      }
    };

    fetchDuty();
  }, []);

  const hasDuty = dutyData?.length > 0;

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="skeleton"
          className="m-5 animate-pulse space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
        >
          <div className="flex justify-between items-center">
            <div className="w-[57px] h-[32px] bg-gray-200 rounded" />
            <div className="w-[100px] h-[32px] bg-gray-200 rounded-lg" />
          </div>
          <div className="w-full border-t border-gray-200 mt-6 pt-6 space-y-4">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="flex gap-5">
              <div className="h-24 bg-gray-200 rounded w-1/2" />
              <div className="h-24 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          key="error"
          className="flex flex-col items-center justify-center h-screen gap-4 px-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <p className="font-nato text-[14px] text-red-500 text-center">{error}</p>
          <motion.button
            onClick={() => window.location.reload()}
            whileTap={{ scale: 0.96 }}
            className="bg-primary px-6 py-3 text-white rounded-[8px] font-bold font-nato text-[12px] cursor-pointer shadow-lg shadow-primary/25"
          >
            ပြန်ကြိုးစားမယ်
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key={hasDuty ? "duty" : "non-duty"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {hasDuty ? (
            <DutySession dutyData={dutyData} activeDuty={activeDuty} />
          ) : (
            <NonDutySession />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Home;
