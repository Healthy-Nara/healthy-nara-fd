import React, { useState } from "react"
import { content } from "../../data/data"
import axios from "axios"
import { useNavigate } from "react-router"

function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loginError, setLoginError] = useState(false)
    const navigate = useNavigate()

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const login = async (e) => {
        e.preventDefault()

        try {
            const formData = {
                username: username,
                password: password,
            }

            if (!username || !password) {
                setLoginError(true)
                return
            }

            const response = await axios.post(import.meta.env.VITE_LOGIN_API, formData)

            console.log("Login success:", response.data)

            localStorage.setItem("token", response.data.data.token)
            navigate("/home")
        } catch (err) {
            console.log("Login error:", err.response?.data || err.message)
            setLoginError(true)
        }
    }

    return (
        <div>
            <div className="fixed inset-0">
                <img
                    className="h-screen w-full object-cover"
                    src={content.login.background}
                    alt="background"
                />
            </div>

            <div className="relative z-10 bg-white w-[90%] mt-10 mx-auto rounded-[12px] border-[0.1px] border-[#D9D9D9] px-4 py-7">
                <div>
                    <img
                        src={content.login.logo}
                        alt=""
                        className="w-[100px] h-[56px]"
                    />
                </div>

                <div className="mt-4">
                    <h2 className="mt-3 text-secondry text-[16px] font-nato font-bold">
                        {content.login.loginTitle}
                    </h2>
                    <p className="text-[12px] font-medium pt-2 font-nato w-[70%] text-[#4A494E]">
                        {content.login.loginSubTitle}
                    </p>
                </div>

                <div className="mt-10">
                    <form className="flex flex-col gap-7">
                        <div className="flex flex-col gap-2">
                            <label className="text-secondry text-[10px] font-semibold font-nato">
                                {content.login.nameLabel}
                            </label>

                            <input
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setLoginError(false)
                                }}
                                type="text"
                                placeholder="Nurse Aid နာမည်ထည့်ပါ"
                                className={`p-4 outline-none border rounded-[6px] font-semibold text-[12px] font-nato ${loginError ? "border-red-500" : "border-[#D9D9D9]"
                                    }`}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-secondry text-[10px] font-semibold font-nato">
                                {content.login.NRCLabel}
                            </label>

                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setLoginError(false)
                                    }}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="NRC နံပါတ် ဂဏန်းများ ထည့်ပါ"
                                    className={`p-4 pr-12 outline-none border rounded-[6px] font-semibold text-[12px] font-nato w-full ${loginError ? "border-red-500" : "border-[#D9D9D9]"
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={handleShowPassword}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-secondry"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
                                                <path d="M3 3l18 18" />
                                                <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
                                                <path d="M9.88 5.09A10.75 10.75 0 0 1 12 5c4.664 0 8.4 2.903 10 7a13.16 13.16 0 0 1-2.062 3.348" />
                                                <path d="M6.61 6.61C4.55 7.9 2.94 9.77 2 12c1.6 4.097 5.336 7 10 7a10.7 10.7 0 0 0 4.31-.9" />
                                            </g>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
                                                <path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
                                                <path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7" />
                                            </g>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* {loginError && (
                                <p className="text-red-500 text-[11px] font-nato font-medium">
                                    Username or password is wrong
                                </p>
                            )} */}
                        </div>
                    </form>
                </div>
            </div>

            <div className="absolute bg-white w-full mx-auto left-0 right-0 z-10 bottom-0 border-[0.1px] border-[#D9D9D9] p-4 text-center">
                <button
                    type="button"
                    onClick={login}
                    className="bg-primary w-full px-16 py-4 text-white rounded-[8px] font-bold font-nato text-[12px] cursor-pointer"
                >
                    {content.footer.loginBtn}
                </button>
            </div>
        </div>
    )
}

export default Login