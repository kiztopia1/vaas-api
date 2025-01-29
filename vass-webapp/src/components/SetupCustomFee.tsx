import { useState } from "react";

export default function SetupCustomFee({ agentId }: { agentId: string }) {
  const [feeType, setFeeType] = useState<"min" | "call">("min");
  const [fee, setFee] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/setup-custom-fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
          feeType,
          customFee: true, // Always set customFee to true
          fee,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to save custom fee");
      }

      setSuccess(true);
      setError(null);
    } catch (err: any) {
      setSuccess(false);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Setup Custom Fee</h2>
      {success && <p>Custom fee saved successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSave}>
        <div>
          <label>
            Fee Type:
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value as "min" | "call")}
            >
              <option value="min">Per Minute</option>
              <option value="call">Per Call</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Fee Amount:
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              step="0.01"
              required
            />
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
