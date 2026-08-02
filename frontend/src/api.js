import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Roadmaps
export const getRoadmaps = () => api.get("/roadmaps").then(res => res.data);
export const getRoadmap = (id) => api.get(`/roadmaps/${id}`).then(res => res.data);
export const getRoadmapProgress = (id) => api.get(`/roadmaps/${id}/progress`).then(res => res.data);
export const createRoadmap = (data) => api.post("/roadmaps", data).then(res => res.data);
export const deleteRoadmap = (id) => api.delete(`/roadmaps/${id}`);

// Modules
export const getModules = (roadmapId) => api.get(`/modules?roadmap_id=${roadmapId}`).then(res => res.data);
export const createModule = (data) => api.post("/modules", data).then(res => res.data);
export const updateModule = (id, data) => api.put(`/modules/${id}`, data).then(res => res.data);
export const deleteModule = (id) => api.delete(`/modules/${id}`);

// Topics
export const getTopics = (moduleId) => api.get(`/topics?module_id=${moduleId}`).then(res => res.data);
export const createTopic = (data) => api.post("/topics", data).then(res => res.data);
export const updateTopic = (id, data) => api.put(`/topics/${id}`, data).then(res => res.data);
export const toggleTopic = (id) => api.patch(`/topics/${id}/toggle`).then(res => res.data);
export const deleteTopic = (id) => api.delete(`/topics/${id}`);

export default api;