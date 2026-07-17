import { useEffect, useState } from "react"
import axios from "axios"
import DutySession from "../sessions/DutySession"
import NonDutySession from "../sessions/NonDutySession"

function Home() {
    const [dutyData, setDutyData] = useState(null)
    const [loading, setLoading] = useState(true)

    const getDutySession = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await axios.get(import.meta.env.VITE_DUTY_API, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            console.log("Duty API:", response.data)

            setDutyData(response.data.data)
        } catch (err) {
            console.log("Duty API error:", err.response?.data || err.message)
            setDutyData(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getDutySession()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            {dutyData?.length > 0 ? <DutySession /> : <NonDutySession />}
        </div>
    )
}

export default Home