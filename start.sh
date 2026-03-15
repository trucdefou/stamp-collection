#!/bin/bash
# Stamp Collection - Startup Script
# Usage: bash start.sh

set -e

echo "════════════════════════════════════════════"
echo "   🏛  Colección de Estampillas"
echo "   Sistema de Catalogación Filatélica"
echo "════════════════════════════════════════════"
echo ""

# --- Backend ---
echo "📦 Configurando backend (FastAPI)..."
cd backend

if [ ! -d "venv" ]; then
    echo "   Creando entorno virtual..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "🚀 Iniciando backend en http://localhost:8000"
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# --- Frontend ---
echo ""
echo "📦 Configurando frontend (Next.js)..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "   Instalando dependencias..."
    npm install
fi

echo "🚀 Iniciando frontend en http://localhost:3000"
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "════════════════════════════════════════════"
echo "   ✅ Todo listo!"
echo ""
echo "   🌐 Galería pública:  http://localhost:3000"
echo "   🔧 Admin panel:      http://localhost:3000/admin"
echo "   📡 API (docs):       http://localhost:8000/docs"
echo ""
echo "   👤 Usuario: admin"
echo "   🔑 Clave:   admin123"
echo ""
echo "   Presiona Ctrl+C para detener todo"
echo "════════════════════════════════════════════"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
