require("dotenv").config();
const pool = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// ==================== CATEGORIAS ====================

app.get("/categorias", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categorias ORDER BY id");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo categorias" });
    }
});

app.post("/categorias", async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const result = await pool.query(
            "INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *",
            [nombre, descripcion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando categoria" });
    }
});

app.put("/categorias/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const result = await pool.query(
            "UPDATE categorias SET nombre=$1, descripcion=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *",
            [nombre, descripcion, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error actualizando categoria" });
    }
});

app.delete("/categorias/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM categorias WHERE id=$1", [id]);
        res.json({ message: "Categoria eliminada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error eliminando categoria (puede tener productos asociados)" });
    }
});

// ==================== PROVEEDORES ====================

app.get("/proveedores", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM proveedores ORDER BY id");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo proveedores" });
    }
});

app.post("/proveedores", async (req, res) => {
    try {
        const { nombre, contacto, telefono, email, direccion } = req.body;
        const result = await pool.query(
            "INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [nombre, contacto, telefono, email, direccion]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando proveedor" });
    }
});

app.put("/proveedores/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, contacto, telefono, email, direccion } = req.body;
        const result = await pool.query(
            `UPDATE proveedores SET nombre=$1, contacto=$2, telefono=$3, email=$4, direccion=$5, updated_at=CURRENT_TIMESTAMP WHERE id=$6 RETURNING *`,
            [nombre, contacto, telefono, email, direccion, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error actualizando proveedor" });
    }
});

app.delete("/proveedores/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM proveedores WHERE id=$1", [id]);
        res.json({ message: "Proveedor eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error eliminando proveedor (puede tener productos asociados)" });
    }
});

// ==================== PRODUCTOS ====================

app.get("/productos", async (req, res) => {
    try {
        const { buscar, categoria_id, proveedor_id } = req.query;
        let query = `
            SELECT p.*, c.nombre AS categoria_nombre, pr.nombre AS proveedor_nombre
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            JOIN proveedores pr ON p.proveedor_id = pr.id
        `;
        const conditions = [];
        const params = [];

        if (buscar) {
            params.push(`%${buscar}%`);
            conditions.push(`p.nombre ILIKE $${params.length}`);
        }
        if (categoria_id) {
            params.push(categoria_id);
            conditions.push(`p.categoria_id = $${params.length}`);
        }
        if (proveedor_id) {
            params.push(proveedor_id);
            conditions.push(`p.proveedor_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        query += " ORDER BY p.id";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo productos" });
    }
});

app.post("/productos", async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio_unitario,
            stock_actual,
            stock_minimo,
            categoria_id,
            proveedor_id
        } = req.body;

        const result = await pool.query(
            `INSERT INTO productos
            (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creando producto" });
    }
});

app.put("/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            descripcion,
            precio_unitario,
            stock_actual,
            stock_minimo,
            categoria_id,
            proveedor_id
        } = req.body;

        const result = await pool.query(
            `UPDATE productos
            SET nombre=$1, descripcion=$2, precio_unitario=$3,
                stock_actual=$4, stock_minimo=$5, categoria_id=$6,
                proveedor_id=$7, updated_at=CURRENT_TIMESTAMP
            WHERE id=$8
            RETURNING *`,
            [nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id, id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error actualizando producto" });
    }
});

app.delete("/productos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM productos WHERE id=$1", [id]);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error eliminando producto" });
    }
});

// ==================== MOVIMIENTOS ====================

app.get("/movimientos", async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, tipo, producto_id } = req.query;
        let query = `
            SELECT m.*, p.nombre AS producto_nombre, pr.nombre AS proveedor_nombre
            FROM movimientos m
            JOIN productos p ON m.producto_id = p.id
            LEFT JOIN proveedores pr ON m.proveedor_id = pr.id
        `;
        const conditions = [];
        const params = [];

        if (fecha_inicio) {
            params.push(fecha_inicio);
            conditions.push(`m.fecha >= $${params.length}`);
        }
        if (fecha_fin) {
            params.push(fecha_fin);
            conditions.push(`m.fecha <= $${params.length}`);
        }
        if (tipo) {
            params.push(tipo);
            conditions.push(`m.tipo = $${params.length}`);
        }
        if (producto_id) {
            params.push(producto_id);
            conditions.push(`m.producto_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }
        query += " ORDER BY m.fecha DESC, m.id DESC";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error obteniendo movimientos" });
    }
});

app.post("/movimientos", async (req, res) => {
    const client = await pool.connect();
    try {
        const { producto_id, tipo, cantidad, proveedor_id, motivo, observacion } = req.body;

        await client.query("BEGIN");

        const movResult = await client.query(
            `INSERT INTO movimientos (producto_id, tipo, cantidad, fecha, proveedor_id, motivo, observacion)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)
            RETURNING *`,
            [producto_id, tipo, cantidad, proveedor_id || null, motivo, observacion]
        );

        const stockOp = tipo === "entrada" ? "+" : "-";
        await client.query(
            `UPDATE productos SET stock_actual = stock_actual ${stockOp} $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
            [cantidad, producto_id]
        );

        await client.query("COMMIT");

        res.status(201).json(movResult.rows[0]);
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ error: "Error registrando movimiento" });
    } finally {
        client.release();
    }
});

// ==================== REPORTES (proxy a servicio-reportes) ====================

app.get("/reportes/:nombre", async (req, res) => {
    try {
        const { nombre } = req.params;
        const queryString = new URLSearchParams(req.query).toString();
        const baseUrl = process.env.REPORT_SERVICE_URL || "http://localhost:8081";
        const url = `${baseUrl}/api/reportes/${nombre}${queryString ? "?" + queryString : ""}`;

        const response = await fetch(url);
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            res.json(data);
        } else {
            const disposition = response.headers.get("content-disposition");
            if (disposition) {
                res.set("Content-Disposition", disposition);
            }
            res.set("Content-Type", contentType);
            const buffer = await response.arrayBuffer();
            res.send(Buffer.from(buffer));
        }
    } catch (error) {
        console.error(error);
        res.status(502).json({ error: "Error conectando con el servicio de reportes" });
    }
});

// ==================== START ====================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
