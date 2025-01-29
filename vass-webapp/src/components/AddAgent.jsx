import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AddAgent.module.css'

export default function AddAgent() {
  const authToken = sessionStorage.getItem('auth_token') // Retrieve auth token

  const [privateKey, setPrivateKey] = useState(
    'da1276d5-5def-4f8f-a96d-5e5518ac4bf2'
  )
  const [publicKey, setPublicKey] = useState(
    '790b5d7f-195c-4954-b26a-4353c13b25ad'
  )
  const [agentId, setAgentId] = useState('986c5beb-04da-497b-8bda-1fa4b18c5113')
  const [agentName, setAgentName] = useState('') // Auto-filled from API
  const [customFee, setCustomFee] = useState(false)
  const [feeType, setFeeType] = useState('min')
  const [fee, setFee] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fetchingName, setFetchingName] = useState(false) // Track API request for name

  const navigate = useNavigate()

  // Fetch Assistant Name when Agent ID and Private Key are filled
  useEffect(() => {
    const fetchAgentName = async () => {
      if (agentId && privateKey) {
        setFetchingName(true)
        setError('')

        try {
          const response = await fetch(
            `https://api.vapi.ai/assistant/${agentId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${privateKey}`, // Use private key as auth
              },
            }
          )

          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch assistant name')
          }

          setAgentName(data.name) // Set agent name from API response
        } catch (err) {
          setAgentName('')
          setError('Error fetching agent name: ' + err.message)
        } finally {
          setFetchingName(false)
        }
      }
    }

    fetchAgentName()
  }, [agentId, privateKey])

  const handleAddAgent = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('http://localhost:8000/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Secure API request
        },
        body: JSON.stringify({
          private_key: privateKey,
          public_key: publicKey,
          agent_id: agentId,
          name: agentName, // Auto-filled field
          ...(customFee ? { fee_type: feeType, fee } : {}), // Only send fee if customFee is true
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add new agent')
      }

      setSuccess(true)
      setShowModal(false)
      setPrivateKey('')
      setPublicKey('')
      setAgentId('')
      setAgentName('')
      setCustomFee(false)
      setFee('')
      navigate(0) // Refresh the page
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCustomFeeToggle = (checked) => {
    setCustomFee(checked)
    if (!checked) {
      setFee('')
      setFeeType('min')
    }
  }

  return (
    <div>
      <h2>Add New Agent</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Agent added successfully!</p>}

      <div>
        <img
          src="/img/vapi.png"
          alt="vapi"
          width="100"
          height="30"
          onClick={() => setShowModal(true)}
          className={styles.clickableImage}
        />
      </div>

      {showModal && (
        <div className={styles.modal}>
          <form onSubmit={handleAddAgent} className={styles.modalContent}>
            <h3>ADD Your Vapi Agent</h3>

            <div>
              <label className={styles.label}>Agent ID:</label>
              <input
                type="text"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={styles.label}>Private Key:</label>
              <input
                type="text"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={styles.label}>Public Key:</label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={styles.label}>Agent Name:</label>
              <input
                type="text"
                value={fetchingName ? 'Fetching...' : agentName}
                onChange={(e) => setAgentName(e.target.value)}
                required
                disabled
              />
            </div>

            {/* Checkbox for custom fee */}
            <div>
              <label className={styles.custom}>
                <input
                  type="checkbox"
                  checked={customFee}
                  onChange={(e) => handleCustomFeeToggle(e.target.checked)}
                />
                Add Custom Fee
              </label>
            </div>

            {/* Show fee type and fee input if customFee is true */}
            {customFee && (
              <>
                <div>
                  <label className={styles.label}>Fee Type:</label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value)}
                  >
                    <option value="min">Per Minute</option>
                    <option value="call">Per Call</option>
                  </select>
                </div>
                <div>
                  <label className={styles.label}>Fee:</label>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    step="0.01"
                    placeholder="Enter fee"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className={styles.addButton}
              disabled={loading || fetchingName}
            >
              {loading ? 'Adding...' : 'Add Agent'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={styles.closeButton}
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
