from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import lifespan
from app.reports.router import router as reportes_router

app = FastAPI(
    title="Servicio de Reportes - Inventario",
    description="API de reportes para el sistema de inventario distribuido",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reportes_router)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "servicio": "reportes"}
