import { useEffect, useState } from "react";
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

  if (loading) {
    return (
      <div className="m-5 animate-pulse space-y-4">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 px-5">
        <p className="font-nato text-[14px] text-red-500 text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary px-6 py-3 text-white rounded-[8px] font-bold font-nato text-[12px] cursor-pointer"
        >
          ပြန်ကြိုးစားမယ်
        </button>
      </div>
    );
  }

  return (
    <div>{dutyData?.length > 0 ? <DutySession dutyData={dutyData} activeDuty={activeDuty} /> : <NonDutySession />}</div>
  );
}

export default Home;
