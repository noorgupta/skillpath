from sqlmodel import SQLModel
from datetime import datetime

class RoadmapCreate(SQLModel):
    title: str
    description: str | None = None

class RoadmapRead(SQLModel):
    id: int
    title: str
    description: str | None = None
    created_at: datetime