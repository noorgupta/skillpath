from sqlmodel from SQLModel
from datetime from datetime 

class RoadmapCreate(SQLModel):
    title: str
    description: str | None = None

class RoadmapRead(SQLModel):
    id: int
    title: str
    description: str | None = None
    created_at: datetime


