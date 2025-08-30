# ⚽ Complu Logging - Sistema de Estadísticas de Fútbol

## 📱 Descripción
Aplicación web para registrar estadísticas de partidos de fútbol con dos equipos: PC A FAVOR y PC EN CONTRA. Permite contabilizar acciones como goles, tiros, penalties, etc., y enviar reportes por email.

## 🚀 Características
- **Pantalla Principal**: Navegación a las dos secciones
- **PC A FAVOR**: Estadísticas de ataque (goles, tiros, saques, etc.)
- **PC EN CONTRA**: Estadísticas de defensa (penalties)
- **Almacenamiento Local**: Los datos se guardan automáticamente en el navegador
- **Envío por Email**: Genera reportes HTML y los envía por email
- **Diseño Responsive**: Optimizado para tablet Android y otros dispositivos

## 📋 Estadísticas Registradas

### PC A FAVOR
- **SACA_BIEN**: Saques bien ejecutados
- **SACA_MAL**: Saques mal ejecutados
- **PARA_BIEN**: Pases bien ejecutados
- **PARA_MAL**: Pases mal ejecutados
- **GOL**: Goles marcados
- **TIRO_PORTERIA**: Tiros a portería
- **TIRO_FUERA**: Tiros fuera de la portería

### PC EN CONTRA
- **PENALTY**: Penalties concedidos
- **PENALTY_TONTO**: Penalties tontos concedidos

## 🎯 Jugadores Incluidos
1. Fer
2. Antuene
3. Juan Muñoz
4. Iván
5. David
6. Manu
7. Fresnillo
8. Ricardo
9. Jorge Fernández
10. Javi f
11. Mont
12. Bou
13. Lucas Pinto
14. José San Millán
15. Edu
16. Nico Gonzalo
17. Aarón
18. Juan García

## ⚙️ Configuración del Email

### Paso 1: Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### Paso 2: Configurar servicio de email
1. En EmailJS, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para autorizar
5. Anota el **Service ID**

### Paso 3: Crear plantilla de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa esta plantilla básica:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Reporte Complu Logging</title>
</head>
<body>
    <h1>Reporte de Partido</h1>
    <p><strong>Fecha:</strong> {{fecha}}</p>
    <p><strong>Asunto:</strong> {{subject}}</p>
    <div>{{message}}</div>
</body>
</html>
```

4. Anota el **Template ID**

### Paso 4: Obtener User ID
1. Ve a "Account" → "API Keys"
2. Copia tu **Public Key**

### Paso 5: Actualizar configuración
En `script.js`, actualiza estas líneas:

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'TU_SERVICE_ID_AQUI',
    templateId: 'TU_TEMPLATE_ID_AQUI',
    userId: 'TU_USER_ID_AQUI'
};
```

## 📱 Cómo usar en tu Tablet Android

### Opción 1: Servidor Local (Recomendado para desarrollo)
1. **En tu ordenador**: Abre una terminal en la carpeta del proyecto
2. **Ejecuta**: `python -m http.server 8000` (o instala Live Server en VS Code)
3. **En tu tablet**: Abre el navegador y ve a `http://TU_IP_ORDENADOR:8000`
4. **Para encontrar tu IP**: En Windows, ejecuta `ipconfig` en la terminal

### Opción 2: GitHub Pages (Recomendado para uso permanente)
1. **Crea un repositorio** en GitHub llamado `complu-logging`
2. **Sube los archivos** al repositorio
3. **Activa GitHub Pages** en Settings → Pages
4. **Accede desde tu tablet** a `https://TU_USUARIO.github.io/complu-logging`

### Opción 3: Netlify (Alternativa gratuita)
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto a la zona de deploy
3. Obtén una URL pública para acceder desde tu tablet

## 🎮 Cómo usar la aplicación

### 1. Pantalla Principal
- Verás la fecha actual
- Dos botones grandes: "PC A FAVOR" y "PC EN CONTRA"
- Botón "Enviar Reporte por Email" al final

### 2. Registrando Estadísticas
- **Navega** a la sección deseada
- **Toca los botones + y -** para incrementar/decrementar contadores
- **Los datos se guardan automáticamente** en tu tablet
- **Usa el botón "Volver"** para regresar al inicio

### 3. Enviando Reporte
- **En la pantalla principal**, toca "Enviar Reporte por Email"
- **Se generará un email HTML** con todas las estadísticas
- **Se enviará automáticamente** a la dirección configurada

## 🔧 Personalización

### Agregar/Quitar Jugadores
Edita el array `jugadores` en `script.js`:

```javascript
const jugadores = [
    'Nuevo Jugador',
    'Otro Jugador',
    // ... resto de jugadores
];
```

### Agregar Nuevas Estadísticas
1. **Agrega la columna** en el HTML correspondiente
2. **Actualiza el array de columnas** en JavaScript
3. **Modifica la función de email** para incluir la nueva estadística

## 🐛 Solución de Problemas

### Los contadores no funcionan
- Verifica que JavaScript esté habilitado en tu navegador
- Revisa la consola del navegador para errores

### El email no se envía
- Verifica que EmailJS esté configurado correctamente
- Revisa que las credenciales sean correctas
- Comprueba que el servicio de email esté activo

### La tabla no se muestra bien en la tablet
- Asegúrate de que el navegador esté actualizado
- Prueba con Chrome o Firefox
- Verifica que la orientación de la pantalla sea horizontal

## 📞 Soporte
Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Verifica que todos los archivos estén en la misma carpeta
3. Asegúrate de que el servidor web esté funcionando

## 📄 Licencia
Este proyecto es de uso libre para fines educativos y personales.

---

**¡Disfruta registrando las estadísticas de tu equipo! ⚽🏆** 