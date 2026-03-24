# KitchenBar — Design System

> **Fuente de referencia**: Imagen de marca oficial (Marzo 2026) · `kitchenbar.vercel.app/landing`
>
> Este documento es la guía de referencia para todo el frontend de `kitchenbar.web`. Cualquier decisión de color, tipografía o espaciado debe consultar este documento primero.

---

## Estructura del Sistema de Estilos

```
kitchenbar.web/src/
├── styles.scss                          ← Entrada global: imports, utilidades, PrimeNG overrides
└── assets/layout/styles/
    ├── _kitchen.scss                    ← (reservado para overrides de tema PrimeNG)
    ├── loading-states.scss              ← Animaciones de carga
    └── layout/
        ├── _design-tokens.scss          ← ⭐ FUENTE ÚNICA DE VERDAD — tokens CSS
        ├── _variables.scss              ← Variables SCSS ($scale, $borderRadius, rampa primarios)
        ├── _typography.scss             ← Tipografía base y clases de texto
        ├── layout.scss                  ← Layout principal (sidebar, topbar, content)
        ├── _topbar.scss
        ├── _menu.scss
        ├── _config.scss
        ├── _content.scss
        ├── _footer.scss
        ├── _breadcrumb.scss
        ├── _responsive.scss
        ├── _mixins.scss
        ├── _preloading.scss
        └── _utils.scss
```

### Regla de oro

> **NUNCA escribir un valor de color hexadecimal directamente en un componente.**
> Usar **siempre** las variables `--kb-*` definidas en `_design-tokens.scss`.

---

## Paleta de Colores Oficial

| Token | Valor | Uso |
|-------|-------|-----|
| `--kb-gold` | `#BA9626` | **Primario** — botones CTA, highlights, links |
| `--kb-gold-light` | `#D4AF37` | Hover de botones gold |
| `--kb-gold-dark` | `#8A6E1A` | Active / pressed de botones gold |
| `--kb-teal` | `#00818A` | **Secundario** — fondos hero, gradientes, iconografía |
| `--kb-teal-light` | `#009CA6` | Hover teal |
| `--kb-teal-dark` | `#005a61` | Active teal / gradiente profundo |
| `--kb-yellow` | `#FFF080` | Acento amarillo — badges, tooltips, highlights |
| `--kb-lime` | `#88F640` | Acento verde lima — estados "listo", éxito vivo |
| `--kb-red` | `#900000` | Error, stock bajo, alertas críticas |
| `--kb-burgundy` | `#6A2434` | Destructivo, tags especiales |
| `--kb-brown` | `#54350E` | Textos oscuros sobre fondo claro, footer |

### Paleta semántica PrimeNG

| Variable CSS | Valor |
|---|---|
| `--primary-color` | `var(--kb-gold)` |
| `--primary-500` | `#BA9626` |
| `--surface-ground` | `#FAFAF8` |
| `--surface-border` | `rgba(0,129,138,0.15)` |
| `--text-color` | `#1A1714` |
| `--text-color-secondary` | `#4A4640` |

### Gradientes disponibles

```scss
var(--kb-gradient-hero)    // teal → teal-dark  (fondos hero / auth)
var(--kb-gradient-gold)    // gold-light → gold-dark  (CTAs especiales)
var(--kb-gradient-warm)    // gold → brown  (elementos cálidos)
var(--kb-gradient-feature) // teal → gold  (íconos de features)
```

---

## Tipografía

**Fuente**: **Outfit** (Google Fonts) · `wght@300;400;500;600;700;800`

Mapeada como "Modern Sans" en la guía tipográfica de la marca.

```html
<!-- En index.html (ya incluida via @import en styles.scss) -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Escala tipográfica

| Token | Valor | Uso |
|-------|-------|-----|
| `--kb-font-size-xs` | `0.75rem` | Captions, labels |
| `--kb-font-size-sm` | `0.875rem` | Texto pequeño |
| `--kb-font-size-base` | `1rem` | Cuerpo principal |
| `--kb-font-size-lg` | `1.25rem` | Subtítulos |
| `--kb-font-size-xl` | `1.5rem` | Títulos de card |
| `--kb-font-size-2xl` | `2rem` | H4 |
| `--kb-font-size-3xl` | `2.5rem` | H3 |
| `--kb-font-size-4xl` | `3rem` | H2 |
| `--kb-font-size-hero` | `4rem` | H1 / hero headline |

### Pesos de fuente

| Token | Valor | Equivalente |
|-------|-------|-------------|
| `--kb-font-weight-light` | `300` | Modern Sans Light |
| `--kb-font-weight-regular` | `400` | Modern Sans Regular |
| `--kb-font-weight-semibold` | `600` | — |
| `--kb-font-weight-bold` | `700` | Modern Sans Bold |
| `--kb-font-weight-black` | `800` | Display / Hero |

### Clases de texto utilitarias

```html
<p class="text-display">Headline hero enorme</p>
<p class="text-lead">Subtítulo de sección suave</p>
<span class="text-caption">LABEL MAYÚSCULA</span>
```

---

## Espaciado

Escala basada en múltiplos de **8px**:

| Token | Valor |
|-------|-------|
| `--kb-space-1` | `4px` |
| `--kb-space-2` | `8px` |
| `--kb-space-4` | `16px` |
| `--kb-space-6` | `24px` |
| `--kb-space-8` | `32px` |
| `--kb-space-12` | `48px` |
| `--kb-space-16` | `64px` |
| `--kb-space-32` | `128px` |

---

## Border Radius

| Token | Valor | Uso |
|-------|-------|-----|
| `--kb-radius-sm` | `6px` | Tags, badges pequeños |
| `--kb-radius-md` | `12px` | Inputs, botones |
| `--kb-radius-lg` | `16px` | Cards |
| `--kb-radius-xl` | `20px` | Cards grandes |
| `--kb-radius-2xl` | `24px` | Modales, auth cards |
| `--kb-radius-full` | `9999px` | Pills, CTAs redondeados |

---

## Sombras

```scss
var(--kb-shadow-xs)    // 0 1px 3px rgba(0,0,0,.06)
var(--kb-shadow-sm)    // 0 4px 12px rgba(0,0,0,.06)   ← cards
var(--kb-shadow-md)    // 0 8px 24px rgba(0,0,0,.08)
var(--kb-shadow-lg)    // 0 15px 40px rgba(0,0,0,.12)  ← auth cards
var(--kb-shadow-xl)    // 0 25px 60px rgba(0,0,0,.16)  ← modales

var(--kb-shadow-gold)  // 0 6px 20px rgba(186,150,38,.30)  ← botones gold
var(--kb-shadow-teal)  // 0 6px 20px rgba(0,129,138,.25)   ← botones teal
```

---

## Transiciones

```scss
var(--kb-transition-fast)    // 0.15s ease
var(--kb-transition-base)    // 0.25s ease
var(--kb-transition-smooth)  // 0.3s cubic-bezier(0.4,0,0.2,1)  ← preferida
var(--kb-transition-slow)    // 0.5s ease
```

---

## Clases Utilitarias Globales

Disponibles desde `styles.scss` en cualquier componente:

### Color
```html
<span class="text-kb-gold">Texto dorado</span>
<span class="text-kb-teal">Texto teal</span>
<div class="bg-kb-teal">Fondo teal</div>
```

### Glassmorphism
```html
<div class="glass-card-effect">Card translúcida</div>
<nav class="glass-nav">Navbar translúcida</nav>
```

### Gradiente Hero / Auth
```html
<!-- Aplicado automáticamente a: .register-wrapper, .login-wrapper, .hero-section, .cta-section -->
<section class="hero-section">...</section>
```

---

## PrimeNG — Comportamiento de botones

| Clase | Color | Uso |
|-------|-------|-----|
| `p-button` (default) | Gold `#BA9626` | CTA principal |
| `p-button-secondary` | Teal `#00818A` | Acción secundaria |
| `p-button-outlined` | Border gold | Terciaria / cancelar |
| `p-button-brand-primary` | Gold con hover lift | Hero CTA especial |

---

## Animaciones CSS disponibles

```scss
animation: kb-slide-up 0.4s var(--kb-transition-smooth);
animation: kb-fade-in 0.3s ease;
animation: kb-scale-in 0.3s ease;
animation: kb-pulse 2s infinite;
```

---

## Z-Index Scale

| Token | Valor | Uso |
|-------|-------|-----|
| `--kb-z-base` | `0` | Elementos normales |
| `--kb-z-raised` | `10` | Cards elevadas |
| `--kb-z-dropdown` | `100` | Dropdowns |
| `--kb-z-sticky` | `200` | Headers sticky |
| `--kb-z-overlay` | `500` | Overlays de página |
| `--kb-z-modal` | `1000` | Modales |
| `--kb-z-toast` | `2000` | Notificaciones toast |

---

## Convención para nuevos componentes

```scss
// ✅ CORRECTO — usar tokens
.mi-componente {
  background: var(--kb-gradient-hero);
  color: var(--kb-white);
  border-radius: var(--kb-radius-lg);
  box-shadow: var(--kb-shadow-md);
  transition: var(--kb-transition-smooth);
  padding: var(--kb-space-6) var(--kb-space-8);
}

// ❌ INCORRECTO — nunca hardcodear
.mi-componente {
  background: #00818A;
  border-radius: 16px;
}
```

---

## Assets y Logos

```
kitchenbar.web/src/assets/
├── icons/         ← Íconos SVG de la marca
├── images/        ← Imágenes y logos
└── layout/images/ ← Imágenes del layout
```

**Tamaños de ícono de aplicación (guía de marca):**

| Plataforma | Tamaño |
|------------|--------|
| iOS | 180×180 px |
| Android | 192×192 px |
| Favicon | 5mm (32×32 px) |
| Full logo | 1024×1024 px |

---

*Última actualización: Marzo 2026 — Implementado por Antigravity AI*
