import { useMemo, useState } from "react";
import { applyToJob } from "../api/botfilter";

function isValidGithubUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.toLowerCase() === "github.com" && u.pathname.split("/").filter(Boolean).length >= 2;
  } catch {
    return false;
  }
}

export default function JobItem({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const canSubmit = useMemo(() => {
    return Boolean(candidate?.uuid && candidate?.candidateId) && repoUrl.trim().length > 0 && !submitting;
  }, [candidate, repoUrl, submitting]);

  async function handleSubmit() {
    setOkMsg("");
    setErrMsg("");

    if (!candidate?.uuid || !candidate?.candidateId) {
      setErrMsg("First, fetch your candidate data (Step 2) using your email.");
      return;
    }

    const cleanUrl = repoUrl.trim();
    if (!cleanUrl) {
      setErrMsg("Please enter your GitHub repo URL.");
      return;
    }
    if (!isValidGithubUrl(cleanUrl)) {
      setErrMsg("Please enter a valid GitHub repository URL (e.g. https://github.com/user/repo).");
      return;
    }

    try {
      setSubmitting(true);
      const res = await applyToJob({
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        repoUrl: cleanUrl,
      });

      if (res?.ok === true) {
        setOkMsg("Application submitted ✅");
      } else {
        setOkMsg("Submitted ✅ (response format was unexpected, but request succeeded)");
      }
    } catch (e) {
      setErrMsg(e.message || "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.title}>{job.title}</div>

      <div style={styles.row}>
        <input
          style={styles.input}
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/tu-usuario/tu-repo"
        />
        <button style={styles.button} onClick={handleSubmit} disabled={!canSubmit}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {!candidate ? (
        <div style={styles.muted}>
          Tip: fetch candidate first, then you can submit applications.
        </div>
      ) : null}

      {errMsg ? <div style={styles.error}>⚠️ {errMsg}</div> : null}
      {okMsg ? <div style={styles.ok}>{okMsg}</div> : null}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    background: "white",
    boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
  },
  title: { fontWeight: 700, marginBottom: 8 },
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
  muted: { marginTop: 8, color: "#666", fontSize: 12 },
  error: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: "#fff3f3",
    border: "1px solid #ffd0d0",
  },
  ok: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: "#f1fff4",
    border: "1px solid #c9ffd6",
  },
};
