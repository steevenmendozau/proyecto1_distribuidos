-- =============================================
-- Seed Data para Sistema de Inventario Distribuido
-- =============================================

-- Categorias (5)
INSERT INTO categorias (nombre, descripcion) VALUES
('Alimentos', 'Productos alimenticios y bebidas'),
('Limpieza', 'Productos de limpieza e higiene'),
('Electronica', 'Dispositivos y accesorios electronicos'),
('Papeleria', 'Materiales de oficina y papeleria'),
('Ferreteria', 'Herramientas y materiales de construccion');

-- Proveedores (5 empresas ecuatorianas ficticias)
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Distribuidora Andina S.A.', 'Carlos Mendoza', '0991234567', 'ventas@andinasa.ec', 'Av. 9 de Octubre 1200, Guayaquil'),
('Importadora del Pacifico Cia. Ltda.', 'Maria Espinoza', '0987654321', 'contacto@imppacifico.ec', 'Calle Bolivar 456, Quito'),
('Comercial Ecuatoriana S.A.', 'Luis Paredes', '0976543210', 'info@comercialec.ec', 'Av. Americas 789, Cuenca'),
('Proveedora Nacional del Sur', 'Ana Villacis', '0965432109', 'pedidos@provnacional.ec', 'Calle Sucre 321, Machala'),
('TecnoSuministros Ecuador', 'Jorge Bravo', '0954321098', 'ventas@tecnosuministros.ec', 'Av. Eloy Alfaro 1500, Quito');

-- Productos (20 productos, 4 por categoria, 7 con stock bajo)
-- Categoria 1: Alimentos
INSERT INTO productos (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id) VALUES
('Arroz Premium 1kg', 'Arroz de grano largo premium', 1.25, 150, 20, 1, 1),
('Aceite Vegetal 1L', 'Aceite vegetal refinado', 2.80, 8, 15, 1, 1),
('Azucar Blanca 1kg', 'Azucar refinada blanca', 1.10, 200, 25, 1, 4),
('Sal Yodada 500g', 'Sal de mesa yodada', 0.65, 5, 10, 1, 4);

-- Categoria 2: Limpieza
INSERT INTO productos (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id) VALUES
('Detergente Liquido 2L', 'Detergente concentrado para ropa', 4.50, 60, 10, 2, 2),
('Desinfectante Multiuso 1L', 'Desinfectante antibacterial', 3.20, 3, 8, 2, 2),
('Jabon Liquido 500ml', 'Jabon liquido antibacterial para manos', 2.10, 45, 12, 2, 4),
('Cloro Concentrado 1L', 'Cloro para limpieza y desinfeccion', 1.80, 7, 10, 2, 4);

-- Categoria 3: Electronica
INSERT INTO productos (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id) VALUES
('Cable USB-C 1m', 'Cable de carga y datos USB-C', 3.50, 80, 15, 3, 5),
('Audifonos Bluetooth', 'Audifonos inalambricos con microfono', 15.00, 4, 5, 3, 5),
('Cargador Universal 5V', 'Cargador de pared USB 5V 2A', 5.00, 35, 8, 3, 5),
('Mouse Inalambrico', 'Mouse optico inalambrico USB', 8.50, 2, 5, 3, 3);

-- Categoria 4: Papeleria
INSERT INTO productos (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id) VALUES
('Resma Papel A4', 'Resma de papel bond A4 75g 500 hojas', 4.20, 90, 10, 4, 3),
('Boligrafo Azul (caja x12)', 'Caja de 12 boligrafos punta media', 3.60, 6, 8, 4, 3),
('Carpeta Manila A4', 'Carpeta manila tamano A4', 0.25, 300, 50, 4, 3),
('Grapadora Metalica', 'Grapadora de escritorio metalica', 6.00, 20, 5, 4, 2);

-- Categoria 5: Ferreteria
INSERT INTO productos (nombre, descripcion, precio_unitario, stock_actual, stock_minimo, categoria_id, proveedor_id) VALUES
('Destornillador Phillips', 'Destornillador Phillips #2', 3.80, 25, 5, 5, 1),
('Cinta Aislante Negra', 'Cinta aislante electrica 20m', 1.50, 5, 10, 5, 1),
('Martillo de Uña 16oz', 'Martillo de uña mango de fibra', 12.00, 15, 3, 5, 2),
('Clavos 2 pulgadas (1kg)', 'Clavos de acero 2 pulgadas', 2.50, 40, 10, 5, 2);

-- Movimientos (30 movimientos distribuidos en los ultimos 60 dias)
INSERT INTO movimientos (producto_id, tipo, cantidad, fecha, proveedor_id, motivo, observacion) VALUES
-- Entradas recientes
(1, 'entrada', 50, CURRENT_DATE - INTERVAL '55 days', 1, 'Compra a proveedor', 'Pedido mensual de arroz'),
(3, 'entrada', 80, CURRENT_DATE - INTERVAL '52 days', 4, 'Compra a proveedor', 'Reposicion de azucar'),
(5, 'entrada', 30, CURRENT_DATE - INTERVAL '50 days', 2, 'Compra a proveedor', 'Pedido de detergente'),
(9, 'entrada', 40, CURRENT_DATE - INTERVAL '48 days', 5, 'Compra a proveedor', 'Stock de cables USB-C'),
(13, 'entrada', 50, CURRENT_DATE - INTERVAL '45 days', 3, 'Compra a proveedor', 'Resmas de papel para oficina'),
(17, 'entrada', 15, CURRENT_DATE - INTERVAL '43 days', 1, 'Compra a proveedor', 'Herramientas basicas'),
(7, 'entrada', 20, CURRENT_DATE - INTERVAL '40 days', 4, 'Compra a proveedor', 'Jabon liquido antibacterial'),
(15, 'entrada', 100, CURRENT_DATE - INTERVAL '38 days', 3, 'Compra a proveedor', 'Carpetas manila al por mayor'),
(19, 'entrada', 10, CURRENT_DATE - INTERVAL '35 days', 2, 'Compra a proveedor', 'Martillos para ferreteria'),
(11, 'entrada', 20, CURRENT_DATE - INTERVAL '33 days', 5, 'Compra a proveedor', 'Cargadores USB'),

-- Salidas
(1, 'salida', 30, CURRENT_DATE - INTERVAL '50 days', NULL, 'Venta', 'Venta a minimarket local'),
(2, 'salida', 12, CURRENT_DATE - INTERVAL '47 days', NULL, 'Venta', 'Venta de aceite vegetal'),
(3, 'salida', 25, CURRENT_DATE - INTERVAL '44 days', NULL, 'Venta', 'Pedido de tienda'),
(5, 'salida', 10, CURRENT_DATE - INTERVAL '42 days', NULL, 'Venta', 'Venta de detergente'),
(9, 'salida', 15, CURRENT_DATE - INTERVAL '39 days', NULL, 'Venta', 'Venta de cables USB-C'),
(13, 'salida', 20, CURRENT_DATE - INTERVAL '37 days', NULL, 'Venta', 'Pedido de resmas de papel'),
(15, 'salida', 50, CURRENT_DATE - INTERVAL '34 days', NULL, 'Venta', 'Venta al por mayor de carpetas'),
(10, 'salida', 6, CURRENT_DATE - INTERVAL '31 days', NULL, 'Venta', 'Venta de audifonos bluetooth'),
(12, 'salida', 8, CURRENT_DATE - INTERVAL '29 days', NULL, 'Venta', 'Venta de mouse inalambrico'),
(14, 'salida', 10, CURRENT_DATE - INTERVAL '27 days', NULL, 'Venta', 'Venta de boligrafos'),

-- Mas entradas
(2, 'entrada', 25, CURRENT_DATE - INTERVAL '25 days', 1, 'Compra a proveedor', 'Reposicion de aceite'),
(4, 'entrada', 15, CURRENT_DATE - INTERVAL '22 days', 4, 'Compra a proveedor', 'Reposicion de sal'),
(6, 'entrada', 10, CURRENT_DATE - INTERVAL '20 days', 2, 'Compra a proveedor', 'Reposicion de desinfectante'),
(8, 'entrada', 12, CURRENT_DATE - INTERVAL '18 days', 4, 'Compra a proveedor', 'Reposicion de cloro'),
(10, 'entrada', 8, CURRENT_DATE - INTERVAL '15 days', 5, 'Compra a proveedor', 'Reposicion de audifonos'),
(18, 'entrada', 20, CURRENT_DATE - INTERVAL '12 days', 1, 'Compra a proveedor', 'Reposicion de cinta aislante'),

-- Mas salidas recientes
(4, 'salida', 15, CURRENT_DATE - INTERVAL '10 days', NULL, 'Venta', 'Venta de sal yodada'),
(6, 'salida', 10, CURRENT_DATE - INTERVAL '8 days', NULL, 'Venta', 'Venta desinfectante multiuso'),
(8, 'salida', 8, CURRENT_DATE - INTERVAL '5 days', NULL, 'Venta', 'Venta de cloro'),
(18, 'salida', 18, CURRENT_DATE - INTERVAL '2 days', NULL, 'Venta', 'Venta de cinta aislante');

-- Reset de sequences para que los proximos inserts continuen correctamente
SELECT setval('categorias_id_seq', (SELECT MAX(id) FROM categorias));
SELECT setval('proveedores_id_seq', (SELECT MAX(id) FROM proveedores));
SELECT setval('productos_id_seq', (SELECT MAX(id) FROM productos));
SELECT setval('movimientos_id_seq', (SELECT MAX(id) FROM movimientos));
