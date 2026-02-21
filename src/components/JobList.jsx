import JobItem from "./JobItem";

export default function JobList({ jobs, candidate }) {
  const safeJobs = Array.isArray(jobs) ? jobs : [];

  if (safeJobs.length === 0) {
    return <div style={{ color: "#666" }}>No positions found.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {safeJobs.map((job) => (
        <JobItem key={job.id} job={job} candidate={candidate} />
      ))}
    </div>
  );
}
