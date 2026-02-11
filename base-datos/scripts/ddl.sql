  -- Tabla de Categorías
  CREATE TABLE categorias (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL UNIQUE,
      descripcion TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de Proveedores
  CREATE TABLE proveedores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL UNIQUE,
      contacto VARCHAR(100),
      telefono VARCHAR(20),
      email VARCHAR(100),
      direccion TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de Productos
  CREATE TABLE productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT,
      precio_unitario DECIMAL(10, 2) NOT NULL,
      stock_actual INT NOT NULL DEFAULT 0,
      stock_minimo INT NOT NULL DEFAULT 0,
      categoria_id INT NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
      proveedor_id INT NOT NULL REFERENCES proveedores(id) ON DELETE RESTRICT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de Movimientos de Inventario
  CREATE TABLE movimientos (
      id SERIAL PRIMARY KEY,
      producto_id INT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
      tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
      cantidad INT NOT NULL,
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      proveedor_id INT REFERENCES proveedores(id) ON DELETE SET NULL,
      motivo VARCHAR(100),
      observacion TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Índices para queries frecuentes
  CREATE INDEX idx_productos_categoria ON productos(categoria_id);
  CREATE INDEX idx_productos_proveedor ON productos(proveedor_id);
  CREATE INDEX idx_movimientos_producto ON movimientos(producto_id);
  CREATE INDEX idx_movimientos_fecha ON movimientos(fecha);
  CREATE INDEX idx_movimientos_tipo ON movimientos(tipo);
