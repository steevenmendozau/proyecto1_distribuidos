from datetime import date
from typing import Literal

from fastapi import APIRouter, Query

from app.database import get_pool
from app.models import (
    ProductoStockBajo,
    ProductoMasMovido,
    ValorInventarioCategoria,
    Movimiento,
    ResumenMovimientos,
    ResumenProveedor,
)
from app.reports.queries import (
    STOCK_BAJO,
    PRODUCTOS_MAS_MOVIDOS,
    VALOR_INVENTARIO,
    MOVIMIENTOS,
    MOVIMIENTOS_TOTALES,
    RESUMEN_PROVEEDORES,
)
from app.export.csv_export import generate_csv
from app.export.pdf_export import generate_pdf

router = APIRouter(prefix="/api/reportes", tags=["Reportes"])


@router.get("/stock-bajo")
async def stock_bajo(formato: Literal["json", "pdf", "csv"] = Query("json")):
    pool = await get_pool()
    rows = await pool.fetch(STOCK_BAJO)
    data = [dict(r) for r in rows]

    if formato == "csv":
        return generate_csv(data, "stock_bajo")
    if formato == "pdf":
        return generate_pdf(data, "Reporte de Stock Bajo", "stock_bajo")

    return [ProductoStockBajo(**r) for r in data]


@router.get("/productos-mas-movidos")
async def productos_mas_movidos(
    fecha_inicio: date = Query(...),
    fecha_fin: date = Query(...),
    formato: Literal["json", "pdf", "csv"] = Query("json"),
):
    pool = await get_pool()
    rows = await pool.fetch(PRODUCTOS_MAS_MOVIDOS, fecha_inicio, fecha_fin)
    data = [dict(r) for r in rows]

    if formato == "csv":
        return generate_csv(data, "productos_mas_movidos")
    if formato == "pdf":
        return generate_pdf(data, "Productos Mas Movidos", "productos_mas_movidos")

    return [ProductoMasMovido(**r) for r in data]


@router.get("/valor-inventario")
async def valor_inventario(formato: Literal["json", "pdf", "csv"] = Query("json")):
    pool = await get_pool()
    rows = await pool.fetch(VALOR_INVENTARIO)
    data = [dict(r) for r in rows]

    if formato == "csv":
        return generate_csv(data, "valor_inventario")
    if formato == "pdf":
        return generate_pdf(data, "Valor del Inventario por Categoria", "valor_inventario")

    return [ValorInventarioCategoria(**r) for r in data]


@router.get("/movimientos")
async def movimientos(
    fecha_inicio: date = Query(...),
    fecha_fin: date = Query(...),
    formato: Literal["json", "pdf", "csv"] = Query("json"),
):
    pool = await get_pool()
    rows = await pool.fetch(MOVIMIENTOS, fecha_inicio, fecha_fin)
    totales = await pool.fetchrow(MOVIMIENTOS_TOTALES, fecha_inicio, fecha_fin)
    data = [dict(r) for r in rows]

    if formato == "csv":
        return generate_csv(data, "movimientos")
    if formato == "pdf":
        return generate_pdf(data, "Reporte de Movimientos", "movimientos")

    return ResumenMovimientos(
        movimientos=[Movimiento(**r) for r in data],
        total_entradas=totales["total_entradas"],
        total_salidas=totales["total_salidas"],
    )


@router.get("/resumen-proveedores")
async def resumen_proveedores(formato: Literal["json", "pdf", "csv"] = Query("json")):
    pool = await get_pool()
    rows = await pool.fetch(RESUMEN_PROVEEDORES)
    data = [dict(r) for r in rows]

    if formato == "csv":
        return generate_csv(data, "resumen_proveedores")
    if formato == "pdf":
        return generate_pdf(data, "Resumen por Proveedor", "resumen_proveedores")

    return [ResumenProveedor(**r) for r in data]
