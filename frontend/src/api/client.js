const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function getJSON(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

export function fetchProjets() {
  return getJSON('/api/projets/');
}

export function fetchProjet(slug) {
  return getJSON(`/api/projets/${slug}/`);
}

export function fetchStats() {
  return getJSON('/api/stats/');
}

export function fetchServices() {
  return getJSON('/api/services/');
}

export function fetchCompetences() {
  return getJSON('/api/competences/');
}

export function fetchExperiences() {
  return getJSON('/api/experiences/');
}

export function fetchArticles() {
  return getJSON('/api/articles/');
}

export function fetchArticle(slug) {
  return getJSON(`/api/articles/${slug}/`);
}

export async function postDemande(payload) {
  const response = await fetch(`${API_BASE}/api/demandes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error('Validation échouée');
    error.fields = data;
    throw error;
  }
  return data;
}

export function mediaUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_BASE}${path}`;
}
