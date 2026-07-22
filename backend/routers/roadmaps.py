from fastapi import FastAPI
from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import Roadmap
from schemas import RoadmapCreate, RoadmapRead

# ... existing app setup ...

@app.post("/roadmaps", response_model=RoadmapRead)
def create_roadmap(roadmap: RoadmapCreate):
    with Session(engine) as session:
        db_roadmap = Roadmap(**roadmap.model_dump())
        session.add(db_roadmap)
        session.commit()
        session.refresh(db_roadmap)
        return db_roadmap 