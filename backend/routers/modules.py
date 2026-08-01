from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from database import engine
from models import Module
from schemas import ModuleCreate, ModuleRead, ModuleUpdate

router = APIRouter(prefix="/modules", tags=["Modules"])

@router.post("", response_model=ModuleRead)
def create_module(module: ModuleCreate):
    with Session(engine) as session:
        db_module = Module(**module.model_dump())
        session.add(db_module)
        session.commit()
        session.refresh(db_module)
        return db_module

@router.get("", response_model=list[ModuleRead])
def list_modules(roadmap_id: int | None = None):
    with Session(engine) as session:
        query = select(Module)
        if roadmap_id is not None:
            query = query.where(Module.roadmap_id == roadmap_id)
        return session.exec(query).all()

@router.get("/{module_id}", response_model=ModuleRead)
def get_module(module_id: int):
    with Session(engine) as session:
        module = session.get(Module, module_id)
        if not module:
            raise HTTPException(status_code=404, detail="Module not found")
        return module

@router.put("/{module_id}", response_model=ModuleRead)
def update_module(module_id: int, module_update: ModuleUpdate):
    with Session(engine) as session:
        db_module = session.get(Module, module_id)
        if not db_module:
            raise HTTPException(status_code=404, detail="Module not found")

        for key, value in module_update.model_dump(exclude_unset=True).items():
            setattr(db_module, key, value)

        session.add(db_module)
        session.commit()
        session.refresh(db_module)
        return db_module

@router.delete("/{module_id}", status_code=204)
def delete_module(module_id: int):
    with Session(engine) as session:
        db_module = session.get(Module, module_id)
        if not db_module:
            raise HTTPException(status_code=404, detail="Module not found")
        session.delete(db_module)
        session.commit()