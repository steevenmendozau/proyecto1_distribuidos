STOCK_BAJO = """
    SELECT
        p.id AS producto_id,
        p.nombre,
        c.nombre AS categoria,
        p.stock_actual,
        p.stock_minimo,
        pr.nombre AS proveedor,
        p.precio_unitario
    FROM productos p
    JOIN categorias c ON c.id = p.categoria_id
    JOIN proveedores pr ON pr.id = p.proveedor_id
    WHERE p.stock_actual <= p.stock_minimo
    ORDER BY (p.stock_actual::float / NULLIF(p.stock_minimo, 0)) ASC;
"""

PRODUCTOS_MAS_MOVIDOS = """
    SELECT
        p.id AS producto_id,
        p.nombre,
        c.nombre AS categoria,
        COALESCE(SUM(m.cantidad), 0)::int AS total_salidas,
        p.stock_actual
    FROM productos p
    JOIN categorias c ON c.id = p.categoria_id
    LEFT JOIN movimientos m ON m.producto_id = p.id
        AND m.tipo = 'salida'
        AND m.fecha BETWEEN $1 AND $2
    GROUP BY p.id, p.nombre, c.nombre, p.stock_actual
    ORDER BY total_salidas DESC
    LIMIT 10;
"""

VALOR_INVENTARIO = """
    SELECT
        c.nombre AS categoria,
        COUNT(p.id)::int AS cantidad_productos,
        COALESCE(SUM(p.stock_actual), 0)::int AS stock_total,
        COALESCE(SUM(p.stock_actual * p.precio_unitario), 0) AS valor_total
    FROM categorias c
    LEFT JOIN productos p ON p.categoria_id = c.id
    GROUP BY c.nombre
    ORDER BY valor_total DESC;
"""

MOVIMIENTOS = """
    SELECT
        m.id AS movimiento_id,
        p.nombre AS producto,
        m.tipo,
        m.cantidad,
        m.fecha,
        pr.nombre AS proveedor,
        m.motivo,
        m.observacion
    FROM movimientos m
    JOIN productos p ON p.id = m.producto_id
    LEFT JOIN proveedores pr ON pr.id = m.proveedor_id
    WHERE m.fecha BETWEEN $1 AND $2
    ORDER BY m.fecha DESC, m.id DESC;
"""

MOVIMIENTOS_TOTALES = """
    SELECT
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN cantidad ELSE 0 END), 0)::int AS total_entradas,
        COALESCE(SUM(CASE WHEN tipo = 'salida' THEN cantidad ELSE 0 END), 0)::int AS total_salidas
    FROM movimientos
    WHERE fecha BETWEEN $1 AND $2;
"""

RESUMEN_PROVEEDORES = """
    SELECT
        pr.id AS proveedor_id,
        pr.nombre AS proveedor,
        pr.contacto,
        pr.telefono,
        COUNT(p.id)::int AS cantidad_productos,
        COALESCE(SUM(p.stock_actual * p.precio_unitario), 0) AS valor_inventario
    FROM proveedores pr
    LEFT JOIN productos p ON p.proveedor_id = pr.id
    GROUP BY pr.id, pr.nombre, pr.contacto, pr.telefono
    ORDER BY valor_inventario DESC;
"""
