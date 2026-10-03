import { useEffect, useState } from 'react'

const useCountdown = (deadline) => {
  const getTime = () => {
    const now = Date.now()
    const target = deadline instanceof Date ? deadline.getTime() : deadline?.toDate?.()?.getTime?.() || 0
    const diff = target - now
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      isExpired: false,
    }
  }

  const [time, setTime] = useState(getTime)

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), 1000)
    return () => clearInterval(id)
  }, [deadline])

  return time
}

export default useCountdown
