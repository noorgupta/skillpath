import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRoadmaps, getRoadmapProgress, createRoadmap, deleteRoadmap } from "../api";

function Dashboard() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadRoadmaps = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const data = await getRoadmaps();
      const withProgress = await Promise.all(
        data.map(async (r) => {
          const progress = await getRoadmapProgress(r.id);
          return { ...r, progress };
        })
      );
      setRoadmaps(withProgress);
    } catch (err) {
      setError("Failed to load roadmaps. Is the backend running?");
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmaps(true);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createRoadmap({ title, description: description || null });
      setTitle("");
      setDescription("");
      loadRoadmaps();
    } catch (err) {
      setError("Failed to create roadmap.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRoadmap(id);
      loadRoadmaps();
    } catch (err) {
      setError("Failed to delete roadmap.");
    }
  };

  if (loading) return <div className="page"><p className="page-subtitle">Loading roadmaps…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <span className="eyebrow">SkillPath</span>
        <h1 className="page-title">Your learning roadmaps</h1>
        <p className="page-subtitle">Track what you're learning, one topic at a time.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleCreate} className="form-row" style={{ marginBottom: 40 }}>
        <input
          className="text-input"
          placeholder="Roadmap title, e.g. Learn FastAPI"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="text-input"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Create roadmap</button>
      </form>

      {roadmaps.length === 0 && (
        <div className="empty-state">No roadmaps yet — create your first one above.</div>
      )}

      {roadmaps.map((r) => (
        <div key={r.id} className="roadmap-card">
          <Link to={`/roadmap/${r.id}`}>
            <h3 className="roadmap-card-title">{r.title}</h3>
          </Link>
          {r.description && <p className="roadmap-card-desc">{r.description}</p>}

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${r.progress.percent_complete}%` }} />
          </div>

          <div className="roadmap-card-footer">
            <span className="progress-stat">
              {r.progress.completed_topics}/{r.progress.total_topics} topics · {r.progress.percent_complete}%
            </span>
            <button onClick={() => handleDelete(r.id)} className="btn-danger-text">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;