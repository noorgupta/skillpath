import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getRoadmap,
  getModules,
  createModule,
  updateModule,
  deleteModule,
  getTopics,
  createTopic,
  updateTopic,
  toggleTopic,
  deleteTopic,
} from "../api";

function RoadmapDetail() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newTopicTitles, setNewTopicTitles] = useState({});

  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");

  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editTopicTitle, setEditTopicTitle] = useState("");

  const loadData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const roadmapData = await getRoadmap(id);
      const moduleList = await getModules(id);
      const modulesWithTopics = await Promise.all(
        moduleList.map(async (m) => {
          const topics = await getTopics(m.id);
          return { ...m, topics };
        })
      );
      setRoadmap(roadmapData);
      setModules(modulesWithTopics);
    } catch (err) {
      setError("Failed to load roadmap. Is the backend running?");
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, [id]);

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    try {
      await createModule({ roadmap_id: Number(id), title: newModuleTitle });
      setNewModuleTitle("");
      loadData();
    } catch (err) {
      setError("Failed to create module.");
    }
  };

  const handleCreateTopic = async (moduleId) => {
    const title = newTopicTitles[moduleId];
    if (!title || !title.trim()) return;
    try {
      await createTopic({ module_id: moduleId, title });
      setNewTopicTitles({ ...newTopicTitles, [moduleId]: "" });
      loadData();
    } catch (err) {
      setError("Failed to create topic.");
    }
  };

  const handleToggle = async (topicId) => {
    setModules((prevModules) =>
      prevModules.map((m) => ({
        ...m,
        topics: m.topics.map((t) =>
          t.id === topicId ? { ...t, is_completed: !t.is_completed } : t
        ),
      }))
    );

    try {
      await toggleTopic(topicId);
    } catch (err) {
      setError("Failed to update topic.");
      setModules((prevModules) =>
        prevModules.map((m) => ({
          ...m,
          topics: m.topics.map((t) =>
            t.id === topicId ? { ...t, is_completed: !t.is_completed } : t
          ),
        }))
      );
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await deleteModule(moduleId);
      loadData();
    } catch (err) {
      setError("Failed to delete module.");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await deleteTopic(topicId);
      loadData();
    } catch (err) {
      setError("Failed to delete topic.");
    }
  };

  const startEditModule = (m) => {
    setEditingModuleId(m.id);
    setEditModuleTitle(m.title);
  };

  const saveEditModule = async (moduleId) => {
    if (!editModuleTitle.trim()) {
      setEditingModuleId(null);
      return;
    }
    try {
      await updateModule(moduleId, { title: editModuleTitle });
    } catch (err) {
      setError("Failed to update module.");
    } finally {
      setEditingModuleId(null);
      loadData();
    }
  };

  const startEditTopic = (t) => {
    setEditingTopicId(t.id);
    setEditTopicTitle(t.title);
  };

  const saveEditTopic = async (topicId) => {
    if (!editTopicTitle.trim()) {
      setEditingTopicId(null);
      return;
    }
    try {
      await updateTopic(topicId, { title: editTopicTitle });
    } catch (err) {
      setError("Failed to update topic.");
    } finally {
      setEditingTopicId(null);
      loadData();
    }
  };

  const moduleProgress = (m) => {
    if (m.topics.length === 0) return 0;
    return Math.round((m.topics.filter((t) => t.is_completed).length / m.topics.length) * 100);
  };

  if (loading) return <div className="page"><p className="page-subtitle">Loading…</p></div>;
  if (!roadmap) return <div className="page"><p className="page-subtitle">Roadmap not found.</p></div>;

  return (
    <div className="page">
      <Link to="/" className="back-link">&larr; Back to dashboard</Link>

      <div className="page-header">
        <span className="eyebrow">Roadmap</span>
        <h1 className="page-title">{roadmap.title}</h1>
        {roadmap.description && <p className="page-subtitle">{roadmap.description}</p>}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleCreateModule} className="form-row" style={{ marginBottom: 32 }}>
        <input
          className="text-input"
          placeholder="New module title"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Add module</button>
      </form>

      {modules.length === 0 && (
        <div className="empty-state">
          <svg className="empty-state-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7 L12 12 L15 15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="empty-state-title">No modules yet</div>
          <div className="empty-state-text">Add your first module above to start building this roadmap.</div>
        </div>
      )}

      <div className="trail">
        {modules.map((m) => {
          const progress = moduleProgress(m);
          return (
            <div key={m.id} className="module-block">
              <div className={`module-waypoint ${progress === 100 ? "complete" : ""}`} />
              <div className="module-card">
                <div className="module-header">
                  {editingModuleId === m.id ? (
                    <input
                      className="text-input"
                      value={editModuleTitle}
                      onChange={(e) => setEditModuleTitle(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <h3 className="module-title">{m.title}</h3>
                  )}

                  <div className="module-actions">
                    {editingModuleId === m.id ? (
                      <>
                        <button onClick={() => saveEditModule(m.id)} className="btn-text">Save</button>
                        <button onClick={() => setEditingModuleId(null)} className="btn-text">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditModule(m)} className="btn-text">Edit</button>
                        <button onClick={() => handleDeleteModule(m.id)} className="btn-danger-text">Delete</button>
                      </>
                    )}
                  </div>
                </div>

                <ul className="topic-list">
                  {m.topics.map((t) => (
                    <li key={t.id} className="topic-item">
                      <input
                        type="checkbox"
                        className="topic-checkbox"
                        checked={t.is_completed}
                        onChange={() => handleToggle(t.id)}
                      />

                      {editingTopicId === t.id ? (
                        <input
                          className="text-input"
                          value={editTopicTitle}
                          onChange={(e) => setEditTopicTitle(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className={`topic-title ${t.is_completed ? "done" : ""}`}>{t.title}</span>
                      )}

                      {editingTopicId === t.id ? (
                        <>
                          <button onClick={() => saveEditTopic(t.id)} className="btn-text">Save</button>
                          <button onClick={() => setEditingTopicId(null)} className="btn-text">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditTopic(t)} className="btn-text">Edit</button>
                          <button onClick={() => handleDeleteTopic(t.id)} className="btn-danger-text">Delete</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="topic-add-row">
                  <input
                    className="text-input"
                    placeholder="New topic title"
                    value={newTopicTitles[m.id] || ""}
                    onChange={(e) => setNewTopicTitles({ ...newTopicTitles, [m.id]: e.target.value })}
                  />
                  <button onClick={() => handleCreateTopic(m.id)} className="btn btn-ghost">Add topic</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoadmapDetail;