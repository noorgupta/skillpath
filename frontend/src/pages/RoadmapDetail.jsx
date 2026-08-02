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
  loadData(true);  // only the very first load shows the loading screen
}, [id]);

  useEffect(() => {
    loadData();
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
  // Optimistically update the UI immediately, before the API call finishes
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
    // success — local state already matches the server, nothing more to do
  } catch (err) {
    setError("Failed to update topic.");
    // roll back the optimistic change since the API call failed
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

  if (loading) return <p>Loading...</p>;
  if (!roadmap) return <p>Roadmap not found.</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "0 16px" }}>
      <Link to="/">&larr; Back to Dashboard</Link>
      <h1>{roadmap.title}</h1>
      <p>{roadmap.description}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleCreateModule} style={{ marginBottom: 24 }}>
        <input
          placeholder="New module title"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
        />
        <button type="submit">Add Module</button>
      </form>

      {modules.length === 0 && <p>No modules yet — add one above.</p>}

      {modules.map((m) => (
        <div key={m.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            {editingModuleId === m.id ? (
              <input
                value={editModuleTitle}
                onChange={(e) => setEditModuleTitle(e.target.value)}
                autoFocus
              />
            ) : (
              <h3 style={{ margin: 0 }}>{m.title}</h3>
            )}

            {editingModuleId === m.id ? (
              <>
                <button onClick={() => saveEditModule(m.id)}>Save</button>
                <button onClick={() => setEditingModuleId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => startEditModule(m)} style={{ fontSize: 12 }}>Edit</button>
                <button onClick={() => handleDeleteModule(m.id)} style={{ fontSize: 12 }}>Delete Module</button>
              </>
            )}
          </div>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {m.topics.map((t) => (
              <li key={t.id} style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={t.is_completed}
                  onChange={() => handleToggle(t.id)}
                />

                {editingTopicId === t.id ? (
                  <input
                    value={editTopicTitle}
                    onChange={(e) => setEditTopicTitle(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span style={{ textDecoration: t.is_completed ? "line-through" : "none" }}>
                    {t.title}
                  </span>
                )}

                {editingTopicId === t.id ? (
                  <>
                    <button onClick={() => saveEditTopic(t.id)} style={{ fontSize: 12 }}>Save</button>
                    <button onClick={() => setEditingTopicId(null)} style={{ fontSize: 12 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditTopic(t)} style={{ fontSize: 12 }}>Edit</button>
                    <button onClick={() => handleDeleteTopic(t.id)} style={{ fontSize: 12 }}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>

          <input
            placeholder="New topic title"
            value={newTopicTitles[m.id] || ""}
            onChange={(e) => setNewTopicTitles({ ...newTopicTitles, [m.id]: e.target.value })}
          />
          <button onClick={() => handleCreateTopic(m.id)}>Add Topic</button>
        </div>
      ))}
    </div>
  );
}

export default RoadmapDetail;