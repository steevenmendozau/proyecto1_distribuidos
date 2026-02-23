from datetime import date, datetime
from decimal import Decimal
from pydantic import BaseModel


class ProductoStockBajo(BaseModel):
    producto_id: int
    nombre: str
    categoria: str
    stock_actual: int
    stock_minimo: int
    proveedor: str
    precio_unitario: Decimal


class ProductoMasMovido(BaseModel):
    producto_id: int
    nombre: str
    categoria: str
    total_salidas: int
    stock_actual: int


class ValorInventarioCategoria(BaseModel):
    categoria: str
    cantidad_productos: int
    stock_total: int
    valor_total: Decimal


class Movimiento(BaseModel):
    movimiento_id: int
    producto: str
    tipo: str
    cantidad: int
    fecha: date
    proveedor: str | None
    motivo: str | None
    observacion: str | None


class ResumenMovimientos(BaseModel):
    movimientos: list[Movimiento]
    total_entradas: int
    total_salidas: int


class ResumenProveedor(BaseModel):
    proveedor_id: int
    proveedor: str
    contacto: str | None
    telefono: str | None
    cantidad_productos: int
    valor_inventario: Decimal
