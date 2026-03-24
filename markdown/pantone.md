# KitchenBar — Implementación del Design System (Pantone Oficial)

Alinear todo el frontend de `kitchenbar.web` con la paleta oficial de la marca tal como aparece en la imagen compartida. Actualmente el proyecto usa `#F7941E` como naranja principal, pero la imagen especifica `#BA9626` (gold) y `#88F640` → en realidad el teal del logo es `#00818A`. Se crea una capa centralizada de tokens y se propaga a todos los SCSS del proyecto.

## Paleta Oficial (Brand Image)

| Token | Hex | Uso |
|-------|-----|-----|
| `--kb-yellow` | `#FFF080` | Acento amarillo claro |
| `--kb-gold` | `#BA9626` | Color primario / botones principales |
| `--kb-teal` | `#88F640` → Logo teal es `#00818A` | Fondo hero, gradiente |
| `--kb-red` | `#900000` | Errores, alertas críticas |
| `--kb-burgundy` | `#6A2434` | Acciones secundarias oscuras |
| `--kb-brown` | `#54350E` | Textos sobre fondos claros, footer |

> [!IMPORTANT]
> La imagen muestra `#88F640` como uno de los swatches, pero el color teal real del logo KitchenBar es `#00818A`. El swatch `#88F640` es el **color de acento verde-lima**. Se mantienen ambos correctamente mapeados.

## Proposed Changes

---

### Design Tokens (nuevo archivo central)

#### [NEW] [_design-tokens.scss](file:///Users/ruravi/workspace/kitchenbar/kitchenbar.web/src/assets/layout/styles/layout/_design-tokens.scss)

Archivo SCSS con todos los tokens `:root { --kb-* }` oficiales de la marca. Este archivo es la **única fuente de verdad** de colores, tipografía, espaciado y radios.

---

### Variables del Layout

#### [MODIFY] [_variables.scss](file:///Users/ruravi/workspace/kitchenbar/kitchenbar.web/src/assets/layout/styles/layout/_variables.scss)

- Actualizar `--primary-500` a `#BA9626` (gold oficial)
- Actualizar toda la rampa de tonos primary-50…primary-900 para derivar de `#BA9626`
- Importar `_design-tokens.scss`

---

### Estilos Globales

#### [MODIFY] [styles.scss](file:///Users/ruravi/workspace/kitchenbar/kitchenbar.web/src/styles.scss)

- Cambiar comentario header a **KitchenBar Design System**
- Corregir `--kb-orange` → eliminar; ahora existe `--kb-gold`, `--kb-yellow`, `--kb-lime`
- Referenciar tokens del nuevo archivo central
- Actualizar utility classes (`kb-gradient-bg`, `glass-*`, etc.)

---

### Tipografía

#### [MODIFY] [_typography.scss](file:///Users/ruravi/workspace/kitchenbar/kitchenbar.web/src/assets/layout/styles/layout/_typography.scss)

- Agregar `@import url(...)` de Google Fonts para **Outfit** (Modern Sans)
- Establecer `font-family` base en `'Outfit', sans-serif`
- Definir pesos 400 (Light), 600 (Regular) y 800 (Bold) alineados a la guía tipográfica

---

### Componentes (referencias a tokens incorrectos)

#### [MODIFY] [landing.component.scss](file:///Users/ruravi/workspace/kitchenbar/kitchenbar.web/src/app/components/landing/landing.component.scss)
- Reemplazar `var(--kb-orange)` → `var(--kb-gold)`
- Asegurar `radial-gradient` usa tokens actualizados

#### [MODIFY] [register.component.scss](file:///Users/ruravi/workspace/kitchenbar/kitchenbar.web/src/app/components/auth/register/register.component.scss)
- Reemplazar `var(--kb-orange)` → `var(--kb-gold)`
- Focus ring: usar `rgba(var(--kb-gold-rgb), 0.15)`

---

### Documentación del Sistema

#### [NEW] [DESIGN_SYSTEM.md](file:///Users/ruravi/workspace/kitchenbar/DESIGN_SYSTEM.md)

Documento de referencia completo con paleta, tipografía, tokens SCSS, estructura del proyecto de estilos y guía de uso para futuros desarrolladores.

---

## Verification Plan

### Manual

1. Correr el frontend: `cd /Users/ruravi/workspace/kitchenbar/kitchenbar.web && npx nx serve kitchenbar.web` (o el comando equivalente en [package.json](file:///Users/ruravi/workspace/kitchenbar/kitchenbar.web/package.json))
2. Navegar a `/landing` y verificar que el hero usa el gradiente teal correcto y los botones muestran el tono gold `#BA9626`
3. Navegar a `/auth/login` y `/auth/register` → verificar que el fondo es el gradiente teal y los inputs en focus destacan en gold
4. Verificar en DevTools → Computed Styles que `--kb-gold` resuelve a `#BA9626` y `--kb-teal` a `#00818A`

### Build Check

```bash
cd /Users/ruravi/workspace/kitchenbar/kitchenbar.web
npx nx build kitchenbar.web --configuration=production
```

Sin errores de compilación SCSS.
