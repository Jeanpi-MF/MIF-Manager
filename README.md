# MIF Manager — Xerox

App web para gestión de MIFs y equivalencias de impresoras Xerox.
Desarrollada con Next.js 14, TypeScript y Tailwind CSS.

---

## Requisitos

- Node.js 18 o superior
- npm o yarn

---

## Instalación local

```bash
# 1. Entrar al proyecto
cd mif-manager

# 2. Instalar dependencias
npm install

# 3. Correr en modo desarrollo
npm run dev
```

Abre http://localhost:3000 en tu navegador.

---

## Build para producción

```bash
npm run build
npm run start
```

---

## Deploy en Vercel (recomendado)

### Opción A — Desde GitHub (la más fácil)
1. Sube esta carpeta a un repositorio en GitHub
2. Ve a https://vercel.com → "Add New Project"
3. Conecta tu repo → Deploy
4. Listo, Vercel detecta Next.js automáticamente

### Opción B — Con Vercel CLI
```bash
npm install -g vercel
vercel
```

### Opción B — Netlify
1. Sube a GitHub
2. Ve a https://app.netlify.com → "Add new site"
3. Conecta el repo
4. Build command: `npm run build`
5. Publish directory: `.next`

---

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx        # Layout raíz (fuentes, metadata)
│   ├── page.tsx          # Shell principal de la app
│   └── globals.css       # Estilos globales + Tailwind
│
├── components/
│   ├── ui/
│   │   └── index.tsx     # Badge, Button, Modal, Field, Card...
│   └── modules/
│       ├── Sidebar.tsx   # Navegación lateral
│       ├── Dashboard.tsx # Stats + últimos clientes + ranking
│       ├── Clients.tsx   # Lista de clientes + detalle + equipos
│       ├── Equivalences.tsx # Tabla maestra de equivalencias
│       └── Catalog.tsx   # Catálogo Xerox completo
│
├── lib/
│   ├── catalog.ts        # Datos del catálogo Xerox (VersaLink + AltaLink)
│   ├── suggest.ts        # Motor de sugerencias (exacto → parcial → volumen)
│   ├── store.ts          # Hook useStore con localStorage
│   └── export.ts         # Exportación a CSV (por cliente y global)
│
└── types/
    └── index.ts          # TypeScript types: Client, Device, Equivalence...
```

---

## Cómo escalar a base de datos compartida

Cuando quieras que todo el equipo comparta los mismos datos:

### Opción recomendada: Supabase (gratis)
1. Crear proyecto en https://supabase.com
2. Crear las tablas: `clients`, `devices`, `equivalences`
3. Reemplazar `src/lib/store.ts` con llamadas a la API de Supabase
4. Usar `@supabase/supabase-js`

```bash
npm install @supabase/supabase-js
```

El resto de la app (componentes, tipos, lógica) no cambia.

---

## Variables de entorno (para cuando uses Supabase)

Crear archivo `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

---

## Tecnologías

| Tech | Versión | Uso |
|------|---------|-----|
| Next.js | 14 | Framework React con App Router |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 3 | Estilos utilitarios |
| Lucide React | 0.383 | Iconos |
| localStorage | — | Persistencia local (por usuario) |
