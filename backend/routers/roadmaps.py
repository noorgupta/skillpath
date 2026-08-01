from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Roadmap, Module, Topic
from schemas import RoadmapCreate, RoadmapRead, RoadmapUpdate, RoadmapProgress


router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])

@router.post("", response_model=RoadmapRead)
def create_roadmap(roadmap: RoadmapCreate):
    with Session(engine) as session:
        db_roadmap = Roadmap(**roadmap.model_dump())
        session.add(db_roadmap)
        session.commit()
        session.refresh(db_roadmap)
        return db_roadmap

@router.get("", response_model=list[RoadmapRead])
def list_roadmaps():
    with Session(engine) as session:
        return session.exec(select(Roadmap)).all()

@router.get("/{roadmap_id}", response_model=RoadmapRead)
def get_roadmap(roadmap_id: int):
    with Session(engine) as session:
        roadmap = session.get(Roadmap, roadmap_id)
        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")
        return roadmap

@router.put("/{roadmap_id}", response_model=RoadmapRead)
def update_roadmap(roadmap_id: int, roadmap_update: RoadmapUpdate):
    with Session(engine) as session:
        db_roadmap = session.get(Roadmap, roadmap_id)
        if not db_roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        update_data = roadmap_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_roadmap, key, value)

        session.add(db_roadmap)
        session.commit()
        session.refresh(db_roadmap)
        return db_roadmap

@router.delete("/{roadmap_id}", status_code=204)
def delete_roadmap(roadmap_id: int):
    with Session(engine) as session:
        db_roadmap = session.get(Roadmap, roadmap_id)
        if not db_roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")
        session.delete(db_roadmap)
        session.commit()

@router.get("/{roadmap_id}/progress", response_model=RoadmapProgress)
def get_roadmap_progress(roadmap_id: int):
    with Session(engine) as session:
        roadmap = session.get(Roadmap, roadmap_id)
        if not roadmap:
            raise HTTPException(status_code=404, detail="Roadmap not found")

        modules = session.exec(select(Module).where(Module.roadmap_id == roadmap_id)).all()
        module_ids = [m.id for m in modules]

        if not module_ids:
            topics = []
        else:
            topics = session.exec(select(Topic).where(Topic.module_id.in_(module_ids))).all()

        total = len(topics)
        completed = len([t for t in topics if t.is_completed])
        percent = (completed / total * 100) if total > 0 else 0.0

        return RoadmapProgress(
            id=roadmap.id,
            title=roadmap.title,
            total_topics=total,
            completed_topics=completed,
            percent_complete=round(percent, 1),
        )
