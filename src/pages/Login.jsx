import { useState } from "react";
import { content } from "../data/data";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  popIn,
  springSnappy,
  shakeX,
  tapScale,
} from "../lib/animations";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const login = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("အကောင့်နာမည်နဲ့ NRC နံပါတ် ဖြည့်ပေးပါ");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(username, password);

      localStorage.setItem("token", data.token);
      navigate("/home");
    } catch (err) {
      const message =
        err.response?.status === 401
          ? "အကောင့်နာမည် သို့မဟုတ် NRC မှားနေပါတယ်"
          : "ဆာဗာချိတ်ဆက်မှု မအောင်မြင်ပါ။ နောက်မှ ထပ်ကြိုးစားပါ";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div
        className="fixed inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          className="h-screen w-full object-cover"
          src={content.login.background}
          alt="background"
        />
      </motion.div>

      <motion.div
        className="relative z-10 bg-white w-[90%] my-10 mx-auto rounded-[12px] border-[0.1px] border-[#D9D9D9] px-4 py-7"
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.15 }}
      >
        <motion.div variants={popIn} initial="hidden" animate="show">
          <img src={content.login.logo} alt="" className="w-[100px] h-[56px]" />
        </motion.div>

        <div className="mt-4">
          <h2 className="mt-3 text-secondry text-[16px] font-nato font-bold">
            {content.login.loginTitle}
          </h2>
          <p className="text-[12px] font-medium pt-2 font-nato text-[#4A494E]">
            {content.login.loginSubTitle}
          </p>
        </div>

        <div className="mt-10">
          <form className="flex flex-col gap-7">
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="text-secondry text-[10px] font-semibold font-nato">
                {content.login.nameLabel}
              </label>

              <input
                value={username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
                  setUsername(val);
                  setError("");
                }}
                type="text"
                placeholder="Nurse Aid နာမည်ထည့်ပါ"
                className={`p-4 outline-none border rounded-[6px] font-semibold text-[12px] font-nato transition-all duration-200 focus:border-secondry focus:shadow-[0_0_0_3px_rgba(72,160,216,0.15)] ${
                  error ? "border-red-500" : "border-[#D9D9D9]"
                }`}
              />
            </motion.div>

            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <label className="text-secondry text-[10px] font-semibold font-nato">
                {content.login.NRCLabel}
              </label>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setPassword(val);
                    setError("");
                  }}
                  type={showPassword ? "text" : "password"}
                  inputMode="numeric"
                  placeholder="NRC နံပါတ် ဂဏန်းများ ထည့်ပါ"
                  className={`p-4 pr-12 outline-none border rounded-[6px] font-semibold text-[12px] font-nato w-full transition-all duration-200 focus:border-secondry focus:shadow-[0_0_0_3px_rgba(72,160,216,0.15)] ${
                    error ? "border-red-500" : "border-[#D9D9D9]"
                  }`}
                />

                <button
                  type="button"
                  onClick={handleShowPassword}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-secondry active:scale-90 transition-transform"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                        <path d="M9.88 5.09A10.75 10.75 0 0 1 12 5c4.664 0 8.4 2.903 10 7a13.16 13.16 0 0 1-2.062 3.348" />
                        <path d="M6.61 6.61C4.55 7.9 2.94 9.77 2 12c1.6 4.097 5.336 7 10 7a10.7 10.7 0 0 0 4.31-.9" />
                      </g>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      >
                        <path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
                        <path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7" />
                      </g>
                    </svg>
                  )}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.p
                    key={error}
                    variants={shakeX}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="text-red-500 text-[11px] font-nato font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.button
                type="submit"
                onClick={login}
                disabled={loading}
                whileTap={loading ? undefined : tapScale}
                transition={springSnappy}
                className={`w-full py-4 text-white rounded-[8px] font-bold font-nato text-[12px] cursor-pointer transition-all ${
                  loading ? "bg-gray-400" : "bg-primary shadow-lg shadow-primary/25"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={loading ? "loading" : "idle"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="inline-block"
                  >
                    {loading ? "အကောင့်ထဲဝင်နေသည်..." : content.footer.loginBtn}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
