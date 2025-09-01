# 🏒 Complu Logging - Aplicación de Estadísticas de Hockey

> **Aplicación web moderna para registrar y sincronizar estadísticas de partidos de hockey entre múltiples dispositivos**

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://edumesones.github.io/complu_logging/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20Database-orange)](https://firebase.google.com/)

## 🚀 Características Principales

### 📊 **Estadísticas Completas**
- **🏆 PC A FAVOR**: SACA_BIEN, SACA_MAL, PARA_BIEN, PARA_MAL, GOL, TIRO_PORTERIA, TIRO_FUERA
- **🛡️ PC EN CONTRA**: PENALTY y PENALTY_TONTO
- **👤 Ana**: Gestión de disponibilidad de jugadores
- **🚀 MAXI**: Gestión avanzada con multiselección

### 🔄 **Sincronización Multi-Dispositivo**
- **Firebase Realtime Database** para sincronización automática
- **Datos consolidados** de todos los dispositivos
- **Tiempo real** - cambios instantáneos
- **Respaldo local** - funciona sin internet

### 📱 **Interfaz Moderna**
- **Responsive design** para tablets y móviles
- **18 jugadores** predefinidos
- **Contadores interactivos** con botones + y -
- **Reinicio automático diario**
- **Limpieza manual** de datos

## 🏗️ Arquitectura Técnica

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dispositivo A │    │   Dispositivo B │    │   Dispositivo C │
│   (Tablet)      │    │   (Móvil)       │    │   (PC)          │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      Firebase Cloud       │
                    │      Firestore DB         │
                    │   (Sincronización)        │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      EmailJS Service      │
                    │   (Reportes por Email)    │
                    └───────────────────────────┘
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Base de Datos**: Firebase Firestore (Realtime)
- **Email**: EmailJS
- **Hosting**: Netlify / GitHub Pages
- **Sincronización**: Firebase SDK

## 📱 Compatibilidad

| Plataforma | Navegador | Estado |
|------------|-----------|--------|
| **Android** | Chrome, Firefox | ✅ Perfecto |
| **iOS** | Safari, Chrome | ✅ Perfecto |
| **Windows** | Chrome, Firefox, Edge | ✅ Perfecto |
| **macOS** | Safari, Chrome | ✅ Perfecto |

> **❌ No requiere Java** - Solo navegador web moderno

## 🚀 Instalación y Configuración

### 1. 🔥 Configurar Firebase (NUEVO)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea proyecto: `complu-logging`
3. Habilita **Firestore Database**
4. Configura reglas de seguridad (ver `FIREBASE_SETUP.md`)
5. Copia configuración a `firebase-config.js`

### 2. 📧 Configurar EmailJS

1. Ve a [EmailJS](https://www.emailjs.com/)
2. Crea cuenta gratuita
3. Configura servicio de email
4. Crea plantilla HTML
5. **User ID se pide al usuario** (más seguro)

### 3. 🌐 Desplegar en Netlify

#### **OPCIÓN A: Drag & Drop (Recomendado)**
```bash
# 1. Comprimir tu carpeta
# 2. Ir a netlify.com
# 3. Arrastrar archivo ZIP
# 4. ¡Listo!
```

#### **OPCIÓN B: Desde GitHub**
```bash
# 1. Subir a GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Conectar Netlify con GitHub
# 3. Deploy automático
```

## 🔒 Seguridad

### ✅ **Configuración Segura**
- **Firebase API Key**: Pública (diseñada para ser expuesta)
- **EmailJS User ID**: Se pide al usuario (no en código)
- **Reglas Firestore**: Controlan acceso a datos
- **Repositorio público**: 100% seguro

### 🛡️ **Protección de Datos**
- Solo estadísticas deportivas (no datos personales)
- Acceso controlado por reglas de Firestore
- Datos se limpian automáticamente cada día

## 📊 Uso Diario

### **Flujo de Trabajo**
1. **Abrir aplicación** en cualquier dispositivo
2. **Registrar estadísticas** con botones + y -
3. **Datos se sincronizan** automáticamente
4. **Enviar reporte** consolidado por email
5. **Contadores se reinician** automáticamente

### **Ejemplo Multi-Dispositivo**
```
Dispositivo A: Fer - 5 goles
Dispositivo B: Fer - 3 goles
Dispositivo C: Fer - 2 goles
─────────────────────────
Resultado: Fer - 10 goles totales
```

## 📁 Estructura del Proyecto

```
complu_logging/
├── 📄 index.html              # Página principal
├── 📄 pc-favor.html           # Estadísticas PC A FAVOR
├── 📄 pc-contra.html          # Estadísticas PC EN CONTRA
├── 📄 ana.html                # Gestión de jugadores
├── 📄 maxi.html               # Gestión avanzada
├── 📄 script.js               # Lógica principal
├── 📄 styles.css              # Estilos modernos
├── 📄 firebase-config.js      # Configuración Firebase
├── 📄 netlify.toml            # Configuración Netlify
├── 📄 FIREBASE_SETUP.md       # Guía Firebase
└── 📄 README.md               # Este archivo
```

## 🎯 Estadísticas Disponibles

### **🏆 PC A FAVOR**
| Estadística | Descripción |
|-------------|-------------|
| SACA_BIEN | Saques exitosos |
| SACA_MAL | Saques fallidos |
| PARA_BIEN | Paradas exitosas |
| PARA_MAL | Paradas fallidas |
| GOL | Goles marcados |
| TIRO_PORTERIA | Tiros a portería |
| TIRO_FUERA | Tiros fuera |

### **🛡️ PC EN CONTRA**
| Estadística | Descripción |
|-------------|-------------|
| PENALTY | Penalties cometidos |
| PENALTY_TONTO | Penalties tontos |

### **👤 Ana - Gestión de Jugadores**
- Selección de jugador
- Estado de disponibilidad (SI/NO)
- Notas adicionales

### **🚀 MAXI - Gestión Avanzada**
- Multiselección de jugadores
- Tipos: ATAQUE, DEFENSA, N/A
- Notas detalladas

## 📧 Configuración de Email

### **Plantilla EmailJS**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Reporte Complu Logging - Hockey</title>
    <style>
        /* Estilos modernos incluidos */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏒 Reporte Complu Logging</h1>
        </div>
        
        <div class="fecha-info">
            <h3>📅 Información del Partido</h3>
            <p><strong>Fecha:</strong> {{fecha}}</p>
        </div>
        
        <div class="section">
            <h2>🏆 PC A FAVOR</h2>
            {{{tabla_favor}}}
        </div>
        
        <div class="section">
            <h2>🛡️ PC EN CONTRA</h2>
            {{{tabla_contra}}}
        </div>
        
        <div class="section ana-section">
            <h2>👤 Ana - Gestión de Jugadores</h2>
            {{{seccion_ana}}}
        </div>
        
        <div class="section maxi-section">
            <h2>🚀 MAXI - Gestión Avanzada</h2>
            {{{seccion_maxi}}}
        </div>
        
        <div class="section">
            <h2>📊 Resumen</h2>
            {{{resumen}}}
        </div>
    </div>
</body>
</html>
```

### **Destinatarios**
- `e.gzlzmesones@gmail.com`
- `cristian26gonzalez@gmail.com`

## 🐛 Solución de Problemas

### **❌ Email no se envía**
```bash
# 1. Verificar consola del navegador (F12)
# 2. Comprobar User ID de EmailJS
# 3. Verificar conexión a internet
```

### **❌ Datos no se sincronizan**
```bash
# 1. Verificar configuración Firebase
# 2. Comprobar reglas de Firestore
# 3. Revisar consola para errores
```

### **❌ No funciona en tablet**
```bash
# 1. Usar Chrome o Firefox
# 2. Verificar conexión a internet
# 3. Limpiar caché del navegador
```

## 🔄 Changelog

### **v2.0.0 - Firebase Integration**
- ✅ Sincronización multi-dispositivo
- ✅ Interfaz Ana y MAXI
- ✅ Datos consolidados en emails
- ✅ Limpieza automática global

### **v1.0.0 - Initial Release**
- ✅ Estadísticas básicas
- ✅ Email con EmailJS
- ✅ Interfaz responsive

## 📞 Soporte

### **Documentación**
- [Firebase Setup](FIREBASE_SETUP.md)
- [EmailJS Documentation](https://www.emailjs.com/docs/)

### **Contacto**
- **Desarrollador**: Asistente AI
- **Proyecto**: Complu Logging Hockey
- **Versión**: 2.0.0

---

<div align="center">

**🏒 Desarrollado para Complu Logging Hockey**  
*Sincronización multi-dispositivo con Firebase*

[![Netlify](https://img.shields.io/badge/Netlify-Hosted-blue)](https://netlify.com)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-orange)](https://firebase.google.com)
[![EmailJS](https://img.shields.io/badge/EmailJS-Email-green)](https://emailjs.com)

</div>