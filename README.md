# 💰 Finanzas - App PWA

Tu app personal de gestión de ingresos y gastos. Funciona offline, se instala como app nativa en iPhone/Android, y se sincroniza con tu Google Sheet vía exportar/importar CSV.

---

## 🚀 Cómo desplegarla en internet (5 minutos)

### Paso 1: Crea cuenta en GitHub (si no tienes)

1. Ve a [github.com](https://github.com) y haz clic en **Sign up**
2. Confirma tu email

### Paso 2: Sube el proyecto a GitHub

**Opción A — La más fácil (sin línea de comandos):**

1. En GitHub, haz clic en el botón verde **New** (o ve a [github.com/new](https://github.com/new))
2. Nombre del repo: `finanzas-app`
3. Elige **Public** (o Private si tienes plan)
4. NO marques nada en "Initialize this repository"
5. Click **Create repository**
6. En la siguiente página, haz click en **uploading an existing file**
7. Arrastra TODA la carpeta `finanzas-app` (sin la carpeta `node_modules` si existe)
8. Escribe un mensaje como "Initial commit" y click en **Commit changes**

**Opción B — Con git (si ya lo manejas):**

```bash
cd finanzas-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/finanzas-app.git
git push -u origin main
```

### Paso 3: Despliega con Vercel (gratis)

1. Ve a [vercel.com](https://vercel.com) y haz **Sign up with GitHub**
2. Autoriza el acceso
3. Click en **Add New → Project**
4. Busca tu repo `finanzas-app` y dale **Import**
5. NO toques nada de la configuración (Vercel detecta Vite automáticamente)
6. Click **Deploy**
7. Espera ~1 minuto

¡Te darán una URL como `https://finanzas-app-xxx.vercel.app`!

### Paso 4: Instala en tu iPhone

1. Abre **Safari** en el iPhone (debe ser Safari, no Chrome)
2. Ve a tu URL de Vercel
3. Toca el botón **Compartir** (el cuadrado con flecha hacia arriba)
4. Baja y toca **"Añadir a pantalla de inicio"**
5. Confirma con **Añadir**

¡Ya tienes la app con su ícono en el home screen! Ábrela y verás:
- ✅ Pantalla completa (sin la barra de Safari)
- ✅ Ícono propio
- ✅ Funciona sin internet
- ✅ Datos persistentes

### Para Android

Igual, pero con **Chrome**: Menú → "Añadir a pantalla de inicio" o "Instalar app"

---

## 🔄 Cómo actualizar la app

Cada vez que hagas cambios al código y los subas a GitHub, Vercel re-despliega automáticamente. No necesitas hacer nada más en tu iPhone — la app se actualiza sola la próxima vez que la abras.

---

## 👥 Compartir con tu pareja

Comparte la URL de Vercel. Cada uno instala en su iPhone y tiene **sus propios datos** (porque se guardan en cada dispositivo).

> ⚠️ **Importante:** los datos NO se sincronizan entre dispositivos en esta versión. Cada iPhone tiene su propio almacenamiento. Si quieres sync entre dispositivos, necesitamos agregar una base de datos (te lo puedo hacer después con Supabase, también gratis).

---

## 🛠️ Desarrollo local (opcional)

Si quieres correrla en tu compu para probar cambios:

```bash
npm install
npm run dev
```

Abre http://localhost:5173

---

## 📦 ¿Qué incluye?

- Dashboard con balance, ingresos, gastos y ejecución de presupuesto
- Registro de transacciones (Real / Proyectado) con recurrencia 1-12 meses
- Análisis Proyectado vs Real por categoría
- Mes financiero personalizable (inicio día 23 con ajuste a viernes si fin de semana)
- Categorías editables con emojis
- Exportar CSV
- Datos pre-cargados de Sanat desde el Google Sheet
- PWA: instalable, offline, ícono propio

---

## 🆘 Si algo no funciona

- **Vercel no encuentra el proyecto**: verifica que `package.json` esté en la raíz del repo
- **El ícono no aparece**: borra la app del iPhone y vuelve a "Añadir a pantalla de inicio"
- **No carga los datos**: ve a Ajustes → Recargar Sheet
