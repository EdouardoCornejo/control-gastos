# Control de Gastos

**Planificador de gastos personal** hecho con **React 19 + Vite**. Defines un **presupuesto**, registras tus **gastos por categoría** y ves en tiempo real cuánto has gastado y cuánto te queda, con una **gráfica circular de progreso**. Los gastos se **editan y eliminan deslizando** cada elemento y todo se guarda en el **`localStorage`** del navegador: sin backend, nada sale de tu dispositivo.

**Demo:** https://control-gastos-nine-sigma.vercel.app

![Tech](https://img.shields.io/badge/React-19-61DAFB)
![Tech](https://img.shields.io/badge/Vite-8-646CFF)
![Tech](https://img.shields.io/badge/react--circular--progressbar-2-3B82F6)
![Tech](https://img.shields.io/badge/react--swipeable--list-1-lightgrey)
![Tech](https://img.shields.io/badge/CSS3-blueviolet)

---

## Tabla de contenidos

- [Control de Gastos](#control-de-gastos)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
  - [Uso](#uso)
  - [Cómo funciona](#cómo-funciona)
    - [1. `src/App.jsx`](#1-srcappjsx)
    - [2. `src/helpers/index.js`](#2-srchelpersindexjs)
    - [3. Presupuesto: `NuevoPresupuesto` y `ControlPresupuesto`](#3-presupuesto-nuevopresupuesto-y-controlpresupuesto)
    - [4. Gastos: `Modal`, `ListadoGastos`, `Gasto` y `Filtros`](#4-gastos-modal-listadogastos-gasto-y-filtros)
    - [5. Seguridad: `vite.config.js` y `vercel.json`](#5-seguridad-viteconfigjs-y-verceljson)
    - [Flujo de la aplicación](#flujo-de-la-aplicación)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **Definir un presupuesto** inicial (debe ser un número mayor que 0).
- **Gráfica circular** con el porcentaje gastado, que se vuelve roja al superar el 100 %.
- Resumen de **Presupuesto**, **Disponible** (marcado en negativo si te pasas) y **Gastado**, en formato moneda USD.
- **Añadir gastos** desde un modal animado: nombre, cantidad y categoría.
- **Editar** (deslizar a la derecha) y **eliminar** (deslizar a la izquierda) cada gasto.
- **7 categorías**, cada una con su icono: Ahorro, Comida, Casa, Gastos, Ocio, Salud y Suscripciones.
- **Filtrar gastos** por categoría.
- Fecha de alta de cada gasto en formato largo en español.
- **Resetear la app** con confirmación dentro de la propia interfaz (sin `confirm()`, que no funciona en iframes sin `allow-modals`).
- **Persistencia en `localStorage`**, descartando datos corruptos o manipulados al leerlos.

---

## Cómo ejecutar el proyecto

Requisitos: **Node.js `^20.19.0 || >=22.12.0`** (requerido por Vite 8).

```bash
npm install
npm run dev
```

| Comando           | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                   |
| `npm run build`   | Build de producción en `dist/`           |
| `npm run preview` | Sirve el build de producción en local    |

No necesita variables de entorno. Está desplegado en **Vercel** como sitio estático de Vite; las cabeceras de respuesta se configuran en `vercel.json`.

---

## Uso

1. Escribe tu presupuesto en **Definir Presupuesto** y pulsa **Añadir**.
2. Pulsa el botón flotante de _nuevo gasto_ (abajo a la derecha) para abrir el modal y crear un gasto.
3. En la lista, **desliza un gasto a la derecha** para _Editar_ o **a la izquierda** para _Eliminar_.
4. Usa **Filtrar Gastos** para ver solo una categoría (vuelve a _-- Seleccione --_ para ver todas).
5. **Resetear App** → **Sí, reiniciar** borra presupuesto y gastos y vuelve a la pantalla inicial.

---

## Cómo funciona

### 1. `src/App.jsx`

Componente raíz y dueño del estado:

- `gastos` y `presupuesto` se inicializan de forma diferida con `leerGastosLS` y `leerPresupuestoLS`, y se guardan en `localStorage` (claves `gastos` y `presupuesto`) con un `useEffect` por cada uno.
- `isValidPresupuesto` decide si se muestra la pantalla de alta de presupuesto o el panel de control; al montar se activa si ya hay un presupuesto válido guardado.
- `modal` / `animarModal` controlan la apertura y la animación del modal (con `setTimeout` de 500 ms).
- `gastoEditar`: al recibir un gasto (desde el deslizamiento), un `useEffect` abre el modal en modo edición.
- `guardarGasto(gasto)`: si tiene `id` lo reemplaza con `map`; si no, le asigna `generarId()` y `fecha = Date.now()` y lo añade.
- `EliminarGasto(id)`: filtra el gasto de la lista.
- `filtro` / `gastosFiltrados`: un `useEffect` sobre `filtro` calcula los gastos de la categoría elegida.

### 2. `src/helpers/index.js`

- `generarId()`: id aleatorio en base 36 + marca de tiempo.
- `formatearFecha(fecha)`: `toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: '2-digit' })`.
- `esCantidadValida(cantidad)`: número finito y mayor que 0.
- `leerGastosLS()`: parsea `localStorage['gastos']` en un `try/catch` y conserva solo los gastos con `id` y `nombre` de tipo texto, categoría incluida en `CATEGORIAS` y cantidad válida.
- `leerPresupuestoLS()`: devuelve el presupuesto guardado si es válido, o `0`.

### 3. Presupuesto: `NuevoPresupuesto` y `ControlPresupuesto`

- **`Header`** muestra uno u otro según `isValidPresupuesto`.
- **`NuevoPresupuesto`**: formulario que valida con `esCantidadValida` y muestra _"No es un Presupuesto valido"_ si falla.
- **`ControlPresupuesto`**: recalcula `gastado`, `disponible` y `porcentaje` cuando cambian los gastos; pinta `CircularProgressbar` (azul `#3B82F6`, rojo `#DC2626` por encima del 100 %), formatea importes con `formatearCantidad` (`en-US`, `USD`) y gestiona el reseteo con el estado `confirmarReset`.

### 4. Gastos: `Modal`, `ListadoGastos`, `Gasto` y `Filtros`

- **`Modal`**: formulario de nuevo gasto / edición. Valida que no haya campos vacíos (_"Todos los campos son obligatorios"_) y que la cantidad sea mayor que 0; los mensajes desaparecen a los 2 segundos. Al guardar llama a `guardarGasto`.
- **`ListadoGastos`**: muestra `gastosFiltrados` si hay filtro activo o todos los `gastos`, con mensajes para listas vacías.
- **`Gasto`**: elemento de `react-swipeable-list` con `LeadingActions` (Editar) y `TrailingActions` (Eliminar, `destructive`); el icono sale de `diccionarioIconos` según la categoría.
- **`Filtros`**: `select` de categorías conectado a `filtro`.
- **`Mensaje`**: caja de alerta con clase según `tipo`.

### 5. Seguridad: `vite.config.js` y `vercel.json`

- `vite.config.js` define el plugin `cspPlugin` (`apply: 'build'`), que inyecta una `<meta http-equiv="Content-Security-Policy">` solo en el build, porque el servidor de desarrollo necesita scripts inline para HMR.
- `vercel.json` envía la misma CSP como cabecera, con `frame-ancestors` limitado a `'self'`, al portfolio y a `localhost:3000` / `localhost:3001`; además `nosniff`, `Referrer-Policy`, `Permissions-Policy` y caché inmutable de un año para `/assets/*`.

### Flujo de la aplicación

```
main.jsx  (normalize.css + index.css)
  └─ <App>
       ├─ useState(leerGastosLS) / useState(leerPresupuestoLS)
       ├─ useEffect → localStorage.setItem('gastos' | 'presupuesto')
       ├─ <Header>
       │     ├─ !isValidPresupuesto → <NuevoPresupuesto>  → setIsValidPresupuesto(true)
       │     └─  isValidPresupuesto → <ControlPresupuesto> → gráfica + resumen + reset
       │
       ├─ isValidPresupuesto
       │     ├─ <Filtros>        → setFiltro()  → useEffect → gastosFiltrados
       │     ├─ <ListadoGastos>
       │     │     └─ <Gasto> × N
       │     │           ├─ deslizar → Editar   → setGastoEditar(gasto) → abre <Modal>
       │     │           └─ deslizar ← Eliminar → EliminarGasto(id)
       │     └─ botón nuevo gasto → handleNuevoGasto() → abre <Modal>
       │
       └─ modal → <Modal> → handleSubmit() → guardarGasto()
                                               ├─ con id → map()
                                               └─ nuevo  → generarId() + Date.now()
```

---

## Tecnologías

- **React 19** — componentes funcionales y hooks.
- **Vite 8** — servidor de desarrollo, build y plugin propio de CSP.
- **react-circular-progressbar** — gráfica circular del presupuesto.
- **react-swipeable-list** — acciones de deslizar para editar / eliminar.
- **normalize.css** + **CSS3** propio — estilos.
- **prop-types** — incluido como dependencia.
- **Web Storage API** — persistencia en `localStorage`.
- **Vercel** — despliegue y cabeceras de seguridad.

---

## Estructura del proyecto

```
control-gastos/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ControlPresupuesto.jsx  # Gráfica, resumen y reset
│   │   ├── Filtros.jsx             # Filtro por categoría
│   │   ├── Gasto.jsx               # Elemento deslizable de la lista
│   │   ├── Header.jsx              # Alterna presupuesto nuevo / control
│   │   ├── ListadoGastos.jsx       # Lista (filtrada o completa)
│   │   ├── Mensaje.jsx             # Alertas
│   │   ├── Modal.jsx               # Alta / edición de gastos
│   │   └── NuevoPresupuesto.jsx    # Formulario de presupuesto inicial
│   ├── helpers/
│   │   └── index.js                # Id, fechas, validación y lectura de localStorage
│   ├── img/                        # Iconos de categorías, cerrar y nuevo gasto (SVG)
│   ├── App.jsx                     # Estado global y persistencia
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vercel.json                     # Cabeceras de seguridad y caché
└── vite.config.js                  # Plugin de CSP para el build
```

---

## Personalización

| Dónde                                           | Qué                                   | Valor actual                                                         |
| ----------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------- |
| `src/helpers/index.js`                          | `CATEGORIAS` válidas en `localStorage` | `ahorro`, `comida`, `casa`, `gastos`, `ocio`, `salud`, `suscripciones` |
| `src/components/ControlPresupuesto.jsx`         | Moneda de `formatearCantidad`          | `en-US` / `USD`                                                      |
| `src/components/ControlPresupuesto.jsx`         | Colores de la gráfica                  | `#3B82F6` (normal), `#DC2626` (> 100 %)                              |
| `src/helpers/index.js`                          | Idioma de `formatearFecha`             | `es-ES`                                                              |
| `vercel.json`                                   | Orígenes permitidos en `frame-ancestors` | `'self'`, portfolio, `localhost:3000`, `localhost:3001`            |

> Para añadir una categoría hay que tocarla en cuatro sitios: `CATEGORIAS` en `helpers/index.js`, las opciones de `Modal.jsx` y `Filtros.jsx`, y su icono en `diccionarioIconos` de `Gasto.jsx`.

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
