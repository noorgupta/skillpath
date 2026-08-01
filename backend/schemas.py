from sqlmodel import SQLModel
from datetime import datetime

# ---------- Roadmap ----------
class RoadmapCreate(SQLModel):
    title: str
    description: str | None = None

class RoadmapRead(SQLModel):
    id: int
    title: str
    description: str | None = None
    created_at: datetime

class RoadmapUpdate(SQLModel):
    title: str | None = None
    description: str | None = None

# ---------- Module ----------
class ModuleCreate(SQLModel):
    roadmap_id: int
    title: str
    order_index: int = 0

class ModuleRead(SQLModel):
    id: int
    roadmap_id: int
    title: str
    order_index: int

class ModuleUpdate(SQLModel):
    title: str | None = None
    order_index: int | None = None

# ---------- Topic ----------

class TopicCreate(SQLModel):
    module_id: int
    title: str
    notes: str | None = None
    order_index: int = 0

class TopicRead(SQLModel):
    id: int
    module_id: int
    title: str
    notes: str | None = None
    is_completed: bool
    order_index: int

class TopicUpdate(SQLModel):
    title: str | None = None
    notes: str | None = None
    order_index: int | None = None

class RoadmapProgress(SQLModel):
    id: int
    title: str
    total_topics: int
    completed_topics: int
    percent_complete: float