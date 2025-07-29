# RitmoVital - Aplicación de Biorritmos

Una aplicación web moderna que calcula y visualiza tus biorritmos personales para optimizar tu vida diaria.

## Características

- 📊 Cálculo preciso de biorritmos físicos, emocionales e intelectuales
- 📈 Gráficos interactivos con visualización de tendencias
- 🎯 Recomendaciones personalizadas basadas en tu estado actual
- 🌍 Consideraciones culturales y étnicas en las recomendaciones
- 📱 Diseño responsive y moderno
- 🌙 Tema oscuro elegante

## Tecnologías Utilizadas

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Radix UI** - Componentes accesibles
- **Recharts** - Gráficos interactivos
- **Lucide React** - Iconos modernos

## Instalación y Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Verificar código
npm run lint
```

## Despliegue en Vercel

Este proyecto está optimizado para desplegarse en Vercel:

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente que es un proyecto Next.js
3. El despliegue se realizará automáticamente

## Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── global.css         # Estilos globales
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI reutilizables
│   └── ...               # Componentes específicos
├── lib/                  # Utilidades y lógica de negocio
└── ...                   # Archivos de configuración
```

## Funcionalidades

### Cálculo de Biorritmos
- **Físico**: Ciclo de 23 días que afecta la energía y resistencia
- **Emocional**: Ciclo de 28 días que influye en el estado de ánimo
- **Intelectual**: Ciclo de 33 días que impacta la capacidad mental

### Recomendaciones Personalizadas
- Nutrición adaptada a tu estado energético
- Rutinas de ejercicio según tu nivel físico
- Actividades creativas basadas en tu capacidad intelectual
- Prácticas de bienestar emocional

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.