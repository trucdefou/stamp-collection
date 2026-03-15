# 🏛 Colección de Estampillas

Sistema de catalogación filatélica con **FastAPI** (backend) y **Next.js** (frontend).

## Requisitos previos

- **Python 3.10+**
- **Node.js 18+**
- **npm**

## Inicio rápido

```bash
# Opción 1: Script automático (Linux/macOS)
bash start.sh

# Opción 2: Manual (dos terminales)

# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

## URLs

| Servicio         | URL                          |
|------------------|------------------------------|
| Galería pública  | http://localhost:3000         |
| Panel admin      | http://localhost:3000/admin   |
| API docs (Swagger) | http://localhost:8000/docs |

## Credenciales por defecto

- **Usuario:** `admin`
- **Contraseña:** `admin123`

Puedes cambiarlas con variables de entorno:

```bash
ADMIN_USERNAME=miusuario ADMIN_PASSWORD=miclave uvicorn main:app --reload
```

## Estructura del proyecto

```
stamp-collection/
├── backend/
│   ├── main.py           # App FastAPI, endpoints
│   ├── models.py         # Modelo SQLAlchemy (Stamp)
│   ├── schemas.py        # Schemas Pydantic
│   ├── database.py       # Configuración SQLite
│   ├── auth.py           # Autenticación JWT simple
│   ├── requirements.txt
│   └── uploads/          # Imágenes subidas (auto-creado)
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Galería pública
│   │   │   ├── layout.tsx        # Layout con navegación
│   │   │   ├── globals.css       # Estilos vintage
│   │   │   ├── stamp/[id]/
│   │   │   │   └── page.tsx      # Detalle de estampilla
│   │   │   └── admin/
│   │   │       ├── page.tsx      # Panel de administración
│   │   │       └── login/
│   │   │           └── page.tsx  # Login
│   │   └── lib/
│   │       └── api.ts            # Cliente API
│   ├── package.json
│   ├── tailwind.config.js
│   └── next.config.js
├── start.sh              # Script de inicio
└── README.md
```

## Campos por estampilla

- **Nombre** y **País** (obligatorios)
- Año de emisión
- Categoría / Temática
- Estado de conservación (Mint, Near Mint, Fine, Very Fine, Good, Used, Poor)
- Valor estimado y precio de compra
- Fecha de adquisición
- Notas personales
- Imagen

## API Endpoints

### Públicos
- `GET /api/stamps` — Listar con filtros y paginación
- `GET /api/stamps/{id}` — Detalle de una estampilla
- `GET /api/filters` — Países, categorías y condiciones disponibles
- `GET /api/stats` — Estadísticas de la colección

### Autenticación
- `POST /api/auth/login` — Obtener token JWT

### Admin (requiere token)
- `POST /api/admin/stamps` — Crear estampilla (multipart/form-data)
- `PUT /api/admin/stamps/{id}` — Editar estampilla
- `DELETE /api/admin/stamps/{id}` — Eliminar estampilla

## Tecnologías

- **Backend:** FastAPI, SQLAlchemy, SQLite, JWT
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Diseño:** Estética vintage filatélica con tipografía Playfair Display + Source Serif 4
