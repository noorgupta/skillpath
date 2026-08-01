from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Topic
from schemas import TopicCreate, TopicRead, TopicUpdate

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.post("", response_model=TopicRead)
def create_topic(topic: TopicCreate):
    with Session(engine) as session:
        db_topic = Topic(**topic.model_dump())
        session.add(db_topic)
        session.commit()
        session.refresh(db_topic)
        return db_topic

@router.get("", response_model=list[TopicRead])
def list_topics(module_id: int | None = None):
    with Session(engine) as session:
        query = select(Topic)
        if module_id is not None:
            query = query.where(Topic.module_id == module_id)
        return session.exec(query).all()

@router.get("/{topic_id}", response_model=TopicRead)
def get_topic(topic_id: int):
    with Session(engine) as session:
        topic = session.get(Topic, topic_id)
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        return topic

@router.put("/{topic_id}", response_model=TopicRead)
def update_topic(topic_id: int, topic_update: TopicUpdate):
    with Session(engine) as session:
        db_topic = session.get(Topic, topic_id)
        if not db_topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        for key, value in topic_update.model_dump(exclude_unset=True).items():
            setattr(db_topic, key, value)
        session.add(db_topic)
        session.commit()
        session.refresh(db_topic)
        return db_topic

@router.patch("/{topic_id}/toggle", response_model=TopicRead)
def toggle_topic(topic_id: int):
    with Session(engine) as session:
        db_topic = session.get(Topic, topic_id)
        if not db_topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        db_topic.is_completed = not db_topic.is_completed
        session.add(db_topic)
        session.commit()
        session.refresh(db_topic)
        return db_topic

@router.delete("/{topic_id}", status_code=204)
def delete_topic(topic_id: int):
    with Session(engine) as session:
        db_topic = session.get(Topic, topic_id)
        if not db_topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        session.delete(db_topic)
        session.commit()