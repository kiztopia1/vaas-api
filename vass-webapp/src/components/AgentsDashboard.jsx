import React, { useEffect, useState } from 'react'
import styles from './AgentsDashboard.module.css'
import AddAgent from './AddAgent'
import Modal from './Modal'
import AgentDashboard from './AgentDashboard'

import { apiRequest } from '../utils/api'

export default function AgentsDashboard() {
  const [agents, setAgents] = useState([]) // Agents data
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState(null) // Error state
  const [selectedAgent, setSelectedAgent] = useState(null) // Agent to configure
  const [showModal, setShowModal] = useState(false) // Modal visibility

  const authToken = sessionStorage.getItem('auth_token') // Retrieve auth token

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await apiRequest('agents') // Call API utility

        const data = await response
        setAgents(data) // Set fetched agents
      } catch (err) {
        setError('Error fetching agents: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    if (authToken) fetchAgents()
  }, [authToken])

  const handleDeleteAgent = async (agentId) => {
    const response = await apiRequest(`agents/${agentId}`, 'DELETE')
    try {
      setAgents((prevAgents) =>
        prevAgents.filter((agent) => agent.id !== agentId)
      )
    } catch (err) {
      setError('Error deleting agent: ' + err.message)
    }
  }

  const handleConfigureAgent = (agent) => {
    setSelectedAgent({ ...agent }) // Clone agent object for updates
    setShowModal(true)
  }

  const handleSaveAgent = async () => {
    if (!selectedAgent) return

    try {
      const response = await apiRequest(`agents${selectedAgent.id}`, 'PUT')

      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === selectedAgent.id ? selectedAgent : agent
        )
      )
      setShowModal(false)
    } catch (err) {
      setError('Error updating agent: ' + err.message)
    }
  }

  const handleUpdateField = (field, value) => {
    setSelectedAgent((prevAgent) =>
      prevAgent
        ? { ...prevAgent, [field]: value !== null ? value : '' }
        : prevAgent
    )
  }

  const closeModal = () => {
    setShowModal(false)
  }

  if (loading) return <p>Loading agents...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <div className={styles.flex}>
        <div className={styles.main}>
          <h2 className={styles.heading}>Agents Dashboard</h2>
          <p className={styles.paragraph}>Total Agents: {agents.length}</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Agent Name</th>
                <th>Fee Type</th>
                <th>Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id}>
                  <td>{agent.name}</td>
                  <td>{agent.fee_type || 'min'}</td>
                  <td>{agent.fee || 'Vapi default'}</td>
                  <td>
                    <button
                      className={styles.button}
                      onClick={() => handleConfigureAgent(agent)}
                    >
                      Configure
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteAgent(agent.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <AddAgent />
        </div>

        {/* Modal for agent configuration */}
        {selectedAgent && (
          <Modal
            show={showModal}
            agent={selectedAgent}
            onClose={closeModal}
            onSave={handleSaveAgent}
            onUpdateField={handleUpdateField}
          />
        )}
      </div>

      {/* Individual Agent Details Section */}
      <div className="details">
        {agents.map((agent) => (
          <div className="agent" key={agent.id}>
            <AgentDashboard agentId={agent.id} />
          </div>
        ))}
      </div>
    </div>
  )
}
