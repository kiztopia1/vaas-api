import React, { useState, useEffect } from 'react'
import styles from './Modal.module.css'

export default function Modal({ show, agent, onClose, onSave, onUpdateField }) {
  const [customFee, setCustomFee] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    setCustomFee(agent.fee !== 'Vapi default')
  }, [agent])

  const handleCustomFeeToggle = (isChecked) => {
    setCustomFee(isChecked)
    if (!isChecked) {
      onUpdateField('fee', null)
      onUpdateField('fee_type', null)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveError(null)

    try {
      await onSave(agent.id)
      setIsSaving(false)
      onClose()
    } catch {
      setIsSaving(false)
      setSaveError('Failed to save the agent. Please try again.')
    }
  }

  if (!show || !agent) return null

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <h2>Edit Agent: {agent.name}</h2>
        <form onSubmit={handleSave}>
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={agent.name}
              onChange={(e) => onUpdateField('name', e.target.value)}
            />
          </div>
          <div>
            <label>Agent ID: </label>
            <input
              type="text"
              value={agent.agent_id}
              onChange={(e) => onUpdateField('agent_id', e.target.value)}
            />
          </div>
          <div>
            <label>Private Key: </label>
            <input
              type="text"
              value={agent.private_key}
              onChange={(e) => onUpdateField('private_key', e.target.value)}
            />
          </div>
          <div>
            <label>Public Key: </label>
            <input
              type="text"
              value={agent.public_key}
              onChange={(e) => onUpdateField('public_key', e.target.value)}
            />
          </div>

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

          {customFee && (
            <>
              <div>
                <label>Fee: </label>
                <input
                  type="number"
                  value={agent.fee || ''}
                  onChange={(e) => onUpdateField('fee', Number(e.target.value))}
                  step="0.01"
                  placeholder="Enter fee"
                />
              </div>
              <div>
                <label>Fee Type: </label>
                <select
                  value={agent.fee_type || 'min'}
                  onChange={(e) => onUpdateField('fee_type', e.target.value)}
                >
                  <option value="min">Per Minute</option>
                  <option value="call">Per Call</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </form>

        {saveError && <p className={styles.error}>{saveError}</p>}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
