import { useEffect, useMemo, useState } from "react";
import { getCandidateByEmail, getJobs } from "../api/botfilter";
import JobList from "../components/JobList";

export default function ApplyPage() {
  // Step 2 states
  const [email, setEmail] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [candidateError, setCandidateError] = useState("");

  // Step 3 states
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState("");

  // Load jobs on mount (Step 3)
  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        setLoadingJobs(true);
        setJobsError("");
        const data = await getJobs();
        if (!cancelled) setJobs(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setJobsError(e.message || "Error loading jobs.");
      } finally {
        if (!cancelled) setLoadingJobs(false);
      }
    }

    loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  // Step 2 action
  async function handleFetchCandidate(e) {
    e.preventDefault();
    setCandidate(null);
    setCandidateError("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setCandidateError("Please enter your email.");
      return;
    }

    try {
      setLoadingCandidate(true);
      const data = await getCandidateByEmail(cleanEmail);
      setCandidate(data);
    } catch (e) {
      setCandidateError(e.message || "Candidate not found.");
    } finally {
      setLoadingCandidate(false);
    }
  }

  const candidateReady = useMemo(() => {
    return candidate?.uuid && candidate?.candidateId;
  }, [candidate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Job Application</h1>

        {/* Step 2 */}
        <div style={{ marginTop: 8, marginBottom: 12, color: "#555" }}>
          Step 2: Fetch candidate data by email (uuid + candidateId).
        </div>

        <form onSubmit={handleFetchCandidate} style={styles.row}>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button style={styles.button} type="submit" disabled={loadingCandidate}>
            {loadingCandidate ? "Loading..." : "Get Candidate"}
          </button>
        </form>

        {candidateError ? <div style={styles.error}>⚠️ {candidateError}</div> : null}

        {candidate ? (
          <div style={styles.infoBox}>
            <div><b>uuid:</b> {candidate.uuid}</div>
            <div><b>candidateId:</b> {candidate.candidateId}</div>
            <div><b>applicationId:</b> {candidate.applicationId}</div>
            <div><b>name:</b> {candidate.firstName} {candidate.lastName}</div>
            <div><b>email:</b> {candidate.email}</div>
          </div>
        ) : (
          <div style={styles.muted}>
            Enter your email and click “Get Candidate”.
          </div>
        )}
      </div>

      <div style={styles.card}>
        {/* Step 4 */}
        <h2 style={styles.h2}>Open Positions</h2>
        <div style={{ marginTop: 6, marginBottom: 12, color: "#555" }}>
          Step 3/4: Load jobs from API, enter repo URL per job, submit application.
        </div>

        {loadingJobs ? <div style={styles.muted}>Loading jobs...</div> : null}
        {jobsError ? <div style={styles.error}>⚠️ {jobsError}</div> : null}

        {!loadingJobs && !jobsError ? (
          <JobList jobs={jobs} candidate={candidateReady ? candidate : null} />
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 900,
    margin: "40px auto",
    padding: "0 16px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  card: {
    border: "1px solid #e6e6e6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    background: "white",
    boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
  },
  h1: { margin: "0 0 8px 0" },
  h2: { margin: "0 0 8px 0" },
  row: { display: "flex", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#f7f7f7",
    cursor: "pointer",
  },
  error: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    background: "#fff3f3",
    border: "1px solid #ffd0d0",
  },
  infoBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    background: "#f6fbff",
    border: "1px solid #cfe8ff",
    lineHeight: 1.6,
  },
  muted: { marginTop: 12, color: "#666" },
};
