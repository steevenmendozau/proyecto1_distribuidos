require("dotenv").config();
const pool = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            message: "Conectado a la base de datos",
            time: result.rows[0].now,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error conectando a la base de datos" });
    }
});

app.get("/productos", async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT p.*, c.nombre AS categoria_nombre, pr.nombre AS proveedor_nombre
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      JOIN proveedores pr ON p.proveedor_id = pr.id
    `);

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
            `
      INSERT INTO productos 
      (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
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
            `
            UPDATE productos
            SET nombre=$1,
                descripcion=$2,
                precio_unitario=$3,
                stock_actual=$4,
                stock_minimo=$5,
                categoria_id=$6,
                proveedor_id=$7,
                updated_at = CURRENT_TIMESTAMP
            WHERE id=$8
            RETURNING *
            `,
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

        await pool.query(
            "DELETE FROM productos WHERE id=$1",
            [id]
        );

        res.json({ message: "Producto eliminado" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error eliminando producto" });
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
