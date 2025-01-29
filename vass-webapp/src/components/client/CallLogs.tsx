import React, { useEffect, useState } from "react";
import styles from "./CallLogs.module.css";
import CallLogDetails from "./CallLogDetails";

interface CallLog {
  id: string;
  assistant: string;
  type: string;
  cost: string;
  endedReason: string;
  phoneNumber: string;
  customer: string;
  startedAt: string;
  endedAt: string;
  duration: string;
}

interface CallLogsProps {
  agentId: string; // Agent ID prop
}

export default function CallLogs({ agentId }: CallLogsProps) {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null); // Store the selected log

  useEffect(() => {
    // Fetch call logs from the API
    async function fetchCallLogs() {
      try {
        const response = await fetch("/api/get-call-logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ agentId }), // Send the agentId to the API
        });
        const data = await response.json();
        if (data.success) {
          setCallLogs(data.callLogs);
        } else {
          setError("Failed to fetch call logs");
        }
      } catch (err) {
        setError("Error fetching call logs");
      } finally {
        setLoading(false);
      }
    }

    if (agentId) {
      fetchCallLogs(); // Fetch only when agentId is provided
    }
  }, [agentId]);

  const handleRowClick = (log: CallLog) => {
    setSelectedCallLog(log); // Set the selected call log when a row is clicked
  };

  const handleCloseDetails = () => {
    setSelectedCallLog(null); // Close the details view
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={styles.callLogs}>
      <h2>Call Logs</h2>

      {/* Display CallLogDetails if a call log is selected */}
      {selectedCallLog && (
        <div className={styles.callLogDetailsContainer}>
          <CallLogDetails
            agentId={agentId}
            callId={selectedCallLog.id} // Pass the call ID to the details component
            onClose={handleCloseDetails} // Close details on click
          />
        </div>
      )}

      <div className={styles.searchFilter}>
        <input
          type="text"
          placeholder="Search all columns or enter UUID..."
          className={styles.searchInput}
        />
        <button className={styles.filterButton}>Filter</button>
      </div>
      <table className={styles.callLogsTable}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Call ID</th>
            <th>Call Cost</th>
            <th>Ended Reason</th>
            <th>Assistant</th>
            <th>Phone Number</th>
            <th>Customer</th>
            <th>Call Times</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {callLogs.map((log) => (
            <tr
              key={log.id}
              onClick={() => handleRowClick(log)}
              className={styles.tableRow}
            >
              <td>{log.type}</td>
              <td>{log.id}</td>
              <td>${log.cost}</td>
              <td>{log.endedReason}</td>
              <td>{log.assistant}</td>
              <td>{log.phoneNumber || "No Number Connected"}</td>
              <td>{log.customer || "Empty"}</td>
              <td>
                {log.startedAt} - {log.endedAt}
              </td>
              <td>{log.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
