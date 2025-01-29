import React, { useEffect, useState } from "react";
import styles from "./AgentDashboard.module.css";
import CallLogs from "./CallLogs";

export default function AgentDashboard({ agentId }: { agentId: string }) {
  const [metrics, setMetrics] = useState({
    totalMinutes: "0",
    totalCalls: 0,
    totalCost: "0",
    avgCostPerCall: "0",
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false); // State to toggle details

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/agent-metrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ agentId }), // Send the agentId in the request body
        });

        if (!response.ok) {
          throw new Error("Failed to fetch agent metrics");
        }

        const data = await response.json();
        if (data.success) {
          setMetrics(data.metrics);
        } else {
          setError("Error fetching metrics");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [agentId]);

  const toggleDetails = () => {
    setShowDetails(!showDetails); // Toggle the details visibility
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
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
      <CallLogs agentId={agentId} />
    </div>
  );
}
