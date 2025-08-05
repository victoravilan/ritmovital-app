# 🚀 Guía de Despliegue - Equilibrio Vital

## 📱 Dos Versiones Separadas

### 🆓 **Versión Lite (Gratuita)**
- **Funcionalidades**: Análisis individual de biorritmos
- **Target**: Usuarios gratuitos
- **URL sugerida**: `equilibrio-vital-lite.netlify.app`

### 👑 **Versión Pro (Premium)**
- **Funcionalidades**: Comparación múltiple, análisis grupal
- **Target**: Google Play Store (venta)
- **URL sugerida**: `equilibrio-vital-pro.netlify.app`

## 🔧 Configuración de Netlify

### Para Versión Lite:
1. Crear nuevo sitio en Netlify
2. Conectar repositorio GitHub
3. **Build settings**:
   - Build command: `npm run build:lite`
   - Publish directory: `out`
   - **Environment variables**:
     ```
     NEXT_PUBLIC_APP_VERSION=lite
     NODE_VERSION=18
     ```

### Para Versión Pro:
1. Crear otro sitio en Netlify
2. Conectar el mismo repositorio GitHub
3. **Build settings**:
   - Build command: `npm run build:pro`
   - Publish directory: `out`
   - **Environment variables**:
     ```
     NEXT_PUBLIC_APP_VERSION=pro
     NEXT_PUBLIC_ENABLE_PRO=true
     NODE_VERSION=18
     ```

## 🛠️ Scripts de Desarrollo

```bash
# Desarrollo versión Lite
npm run dev:lite

# Desarrollo versión Pro
npm run dev:pro

# Build versión Lite
npm run build:lite

# Build versión Pro
npm run build:pro
```

## 📋 Diferencias entre Versiones

| Característica | Lite | Pro |
|---|---|---|
| Análisis individual | ✅ | ✅ |
| Gráfico 31 días | ✅ | ✅ |
| Selector de fecha | ✅ | ✅ |
| Recomendaciones | ✅ | ✅ |
| **Comparación múltiple** | ❌ | ✅ |
| **Análisis grupal** | ❌ | ✅ |
| **Gestión de personas** | ❌ | ✅ |
| **Recomendaciones grupales** | ❌ | ✅ |

## 🎯 URLs de Acceso

### Versión Lite:
- Página principal: `/`
- Solo funcionalidades básicas

### Versión Pro:
- Página principal: `/` (con acceso a Pro)
- Página Pro directa: `/pro`
- Funcionalidades completas

## 📱 Para Google Play Store

La **Versión Pro** será la que se empaquete para Google Play usando:
- Capacitor o similar
- URL base: versión Pro de Netlify
- Funcionalidades completas habilitadas