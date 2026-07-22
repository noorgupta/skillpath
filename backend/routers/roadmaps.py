from fastapi import APIRouter
from sqlmodel import Session
from database import engine
from models import Roadmap
from schemas import RoadmapCreate, RoadmapRead

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])

@router.post("", response_model=RoadmapRead)
def create_roadmap(roadmap: RoadmapCreate):
    with Session(engine) as session:
        db_roadmap = Roadmap(**roadmap.model_dump())
        session.add(db_roadmap)
        session.commit()
        session.refresh(db_roadmap)
        return db_roadmap