from sqlmodel import SQLModel, Field
from datetime import datetime

class Roadmap(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    description: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Module(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    roadmap_id: int = Field(foreign_key="roadmap.id")
    title: str
    order_index: int = 0

class Topic(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    module_id: int = Field(foreign_key="module.id")
    title: str
    notes: str | None = None
    is_completed: bool = False
    order_index: int = 0