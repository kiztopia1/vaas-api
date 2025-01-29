import React, { useEffect, useState } from 'react'

import styles from './CallLogDetails.module.css'
import { apiRequest } from '../utils/api'

interface CallLogDetailsProps {
  agentId: string
  callId: string
}

export default function CallLogDetails({
  agentId,
  callId,
}: CallLogDetailsProps) {
  const [activeTab, setActiveTab] = useState<string>('logs')
  const [callDetails, setCallDetails] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCallLogDetails() {
      setLoading(true)
      try {
        const data = await apiRequest(
          `agents/call-log-details/${agentId}/${callId}`
        )

        if (data.success) {
          setCallDetails(data.callDetails)
          setError(null)
        } else {
          setError(data.error || 'Failed to fetch call details')
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching call details')
      } finally {
        setLoading(false)
      }
    }

    if (agentId && callId) {
      fetchCallLogDetails()
    }
  }, [agentId, callId])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  const { logs, transcript, analysis, messages, costBreakdown, summary } =
    callDetails

  return (
    <div className={`${styles.callLogDetails} ${styles.slideIn}`}>
      <header>
        <h2>Call Log Details</h2>
        <p>Call ID: {callId}</p>
      </header>

      {/* Recording Section */}
      <section className={styles.recordingStatus}>
        <h3>Recording</h3>
        <audio controls src={callDetails.recordingUrl} />
      </section>

      {/* Tab Navigation */}
      <nav className={styles.tabs}>
        {['logs', 'transcripts', 'analysis', 'messages', 'callCost'].map(
          (tab) => (
            <button
              key={tab}
              className={activeTab === tab ? styles.active : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </nav>

      {/* Tab Content */}
      <section className={styles.tabContent}>
        {activeTab === 'logs' && (
          <div className={styles.logsSection}>
            <h3>Logs</h3>
            {logs?.length ? (
              logs.map((log: any, index: number) => (
                <div key={index}>
                  <p>
                    {log.time} - {log.role}: {log.message}
                  </p>
                </div>
              ))
            ) : (
              <p>No logs available</p>
            )}
          </div>
        )}

        {activeTab === 'transcripts' && (
          <div className={styles.transcriptsSection}>
            <h3>Transcripts</h3>
            <pre>{transcript}</pre>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className={styles.analysisSection}>
            <h3>Analysis</h3>
            <p>{summary}</p>
            <p>Success Evaluation: {analysis?.successEvaluation}</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className={styles.messagesSection}>
            <h3>Messages</h3>
            {messages?.map((message: any, index: number) => (
              <div key={index}>
                <p>
                  {message.role} ({message.time}): {message.message}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'callCost' && (
          <div className={styles.costSection}>
            <h3>Cost Breakdown</h3>
            <div>Total Cost: ${costBreakdown?.total}</div>
            <div>
              STT: ${costBreakdown?.stt} <br />
              LLM: ${costBreakdown?.llm} <br />
              TTS: ${costBreakdown?.tts} <br />
              VAPI: ${costBreakdown?.vapi} <br />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
