import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie' // For managing cookies
import styles from './MainDashboard.module.css'
import Aside from '../components/Aside'
import AgentsDashboard from '../components/AgentsDashboard'
import UsersDetails from '../components/UsersDetails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import { apiRequest } from '../utils/api'

export default function MainDashboard() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUserAuth = async () => {
      const token = sessionStorage.getItem('auth_token') // Retrieve token from sessionStorage

      if (!token) {
        navigate('/login') // Redirect if token is missing
        return
      }

      try {
        const response = await apiRequest('user') // Call API utility

        const data = await response
        setUserData(data) // Store user data
      } catch (error) {
        console.error('Authentication error:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    checkUserAuth()
  }, [navigate])

  if (loading) {
    return <p>Loading...</p> // Show loading state while checking auth
  }

  if (!userData) {
    return null // Or redirect to login if user data is not available
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.aside}>
        <Aside />
      </div>
      <div className={styles.main}>
        <h1>
          Overview <FontAwesomeIcon icon={faChartPie} />
        </h1>

        <div className={styles.content}>
          <AgentsDashboard />
          <hr />
          <UsersDetails />
        </div>
      </div>
    </div>
  )
}
