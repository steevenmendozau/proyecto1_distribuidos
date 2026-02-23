import asyncpg
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.config import settings

pool: asyncpg.Pool | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global pool
    pool = await asyncpg.create_pool(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        database=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        min_size=2,
        max_size=10,
    )
    yield
    await pool.close()


async def get_pool() -> asyncpg.Pool:
    return pool
