# Despliegue en Vercel con Postgres

Este proyecto sigue usando SQLite en local, pero para produccion en Vercel genera Prisma con un schema temporal para PostgreSQL.

## 1. Sube el proyecto a GitHub

Sube la carpeta `Ventas` a un repositorio.

## 2. Crea una base de datos Postgres

Puedes usar Supabase, Neon o Railway.

Para Supabase usa:

- `DATABASE_URL`: pooler en puerto `6543`
- `DIRECT_URL`: conexion directa en puerto `5432`

## 3. Configura variables de entorno en Vercel

En el proyecto de Vercel añade:

- `DATABASE_URL`
- `DIRECT_URL`
- `AUTH_SECRET`
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `GOOGLE_SHEETS_ID` (opcional)

Usa como referencia [`.env.example`](/Users/simongnegrete/Ventas/.env.example).

## 4. Publica el schema en Postgres

Antes del primer deploy, ejecuta en tu terminal:

```bash
cd /Users/simongnegrete/Ventas
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres" \
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true&connection_limit=1" \
npm run db:push:supabase
```

Esto genera los schemas temporales de Prisma y crea las tablas en Postgres.

## 5. Migra los datos actuales desde SQLite

Si quieres conservar tus datos actuales:

```bash
cd /Users/simongnegrete/Ventas
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres" \
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true&connection_limit=1" \
npm run migrate:supabase
```

Este script:

1. lee `prisma/dev.db`
2. vacia las tablas destino en Postgres
3. copia usuarios, configuracion, equipo, proyectos, borradores y lineas
## 6. Importa el proyecto en Vercel

- Importa el repositorio
- Framework: `Next.js`
- El archivo [`vercel.json`](/Users/simongnegrete/Ventas/vercel.json) ya fuerza el build correcto para Postgres

## 7. Despliega

Vercel ejecutara:

```bash
npm run build:vercel
```

Ese script:

1. genera `prisma/schema.vercel.prisma`
2. genera Prisma Client para PostgreSQL
3. construye la app con Next.js
