const BASE_URL = import.meta.env.VITE_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // Leer respuesta de forma segura (a veces puede no ser JSON)
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// Step 2
export function getCandidateByEmail(email) {
  const qs = new URLSearchParams({ email }).toString();
  return request(`/api/candidate/get-by-email?${qs}`, { method: "GET" });
}

// Step 3
export function getJobs() {
  return request(`/api/jobs/get-list`, { method: "GET" });
}

// Step 5
export function applyToJob({ uuid, jobId, candidateId, repoUrl }) {
  return request(`/api/candidate/apply-to-job`, {
    method: "POST",
    body: JSON.stringify({ uuid, jobId, candidateId, repoUrl }),
  });
}
