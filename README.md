# Sistema de Inventario Distribuido

Sistema de inventario desplegado en 3 maquinas conectadas mediante Tailscale VPN, desarrollado como proyecto grupal de Sistemas Distribuidos.

## Arquitectura

| Maquina | Responsable | Servicio | Puerto |
|---------|-------------|----------|--------|
| Maquina 1 | Leonidas | Frontend + API CRUD (`app-web/`) | 8080 |
| Maquina 2 | Alejandro | Base de datos PostgreSQL (`base-datos/`) | 5432, 5050 |
| Maquina 3 | Steeven | Servicio de Reportes (`servicio-reportes/`) | 8081 |

## Estructura del Proyecto

```
proyecto_sd/
├── app-web/                    # Maquina 1 - Frontend + API CRUD
│   ├── docker-compose.yml
│   └── .gitignore
├── base-datos/                 # Maquina 2 - PostgreSQL + pgAdmin
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── .gitignore
│   └── scripts/
│       ├── 01-ddl.sql          # Esquema de base de datos
│       └── 02-seed.sql         # Datos iniciales
└── servicio-reportes/          # Maquina 3 - API de Reportes (FastAPI)
    ├── docker-compose.yml
    ├── Dockerfile
    ├── requirements.txt
    ├── .env.example
    ├── .gitignore
    └── app/
        ├── main.py             # Aplicacion FastAPI
        ├── config.py           # Configuracion con variables de entorno
        ├── database.py         # Pool de conexiones asyncpg
        ├── models.py           # Modelos Pydantic
        ├── reports/
        │   ├── queries.py      # Consultas SQL
        │   └── router.py       # Endpoints de reportes
        └── export/
            ├── csv_export.py   # Exportacion a CSV
            └── pdf_export.py   # Exportacion a PDF
```

## Base de Datos

4 tablas principales:

- **categorias** - Categorias de productos
- **proveedores** - Proveedores del inventario
- **productos** - Productos con stock actual y minimo
- **movimientos** - Entradas y salidas de inventario

Datos seed incluidos: 5 categorias, 5 proveedores, 20 productos y 30 movimientos.

## API de Reportes

Base URL: `http://[IP]:8081`

| Metodo | Ruta | Parametros | Descripcion |
|--------|------|------------|-------------|
| GET | `/health` | — | Health check |
| GET | `/api/reportes/stock-bajo` | `formato` | Productos con stock <= minimo |
| GET | `/api/reportes/productos-mas-movidos` | `fecha_inicio`, `fecha_fin`, `formato` | Top 10 productos por salidas |
| GET | `/api/reportes/valor-inventario` | `formato` | Valor total por categoria |
| GET | `/api/reportes/movimientos` | `fecha_inicio`, `fecha_fin`, `formato` | Movimientos con totales |
| GET | `/api/reportes/resumen-proveedores` | `formato` | Resumen por proveedor |

El parametro `formato` acepta: `json` (default), `pdf`, `csv`.

Documentacion interactiva disponible en: `http://[IP]:8081/docs`

## Despliegue

### Requisitos

- Docker y Docker Compose instalados en las 3 maquinas
- Tailscale instalado y conectado en las 3 maquinas

### 1. Obtener IPs de Tailscale

En cada maquina ejecutar:

```bash
tailscale ip -4
```

Anotar las IPs asignadas (formato `100.x.x.x`).

### 2. Maquina 2 - Base de Datos (Alejandro)

```bash
cd base-datos
cp .env.example .env
# Editar .env si se desean cambiar las credenciales
docker compose up -d
```

Verificar en pgAdmin: `http://localhost:5050`

### 3. Maquina 3 - Servicio de Reportes (Steeven)

```bash
cd servicio-reportes
cp .env.example .env
# Editar .env: reemplazar [TAILSCALE_IP_MAQUINA_2] con la IP real de Alejandro
docker compose up --build
```

### 4. Maquina 1 - Frontend (Leonidas)

```bash
cd app-web
cp .env.example .env
# Configurar DB_HOST y REPORT_SERVICE_URL con las IPs de Tailscale
docker compose up --build
```

## Verificacion

```bash
# Health check
curl http://localhost:8081/health

# Stock bajo
curl http://localhost:8081/api/reportes/stock-bajo

# Productos mas movidos
curl "http://localhost:8081/api/reportes/productos-mas-movidos?fecha_inicio=2026-01-01&fecha_fin=2026-02-28"

# Valor del inventario
curl http://localhost:8081/api/reportes/valor-inventario

# Movimientos
curl "http://localhost:8081/api/reportes/movimientos?fecha_inicio=2026-01-01&fecha_fin=2026-02-28"

# Resumen proveedores
curl http://localhost:8081/api/reportes/resumen-proveedores

# Exportar a PDF
curl -o reporte.pdf "http://localhost:8081/api/reportes/stock-bajo?formato=pdf"

# Exportar a CSV
curl -o reporte.csv "http://localhost:8081/api/reportes/stock-bajo?formato=csv"
```

## Tecnologias

- **Base de datos**: PostgreSQL 16, pgAdmin 4
- **Servicio de reportes**: Python 3.12, FastAPI, asyncpg, reportlab
- **Contenedores**: Docker, Docker Compose
- **Red**: Tailscale VPN
