import React, { useEffect, useState } from "react";
import styles from "./callLogDetails.module.css";

interface CallLogDetailsProps {
  agentId: string;
  callId: string;
  onClose: () => void; // Callback to close the modal
}

export default function CallLogDetails({
  agentId,
  callId,
  onClose,
}: CallLogDetailsProps) {
  const [activeTab, setActiveTab] = useState<string>("logs");
  const [callDetails, setCallDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the call log details from the API
    async function fetchCallLogDetails() {
      try {
        const response = await fetch(`/api/get-call-log-details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ agentId, callId }),
        });

        const data = await response.json();

        if (data.success) {
          setCallDetails(data.callDetails);
          console.log(data.callDetails);
          setError(null);
        } else {
          setError("Failed to fetch call details");
        }
      } catch (err) {
        setError("Error fetching call details");
      } finally {
        setLoading(false);
      }
    }

    fetchCallLogDetails();
  }, [agentId, callId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const { logs, transcript, analysis, messages, summary } = callDetails;

  return (
    <div className={`${styles.callLogDetails} ${styles.slideIn}`}>
      <header>
        <h2>Call Log Details</h2>
        <p>Call ID: {callId}</p>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </header>

      {/* Recording Status */}
      <section className={styles.recordingStatus}>
        <h3>Recording</h3>
        <audio controls src={callDetails.recordingUrl} />
      </section>

      {/* Tab Navigation */}
      <nav className={styles.tabs}>
        <button
          className={activeTab === "logs" ? styles.active : ""}
          onClick={() => setActiveTab("logs")}
        >
          Logs
        </button>
        <button
          className={activeTab === "transcripts" ? styles.active : ""}
          onClick={() => setActiveTab("transcripts")}
        >
          Transcripts
        </button>
        <button
          className={activeTab === "analysis" ? styles.active : ""}
          onClick={() => setActiveTab("analysis")}
        >
          Analysis
        </button>
        <button
          className={activeTab === "messages" ? styles.active : ""}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
        {/* <button
          className={activeTab === "callCost" ? styles.active : ""}
          onClick={() => setActiveTab("callCost")}
        >
          Call Cost
        </button> */}
      </nav>

      {/* Render content based on active tab */}
      <section className={styles.tabContent}>
        {activeTab === "logs" && (
          <div className={styles.logsSection}>
            <h3>Logs</h3>
            <div className={styles.log}>
              {logs && Array.isArray(logs) && logs.length > 0 ? (
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
          </div>
        )}

        {activeTab === "transcripts" && (
          <div className={styles.transcriptsSection}>
            <h3>Transcripts</h3>
            <pre>{transcript}</pre>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className={styles.analysisSection}>
            <h3>Analysis</h3>
            <p>{summary}</p>
            <p>Success Evaluation: {analysis.successEvaluation}</p>
          </div>
        )}

        {activeTab === "messages" && (
          <div className={styles.messagesSection}>
            <h3>Messages</h3>
            {messages.map((message: any, index: number) => (
              <div key={index}>
                <p>
                  {message.role} ({message.time}): {message.message}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* {activeTab === "callCost" && (
          <div className={styles.costSection}>
            <h3>Cost Breakdown</h3>
            <div>Total Cost: ${costBreakdown.total}</div>
            <div>
              STT: ${costBreakdown.stt} <br />
              LLM: ${costBreakdown.llm} <br />
              TTS: ${costBreakdown.tts} <br />
              VAPI: ${costBreakdown.vapi} <br />
            </div>
          </div>
        )} */}
      </section>
    </div>
  );
}
