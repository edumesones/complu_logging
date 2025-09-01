# ⚽ Complu Logging - Aplicación de Estadísticas de Fútbol

Aplicación web para registrar y enviar estadísticas de partidos de fútbol por email.

## 🚀 Características

- **PC A FAVOR**: Registro de SACA_BIEN, SACA_MAL, PARA_BIEN, PARA_MAL, GOL, TIRO_PORTERIA, TIRO_FUERA
- **PC EN CONTRA**: Registro de PENALTY y PENALTY_TONTO
- **18 jugadores** predefinidos
- **Envío automático por email** con reportes en HTML
- **Reinicio automático diario** de contadores
- **Botón manual** para limpiar datos
- **Interfaz responsive** para tablets Android

## 📱 Compatibilidad

- ✅ **PC/Desktop** (Chrome, Firefox, Safari, Edge)
- ✅ **Tablets Android** (Chrome, Firefox)
- ✅ **Dispositivos iOS** (Safari)
- ❌ **No requiere Java** - Solo navegador web

## 🛠️ Instalación y Configuración

### 1. Configurar EmailJS (SEGURO para repositorios públicos)

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Configura un servicio de email (Gmail, Outlook, etc.)
4. Crea una plantilla de email
5. **IMPORTANTE**: Crea el archivo `config.local.js` con tus credenciales reales

### 2. Configurar GitHub Pages

1. Ve a tu repositorio: [https://github.com/edumesones/complu_logging](https://github.com/edumesones/complu_logging)
2. Ve a **Settings** → **Pages**
3. En **Source**, selecciona **Deploy from a branch**
4. En **Branch**, selecciona **main** y **/(root)**
5. Haz clic en **Save**
6. Espera unos minutos para que se despliegue

### 3. Acceder desde tu Tablet

- **URL pública**: `https://edumesones.github.io/complu_logging/`
- **Acceso directo**: Crea un bookmark en tu tablet
- **Funciona offline**: Los datos se guardan localmente

## 🔒 Seguridad para Repositorios Públicos

### ¿Por qué es seguro?
- **`config.js`**: Contiene valores de ejemplo (NO reales)
- **GitHub Secrets**: Almacena credenciales reales de forma segura
- **GitHub Actions**: Construye la aplicación con credenciales seguras
- **Tu repositorio puede ser público** sin exponer credenciales

### Archivos de configuración:
- ✅ `config.js` → Se sube a GitHub (valores de ejemplo para desarrollo)
- ✅ **GitHub Secrets** → Almacena credenciales reales de forma segura
- ❌ `config.prod.js` → NO se sube a GitHub (generado automáticamente)
- ❌ `.env` → NO se sube a GitHub (variables de entorno)

## 📧 Configuración de EmailJS

### PASO 1: Configurar GitHub Secrets

Ve a tu repositorio en GitHub → **Settings** → **Secrets and variables** → **Actions**

Crea estos 4 secrets:

| Secret Name | Valor |
|-------------|-------|
| `EMAILJS_SERVICE_ID` | `service_xxxxxxx` (tu Service ID real) |
| `EMAILJS_TEMPLATE_ID` | `template_xxxxxxx` (tu Template ID real) |
| `EMAILJS_USER_ID` | `user_xxxxxxxxxxxxxxx` (tu User ID real) |
| `EMAILJS_TO_EMAIL` | `tu-email@gmail.com, otro-email@gmail.com` (tus emails reales) |

### PASO 2: Archivo `config.js` (desarrollo local)

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'service_xxxxxxx',        // VALOR DE EJEMPLO
    templateId: 'template_xxxxxxx',      // VALOR DE EJEMPLO
    userId: 'user_xxxxxxxxxxxxxxx',      // VALOR DE EJEMPLO
    toEmail: 'tu-email@gmail.com, otro-email@gmail.com'  // VALOR DE EJEMPLO
};
```

**✅ SEGURO**: Este archivo contiene valores de ejemplo para desarrollo local.

### Plantilla EmailJS

Usa esta plantilla HTML en EmailJS:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Reporte Complu Logging</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .jugador { text-align: left; font-weight: bold; min-width: 120px; }
        .total-row { background-color: #e8f5e8; font-weight: bold; }
        .fecha-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196F3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚽ Reporte Complu Logging</h1>
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
        
        <div class="section">
            <h2>📊 Resumen</h2>
            {{{resumen}}}
        </div>
    </div>
</body>
</html>
```

**IMPORTANTE**: Usa `{{{tabla_favor}}}`, `{{{tabla_contra}}}` y `{{{resumen}}}` (triple llave) para renderizar HTML.

## 🔄 Uso Diario

1. **Abrir la aplicación** en tu tablet
2. **Registrar estadísticas** usando los botones + y -
3. **Enviar reporte** con el botón "📧 Enviar Reporte por Email"
4. **Los contadores se reinician automáticamente** cada día
5. **Usar "Limpiar Datos"** para reset manual

## 📁 Estructura del Proyecto

```
complu_logging/
├── index.html          # Página principal
├── pc-favor.html       # Tabla PC A FAVOR
├── pc-contra.html      # Tabla PC EN CONTRA
├── script.js           # Lógica JavaScript
├── styles.css          # Estilos CSS
├── config.js           # Configuración EmailJS
└── README.md           # Este archivo
```

## 🚀 DESPLIEGUE EN NETLIFY (RECOMENDADO)

### ✅ VENTAJAS DE NETLIFY:

- **Más rápido** que GitHub Pages
- **Sin problemas** de credenciales
- **HTTPS automático** incluido
- **CDN global** para mejor rendimiento
- **Dominio personalizado** opcional

### PASO 1: Preparar archivos

1. **Eliminar archivos innecesarios**:
   ```bash
   rm -rf .github/
   rm config.js
   rm package.json
   ```

2. **Mantener solo**:
   - `index.html`
   - `pc-favor.html`
   - `pc-contra.html`
   - `styles.css`
   - `script.js`
   - `netlify.toml`

### PASO 2: Desplegar en Netlify

#### **OPCIÓN A: Arrastrar y Soltar (Más Fácil)**

1. Ve a [netlify.com](https://netlify.com)
2. **Sign up** con tu cuenta de GitHub
3. **Drag & Drop** tu carpeta del proyecto
4. **¡Listo!** Tu app estará online

#### **OPCIÓN B: Desde GitHub (Más Profesional)**

1. **Sube tu código** a GitHub
2. En Netlify: **New site from Git**
3. Selecciona tu repositorio
4. **Deploy** automático

### PASO 3: Configurar dominio

- **URL automática**: `https://random-name.netlify.app`
- **HTTPS**: Automático y gratuito

### PASO 4: Probar la aplicación

1. **Accede** a tu URL de Netlify
2. **Prueba** las funcionalidades
3. **Envía email** (se pedirán credenciales)
4. **Verifica** que funcione en tu tablet

### Servidor Local (Desarrollo)
```bash
python -m http.server 8000
# Luego abrir http://localhost:8000
```

## 📧 Emails Destino

Los reportes se envían a:
- `e.gzlzmesones@gmail.com`
- `cristian26gonzalez@gmail.com`

## 🐛 Solución de Problemas

### Email no se envía
1. Verifica configuración EmailJS en `config.js`
2. Revisa la consola del navegador
3. Verifica que EmailJS esté cargado

### Datos no se guardan
1. Verifica que localStorage esté habilitado
2. Limpia caché del navegador
3. Usa botón "Limpiar Datos" para reset

### No funciona en tablet
1. Verifica conexión a internet
2. Usa Chrome o Firefox
3. Accede desde la URL de GitHub Pages

## 📞 Soporte

Para problemas técnicos:
1. Revisa la consola del navegador (F12)
2. Verifica la configuración de EmailJS
3. Comprueba que GitHub Pages esté activado

---

**Desarrollado para Complu Logging** ⚽ / /   A c t i v a c i � n   d e   G i t H u b   A c t i o n s 
 
 