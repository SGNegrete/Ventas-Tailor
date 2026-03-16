# Despliegue en Vercel con Postgres

Este proyecto sigue usando SQLite en local, pero para produccion en Vercel genera Prisma con un schema temporal para PostgreSQL.

## 1. Sube el proyecto a GitHub

Sube la carpeta `Ventas` a un repositorio.

## 2. Crea una base de datos Postgres

Puedes usar Vercel Postgres, Neon, Supabase o Railway.

Necesitas una `DATABASE_URL` de PostgreSQL.

## 3. Configura variables de entorno en Vercel

En el proyecto de Vercel añade:

- `DATABASE_URL`
- `AUTH_SECRET`
- `GOOGLE_SERVICE_ACCOUNT_KEY`
- `GOOGLE_SHEETS_ID` (opcional)

Usa como referencia [`.env.example`](/Users/simongnegrete/Ventas/.env.example).

## 4. Publica el schema en Postgres

Antes del primer deploy, ejecuta en tu terminal:

```bash
cd /Users/simongnegrete/Ventas
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require" npm run db:push:vercel
```

Esto genera un schema temporal de Prisma para Vercel y crea las tablas en Postgres.

## 5. Importa el proyecto en Vercel

- Importa el repositorio
- Framework: `Next.js`
- El archivo [`vercel.json`](/Users/simongnegrete/Ventas/vercel.json) ya fuerza el build correcto para Postgres

## 6. Despliega

Vercel ejecutara:

```bash
npm run build:vercel
```

Ese script:

1. genera `prisma/schema.vercel.prisma`
2. genera Prisma Client para PostgreSQL
3. construye la app con Next.js

## Nota sobre los datos actuales

Tus datos actuales estan en SQLite (`prisma/dev.db`). `db push` crea la estructura en Postgres, pero no mueve automaticamente los datos.

Si quieres conservar los datos actuales, el siguiente paso es hacer una migracion de datos de SQLite a Postgres.
