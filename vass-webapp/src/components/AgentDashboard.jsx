import React, { useEffect, useState } from 'react'
import styles from './AgentDashboard.module.css'
import CallLogs from './CallLogs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { apiRequest } from '../utils/api'

export default function AgentDashboard({ agentId }) {
  const [metrics, setMetrics] = useState({
    totalMinutes: '0',
    totalCalls: 0,
    totalCost: '0',
    avgCostPerCall: '0',
    name: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true) // Indicate loading state

      try {
        const data = await apiRequest(`agents/metrics/${agentId}`)

        if (data && data.success) {
          setMetrics(data.metrics)
        } else {
          setError(data.error || 'Error fetching metrics')
        }
      } catch (err) {
        setError(err.message || 'Network error')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [agentId])

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  return (
    <div className={styles.agentDashboard}>
      <h2>{metrics.name}</h2>
      <div className={styles.flex}>
        <div className={styles.box}>
          <h3>Total Call Minutes</h3>
          <p>{metrics.totalMinutes} min</p>
        </div>
        <div className={styles.box}>
          <h3>Number of Calls</h3>
          <p>{metrics.totalCalls}</p>
        </div>
        <div className={styles.box}>
          <h3>Total Spent</h3>
          <p>${metrics.totalCost}</p>
        </div>
        <div className={styles.box}>
          <h3>Average Cost per Call</h3>
          <p>${metrics.avgCostPerCall}</p>
        </div>
      </div>

      <div className={styles.moreDetails}>
        <h4 onClick={toggleDetails}>
          More Details{' '}
          <FontAwesomeIcon icon={showDetails ? faChevronUp : faChevronDown} />
        </h4>
        {showDetails && <CallLogs agentId={agentId} />}
      </div>
    </div>
  )
}
