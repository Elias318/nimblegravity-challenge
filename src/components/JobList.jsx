import JobItem from "./JobItem";

export default function JobList({ jobs, candidate }) {
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  if (safeJobs.length === 0) {
    return (
      <div className="mensaje-info">
        No hay posiciones disponibles.
      </div>
    );
  }

  return (
    <div className="lista-trabajos">
      {safeJobs.map((job) => (
        <JobItem key={job.id} job={job} candidate={candidate} />
      ))}
    </div>
  );
}
