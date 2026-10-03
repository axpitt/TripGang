import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// No refund/cancellation policy exists — redirect to home
const CancellationPolicy = () => {
  const navigate = useNavigate()
  useEffect(() => { navigate('/', { replace: true }) }, [navigate])
  return null
}

export default CancellationPolicy
