Proyecto de Fin de Parcial — Sistemas Distribuidos con Docker
Sistema de Inventario para Bodega/Tienda (Arquitectura Distribuida Multi-Host)
Descripción General
Desarrollar un sistema de inventario distribuido en 3 máquinas físicas distintas, donde cada máquina ejecuta un servicio containerizado con Docker. Las máquinas se conectarán entre sí mediante Tailscale (VPN) para garantizar la comunicación sin importar la red en la que se encuentren.

Arquitectura del Sistema
[Máquina 1]              [Máquina 2]              [Máquina 3]
App Web (Frontend+API) → Base de Datos           ← Servicio de Reportes
Puerto: 8080              Puerto: 5432/27017/1433   Puerto: 8081
Tailscale IP: 100.x.x.1  Tailscale IP: 100.x.x.2  Tailscale IP: 100.x.x.3
 
Máquina 1 — Aplicación Web (Frontend + API REST)
Responsable: Estudiante A
Tecnologías sugeridas: Flask, Express.js, Django, Spring Boot (a elección del grupo). Frontend puede ser HTML/CSS/JS, React, o templates del framework.
Funcionalidades obligatorias:
Módulo de Productos
Crear, leer, actualizar y eliminar productos (nombre, descripción, precio unitario, stock actual, stock mínimo, categoría, proveedor)
Buscar productos por nombre, categoría o proveedor
Visualizar alerta visual cuando el stock actual sea menor o igual al stock mínimo
Módulo de Categorías
CRUD de categorías (nombre, descripción)
Listar productos por categoría
Módulo de Proveedores
CRUD de proveedores (nombre, contacto, teléfono, email, dirección)
Listar productos por proveedor
Módulo de Movimientos de Inventario
Registrar entradas de stock (compras/reposiciones): producto, cantidad, fecha, proveedor, observación
Registrar salidas de stock (ventas/despachos): producto, cantidad, fecha, motivo, observación
El stock del producto debe actualizarse automáticamente con cada movimiento
Historial de movimientos con filtros por fecha, tipo (entrada/salida) y producto
Requisitos técnicos:
Dockerfile propio con imagen base apropiada
docker-compose.yml que defina el servicio y las variables de entorno para conectarse a la BD (Máquina 2) y al servicio de reportes (Máquina 3)
Variables de entorno: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, REPORT_SERVICE_URL
El contenedor debe exponer el puerto 8080
Máquina 2 — Base de Datos
Responsable: Estudiante B
Motor de base de datos: PostgreSQL, MongoDB o SQL Server (a elección del grupo)
Funcionalidades obligatorias:
Diseñar e implementar el esquema/modelo de datos completo (productos, categorías, proveedores, movimientos)
La base de datos debe ser accesible desde las otras 2 máquinas (Máquina 1 y Máquina 3)
Configurar autenticación (usuario y contraseña)
Cargar datos iniciales (seed) con al menos: 5 categorías, 5 proveedores, 20 productos y 30 movimientos de ejemplo
Requisitos técnicos:
docker-compose.yml con el servicio de base de datos
Volumen persistente (named volume) para que los datos no se pierdan al reiniciar el contenedor
Script de inicialización montado en el contenedor (vía bind mount o volumen) que cree las tablas/colecciones y cargue los datos semilla
Configurar el contenedor para aceptar conexiones remotas (no solo localhost)
Incluir un servicio adicional de administración: pgAdmin (PostgreSQL), Mongo Express (MongoDB) o Azure Data Studio (SQL Server), accesible por puerto web
El contenedor de BD debe exponer el puerto correspondiente (5432, 27017 o 1433)
Variables de entorno: DB_USER, DB_PASSWORD, DB_NAME
Máquina 3 — Servicio de Reportes
Responsable: Estudiante C
Tecnologías sugeridas: Flask, Express.js, FastAPI (a elección). Los reportes deben poder visualizarse en navegador y/o descargarse en PDF/CSV.
Reportes obligatorios:
Productos con stock bajo — Lista de todos los productos cuyo stock actual es menor o igual al stock mínimo, ordenados por urgencia (menor stock primero)
Productos más movidos — Top 10 de productos con más salidas en un rango de fechas dado (parámetros: fecha_inicio, fecha_fin)
Valor total del inventario — Suma de (precio unitario × stock actual) de todos los productos, desglosado por categoría
Movimientos por fecha — Listado de todos los movimientos (entradas y salidas) filtrados por rango de fechas, con totales
Resumen por proveedor — Cantidad de productos y valor total de inventario agrupado por proveedor
Requisitos técnicos:
Dockerfile propio
docker-compose.yml que defina el servicio con variables de entorno para conectarse a la BD (Máquina 2)
Este servicio se conecta directamente a la base de datos (Máquina 2), NO pasa por la app web
Debe exponer una API REST que la App Web (Máquina 1) pueda consumir para mostrar los reportes en su interfaz
Variables de entorno: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
El contenedor debe exponer el puerto 8081
Requisitos de Conectividad (todos los integrantes)
Instalar Tailscale en cada máquina para crear la red VPN del equipo
Documentar las IPs de Tailscale asignadas a cada máquina
Cada docker-compose.yml debe usar variables de entorno (archivo .env) para las IPs y credenciales — nunca hardcodear IPs en el código
Demostrar que los 3 servicios funcionan simultáneamente, cada uno en su máquina, comunicándose entre sí
Entregables
Repositorio Git (GitHub/GitLab) con el código de los 3 servicios, cada uno en su carpeta:
/app-web/          → Dockerfile, docker-compose.yml, código, .env.example
/base-datos/       → docker-compose.yml, scripts de inicialización, .env.example
/servicio-reportes/ → Dockerfile, docker-compose.yml, código, .env.example
Documentación (README.md) que incluya:
Diagrama de arquitectura del sistema
Diagrama de base de datos (ER o modelo de documentos)
Instrucciones de despliegue paso a paso
Captura de pantalla de Tailscale mostrando las 3 máquinas conectadas
Capturas de los servicios funcionando
Demostración en vivo — Los 3 integrantes ejecutan su servicio desde su máquina y demuestran el sistema funcionando de extremo a extremo
   Consideraciones Adicionales
Cada integrante es responsable de su máquina/servicio pero el equipo debe coordinarse para definir: el esquema de base de datos, los endpoints de la API, y las variables de entorno compartidas
Está prohibido ejecutar los 3 servicios en la misma máquina para la demostración final
