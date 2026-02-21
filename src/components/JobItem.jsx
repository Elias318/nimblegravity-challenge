import { useState } from "react";
import { applyToJob } from "../api/botfilter";

export default function JobItem({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    setMensaje("");
    setError("");

    if (!candidate) {
      setError("Primero obtené tus datos como candidato.");
      return;
    }

    if (!repoUrl.trim()) {
      setError("Ingresá la URL de tu repositorio.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await applyToJob({
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        repoUrl: repoUrl.trim(),
      });

      if (res?.ok) {
        setMensaje("Postulación enviada correctamente ✅");
      }
    } catch {
      setError("Error al enviar la postulación.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="trabajo">
      <h3>{job.title}</h3>

      <div className="fila">
        <input
          className="input"
          placeholder="https://github.com/tu-usuario/tu-repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />

        <button
          className="boton"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Enviando..." : "Enviar"}
        </button>
      </div>

      {error && <div className="mensaje-error">⚠️ {error}</div>}
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
    </div>
  );
}
