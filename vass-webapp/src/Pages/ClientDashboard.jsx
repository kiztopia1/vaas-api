import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // Replace Next.js router
import styles from './ClientDashboard.module.css'
import Aside from '../components/Aside'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import AgentDashboard from '../components/AgentDashboard'
import { apiRequest } from '../utils/api'

export default function ClientDashboard() {
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [agents, setAgents] = useState([])
  const navigate = useNavigate() // Replace useRouter

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
        setClientData(data) // Store user data
      } catch (error) {
        console.error('Authentication error:', error)
        // navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    checkUserAuth()
  }, [navigate])

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await apiRequest('agents') // Call API utility

        const data = await response
        setAgents(data.data) // Set fetched agents
      } catch (err) {
        setError('Error fetching agents: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  if (loading) {
    return <p>Loading...</p>
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

        <div className={styles.agentsList}>
          {agents.length > 0 ? (
            agents.map((agent) => (
              <AgentDashboard key={agent.id} agentId={agent.id} />
            ))
          ) : (
            <p>No agents found</p>
          )}
        </div>
      </div>
    </div>
  )
}
