# 🔥 Configuración Firebase para Complu Logging

## 📋 Pasos para configurar Firebase

### 1. Crear proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto"
3. Nombre: `complu-logging` (o el que prefieras)
4. Desactiva Google Analytics (no lo necesitamos)
5. Haz clic en "Crear proyecto"

### 2. Habilitar Firestore Database
1. En el menú lateral, haz clic en "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (30 días gratis)
4. Selecciona la ubicación más cercana (ej: `europe-west1`)
5. Haz clic en "Listo"

### 3. Configurar reglas de seguridad
1. En Firestore Database, ve a la pestaña "Reglas"
2. Reemplaza las reglas existentes con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura a todos los usuarios
    // (Para tu caso de uso, esto es seguro ya que solo es para estadísticas deportivas)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Haz clic en "Publicar"

### 4. Obtener configuración
1. En el menú lateral, haz clic en el ícono de engranaje ⚙️
2. Selecciona "Configuración del proyecto"
3. Ve a la pestaña "General"
4. Baja hasta "Tus apps" y haz clic en el ícono de web `</>`
5. Registra la app con el nombre "Complu Logging"
6. **NO** marques "También configurar Firebase Hosting"
7. Haz clic en "Registrar app"

### 5. Copiar configuración
1. Copia el objeto `firebaseConfig` que aparece
2. Reemplaza el contenido de `firebase-config.js` con tu configuración real

### 6. Ejemplo de configuración final
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-tu-api-key-real",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🚀 Cómo funciona la sincronización

### Estructura de datos en Firebase:
```
/dias/{fecha}/
  ├── pc_favor/{jugador}/{estadistica}: valor
  ├── pc_contra/{jugador}/{estadistica}: valor
  ├── ana/{jugador}: {disponible, texto, timestamp}
  └── maxi/{id}: {jugadores, tipo, texto, timestamp}
```

### Flujo de sincronización:
1. **Usuario cambia contador** → Se guarda en localStorage + Firebase
2. **Otro dispositivo** → Ve los cambios en tiempo real
3. **Envío de email** → Obtiene datos consolidados de Firebase
4. **Limpieza** → Elimina datos de Firebase + localStorage

## 💡 Ventajas de esta implementación:

✅ **Sincronización automática** entre dispositivos
✅ **Sin servidor** - todo desde el cliente
✅ **Gratis** para tu uso (50,000 lecturas/día)
✅ **Tiempo real** - cambios instantáneos
✅ **Respaldo local** - funciona sin internet
✅ **Consolidación automática** en emails

## 🔧 Solución de problemas

### Error: "Firebase not initialized"
- Verifica que `firebase-config.js` tenga la configuración correcta
- Asegúrate de que los scripts de Firebase se cargan antes que `script.js`

### Error: "Permission denied"
- Verifica las reglas de Firestore
- Asegúrate de que permiten lectura/escritura

### No se sincronizan los datos
- Verifica la consola del navegador para errores
- Asegúrate de que Firebase esté inicializado correctamente

## 📱 Uso en múltiples dispositivos

1. **Dispositivo A**: Registra 5 goles para Fer
2. **Dispositivo B**: Registra 3 goles para Fer
3. **Resultado**: Firebase consolida automáticamente = 8 goles totales
4. **Email**: Envía el total consolidado de todos los dispositivos

¡**Perfecto para tu caso de uso!** 🎯 