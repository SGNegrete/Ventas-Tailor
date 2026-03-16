#!/bin/bash
set -e

echo "================================================"
echo "  Configurando la aplicación de Estimaciones"
echo "================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no está instalado. Ejecuta:"
  echo "   brew install node"
  exit 1
fi

echo "✅ Node.js $(node --version) detectado"
echo ""

# Install dependencies
echo "📦 Instalando dependencias..."
npm install

echo ""
echo "⚙️  Generando cliente Prisma..."
npx prisma generate

echo ""
echo "🗄️  Creando base de datos SQLite..."
npx prisma db push

echo ""
echo "================================================"
echo "  ✅ ¡Todo listo!"
echo ""
echo "  Para arrancar la app:"
echo "    npm run dev"
echo ""
echo "  Luego abre: http://localhost:3000"
echo "================================================"
