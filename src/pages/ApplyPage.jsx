import { useEffect, useMemo, useState } from "react";
import { getCandidateByEmail, getJobs } from "../api/botfilter";
import JobList from "../components/JobList";

export default function ApplyPage() {
  // Estados Paso 2
  const [email, setEmail] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [candidateError, setCandidateError] = useState("");

  // Estados Paso 3
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState("");

  // Cargar posiciones al iniciar
  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        setLoadingJobs(true);
        setJobsError("");
        const data = await getJobs();
        if (!cancelled) setJobs(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled)
          setJobsError(e.message || "Error al cargar las posiciones.");
      } finally {
        if (!cancelled) setLoadingJobs(false);
      }
    }

    loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  // Obtener candidato por email
  async function handleFetchCandidate(e) {
    e.preventDefault();
    setCandidate(null);
    setCandidateError("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setCandidateError("Ingresá tu correo electrónico.");
      return;
    }

    try {
      setLoadingCandidate(true);
      const data = await getCandidateByEmail(cleanEmail);
      setCandidate(data);
    } catch (e) {
      setCandidateError(e.message || "No se encontró el candidato.");
    } finally {
      setLoadingCandidate(false);
    }
  }

  const candidateReady = useMemo(() => {
    return candidate?.uuid && candidate?.candidateId;
  }, [candidate]);

  return (
  <div className="page">
    <div className="card">
      <h1 className="titulo-principal">Postulación a Empleo</h1>

      <div className="mensaje-info">
        Obtener datos del candidato por correo.
      </div>

      <form onSubmit={handleFetchCandidate} className="fila">
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresá tu correo electrónico"
        />
        <button
          className="boton"
          type="submit"
          disabled={loadingCandidate}
        >
          {loadingCandidate ? "Cargando..." : "Obtener Candidato"}
        </button>
      </form>

      {candidateError && (
        <div className="mensaje-error">⚠️ {candidateError}</div>
      )}

      {candidate && (
        <div className="mensaje-info">
          <div><b>UUID:</b> {candidate.uuid}</div>
          <div><b>Candidate ID:</b> {candidate.candidateId}</div>
          <div><b>Nombre:</b> {candidate.firstName} {candidate.lastName}</div>
          <div><b>Correo:</b> {candidate.email}</div>
        </div>
      )}
    </div>

    <div className="card">
      <h2 className="titulo-secundario">Posiciones Abiertas</h2>

      {loadingJobs && (
        <div className="mensaje-info">Cargando posiciones...</div>
      )}

      {jobsError && (
        <div className="mensaje-error">⚠️ {jobsError}</div>
      )}

      {!loadingJobs && !jobsError && (
        <JobList jobs={jobs} candidate={candidateReady ? candidate : null} />
      )}
    </div>
  </div>
);
}